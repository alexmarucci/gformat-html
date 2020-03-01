'use strict'

var xtend = require('xtend')
var svg = require('property-information/svg')
var find = require('property-information/find')
var spaces = require('space-separated-tokens').stringify
var commas = require('comma-separated-tokens').stringify
var entities = require('stringify-entities')
var all = require('./all')
var constants = require('./constants')
const repeat = require('repeat-string')

module.exports = element

/* Constants. */
var emptyString = ''

/* Characters. */
var space = ' '
var quotationMark = '"'
var apostrophe = "'"
var equalsTo = '='
var lessThan = '<'
var greaterThan = '>'
var slash = '/'
var newLine = '\n'

/* Stringify an element `node`. */
function element(ctx, node, index, parent, printWidthOffset, innerTextLength) {
  var parentSchema = ctx.schema
  var name = node.tagName
  var value = ''
  var selfClosing
  var closingTagWidth = 0
  var close
  var omit
  var root = node
  var content
  var attrs
  var indentLevel = getNodeData(node, 'indentLevel', 0)
  var printContext = {
    offset: printWidthOffset,
    wrapAttributes: false,
    indentLevel
  }
  var isVoid = ctx.voids.indexOf(name) !== -1
  var ignoreAttrCollapsing =
    getNodeData(node, 'ignore', false) || getNodeData(node, 'preserveAttrWrapping', false)

  if (parentSchema.space === 'html' && name === 'svg') {
    ctx.schema = svg
  }

  if (ctx.schema.space === 'svg') {
    omit = false
    close = true
    selfClosing = ctx.closeEmpty
  } else {
    omit = ctx.omit
    close = ctx.close
    selfClosing = isVoid
  }

  // check for 'selfClosing' property set by hast-util-from-webparser package
  // in order to support custom self-closing elements
  if (selfClosing === false) {
    selfClosing = getNodeData(node, 'selfClosing', false)
  }

  // <
  printContext.offset += lessThan.length
  closingTagWidth += lessThan.length

  // /
  closingTagWidth += slash.length

  // tagName length
  printContext.offset += node.tagName.length
  closingTagWidth += node.tagName.length

  // / closing tag
  if (selfClosing && !isVoid) {
    printContext.offset += slash.length
  }

  // >
  printContext.offset += greaterThan.length
  closingTagWidth += greaterThan.length

  const propertyCount = Object.keys(node.properties).length

  // force to wrap attributes on multiple lines when the node contains
  // more than one attribute
  if (propertyCount > 1 && ctx.wrapAttributes) {
    printContext.wrapAttributes = true
  }

  // one space before each attribute
  if (propertyCount) {
    printContext.offset += propertyCount * space.length
  }

  // represent the length of the inner text of the node
  printContext.offset += innerTextLength

  attrs = attributes(ctx, node.properties, printContext, ignoreAttrCollapsing, node)

  // calculate element width without closing tag
  const elementWidth = printContext.offset + (selfClosing ? 0 : closingTagWidth)

  const shouldCollapse =
    (ignoreAttrCollapsing === false && printContext.wrapAttributes) || elementWidth > ctx.printWidth

  content = all(ctx, root)

  /* If the node is categorised as void, but it has
   * children, remove the categorisation.  This
   * enables for example `menuitem`s, which are
   * void in W3C HTML but not void in WHATWG HTML, to
   * be stringified properly. */
  selfClosing = content ? false : selfClosing

  if (attrs || !omit || !omit.opening(node, index, parent)) {
    value = lessThan + name

    if (attrs) {
      // add no space after tagName when element is collapsed
      value += space + attrs
    }

    let selfClosed = false

    // check if the should close self-closing elements
    if (selfClosing && close) {
      if ((!ctx.tightClose || attrs.charAt(attrs.length - 1) === slash) && !shouldCollapse) {
        value += space
      }

      selfClosed = true
      value = value.trim() + space + slash
    }

    // allow any element to self close itself except known HTML void elements
    else if (selfClosing && !isVoid) {
      if (shouldCollapse) {
        value += repeat(ctx.tabWidth, printContext.indentLevel)
      }

      selfClosed = true
      value += slash
    }

    // add newline when element should be wrappend on multiple lines
    if (shouldCollapse) {
      value += greaterThan + newLine + repeat(ctx.tabWidth, printContext.indentLevel + (content ? 1 : 0))
    } else {
      value += greaterThan
    }
  }

  value += content

  if (!selfClosing && (!omit || !omit.closing(node, index, parent))) {
    value += (shouldCollapse && content ? newLine : '') + lessThan + slash + name + greaterThan
  }

  ctx.schema = parentSchema

  return value
}

/* Stringify all attributes. */
function attributes(ctx, props, printContext, ignoreIndent, node) {
  let attributesWidth = 0;
  const nodeOffset =
    ctx.tabWidth.length * printContext.indentLevel +
    node.tagName.length +
    2 /* 1 space + open tag symbol = 2 chars */
  var values = []
  var key
  var value
  var result
  var length
  var index
  var last

  for (key in props) {
    value = props[key]

    if (value == null) {
      continue
    }

    result = attribute(ctx, key, value)

    printContext.offset += result.length
    attributesWidth += result.length

    if (result) {
      values.push(result)
    }
  }

  // Wrap only if open tag exceed regardless of its content or closing tag
  const openTagOffset = (printContext.indentLevel * ctx.tabWidth.length) +
      node.tagName.length + 2 + (node.data.selfClosing ? 1 : 0) +
      attributesWidth;

  const offset = props.length ? openTagOffset : printContext.offset;
  if (ignoreIndent === false && offset > ctx.printWidth) {
    printContext.wrapAttributes = true
  }

  length = values.length
  index = -1

  while (++index < length) {
    result = values[index]
    last = null
    /* In tight mode, don’t add a space after quoted attributes. */
    if (last !== quotationMark && last !== apostrophe) {
      if (printContext.wrapAttributes && index > 0) {
        values[index] = newLine + repeat(space, nodeOffset) + result
      } else if (index !== length - 1 && !(printContext.wrapAttributes && index === 0)) {
        values[index] = result + space
      } else {
        values[index] = result
      }
    }
  }

  return values.join(emptyString)
}

/* Stringify one attribute. */
function attribute(ctx, key, value) {
  var schema = ctx.schema
  var info = find(schema, key)
  var name = info.attribute

  if (value == null || (typeof value === 'number' && isNaN(value)) || (value === false && info.boolean)) {
    return emptyString
  }

  name = attributeName(ctx, name)

  if ((value === true && info.boolean) || (value === true && info.overloadedBoolean)) {
    return name
  }

  return name + attributeValue(ctx, key, value, info)
}

/* Stringify the attribute name. */
function attributeName(ctx, name) {
  // Always encode without parse errors in non-HTML.
  var valid = ctx.schema.space === 'html' ? ctx.valid : 1
  var subset = constants.name[valid][ctx.safe]

  return entities(name, xtend(ctx.entities, { subset: subset }))
}

/* Stringify the attribute value. */
function attributeValue(ctx, key, value, info) {
  var quote = ctx.quote

  if (typeof value === 'object' && 'length' in value) {
    /* `spaces` doesn’t accept a second argument, but it’s
     * given here just to keep the code cleaner. */
    value = (info.commaSeparated ? commas : spaces)(value, {
      padLeft: !ctx.tightLists
    })
  }

  value = String(value)

  // When attr has no value we avoid quoting
  if (value === '') {
    return value
  } else {
    value = equalsTo + quote + value + quote
  }

  return value
}

function getNodeData(node, key, defaultValue) {
  let data = node.data || {}
  return data[key] || defaultValue
}

function calculateElementWidth(node) {
  if (node.type === 'element' && node.position) {
    const startColumn = node.position.start.column
    const endColumn = node.position.end.column
    const closingTagWidth = node.data.selfClosing ? node.tagName.length + 3 : 0

    return endColumn - startColumn - closingTagWidth
  }

  return 1
}
