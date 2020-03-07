const vfile = require('to-vfile')
const prettyhtml = require('./../packages/gformat-html')

const base = 'packages/prettyhtml-formatter/test/fixtures/'
const filename = 'vue/input.html'

// example with angular template
try {
  const result = prettyhtml(vfile.readSync(base + filename), {
    tabWidth: 2,
    useTabs: true,
  })
  console.log(result.contents)
  vfile.writeSync({path: './test.html', contents: result.contents})
} catch (error) {
  console.error(error)
}

