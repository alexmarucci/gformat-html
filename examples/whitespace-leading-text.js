const vfile = require('to-vfile')
const prettyhtml = require('./../packages/gformat-html')

const base = 'packages/prettyhtml-formatter/test/fixtures/'
const filename = 'whitespace-leading-text/input.html'

// example with angular template
try {
  const result = prettyhtml(vfile.readSync(base + filename))
  console.log(result.contents)
} catch (error) {
  console.error(error)
}
