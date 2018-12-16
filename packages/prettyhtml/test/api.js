const test = require('ava')
const prettyhtml = require('..')

test('Should format with default settings', t => {
  const result = prettyhtml(
    `<form #heroForm (ngSubmit)="onSubmit(heroForm)"><input type="text" [(onChange)]="dede" name="test" /><button [style.color]="isSpecial ? 'red' : 'green'"></button></form>`
  )
  t.snapshot(result)
})
