const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
try {
  const result = prettyhtml(
      `<form #heroForm (ngSubmit)="onSubmit(heroForm)"><input type="text" [(onChange)]="dede" name="test" />
      <button [style.color]="isSpecial ? 'red' : 'green'"></button></form>

      <h1 type="text"
          [(onChange)]="dede"
          name="test"></h1>`,
      {wrapAttributes: false, printWidth: 43});
  console.log(result.contents)
} catch (error) {
  console.error(error)
}
