const vfile = require('to-vfile')
const prettyhtml = require('./../packages/prettyhtml')

const base = 'packages/prettyhtml-formatter/test/fixtures/'
const filename = 'print-width-self-closing/input.html'

// example with angular template
try {
  const result = prettyhtml(vfile.readSync(base + filename))
  vfile.writeSync({path: './test.html', contents: result.contents})
  console.log(result.contents)
} catch (error) {
  console.error(error)
}
