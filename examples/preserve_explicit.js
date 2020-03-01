const vfile = require('to-vfile')
const prettyhtml = require('./../packages/prettyhtml')

const base = 'packages/prettyhtml-formatter/test/fixtures/'
const filename = 'preserve-explicit-namespace/input.html'

// example with angular template
try {
  const result = prettyhtml(`<h1>lorem ipsum aldfkjdflkjadflkdjafl;akjf;lakdjf;aldkfja;ldkfjad;lkfja;lfkja;lfkajl;kdjf;lakdjf;ldkfja;ldfkja;lfkja;dlfkjd;flkjasdf;lkajdsf;lkasjdfl;kadfj;lakdjf</h1>` + vfile.readSync(base + filename).toString())
  console.log(result.contents)
} catch (error) {
  console.error(error)
}
