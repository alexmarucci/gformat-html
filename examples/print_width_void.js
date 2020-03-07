const vfile = require('to-vfile')
const prettyhtml = require('./../packages/gformat-html')

const base = 'packages/prettyhtml-formatter/test/fixtures/'
const filename = 'print-width-void/input.html'

// example with angular template
try {
  const result = prettyhtml(vfile.readSync(base + filename))
  vfile.writeSync({path: './test.html', contents: result.contents})
  console.log(result.contents)
} catch (error) {
  console.error(error)
}
