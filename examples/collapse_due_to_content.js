const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
try {
  const result = prettyhtml(
    `<h1>lorem ipsum aldfkjdflkjadflkdjafl;akjf;lakdjf;aldkfja;ldkfjad;lkfja;lfkja;lfkajl;kdjf;lakdjf;ldkfja;ldfkja;lfkja;dlfkjd;flkjasdf;lkajdsf;lkasjdfl;kadfj;lakdjf</h1>`,
    { wrapAttributes: false, printWidth: 43 }
  )
  console.log(result.contents)
} catch (error) {
  console.error(error)
}
