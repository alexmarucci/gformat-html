const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
try {
  const result = prettyhtml(
    `<h1 id="abce" class="abdasldkj" alt="aldkjadflakjdalfalkfajlfkajflkafjalkdfjalfkdjflkajfalkj">Hello</h1> `,
    { wrapAttributes: false, printWidth: 43 }
  )
  console.log(result.contents)
} catch (error) {
  console.error(error)
}
