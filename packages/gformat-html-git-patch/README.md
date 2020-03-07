# gformat-html-git-patch

Runs [gFormatHtml](https://github.com/alexmarucci/gformat-html) on your changed (based on Git) files.

Example:

```
gformat-html-git-patch
🔍  Finding changed files since git revision 2eb4337.
🎯  Found 1 changed file.
    ☝  printWidth: 80, tabWidth: 2
✍️  Fixing up test.html.
✅  Everything is awesome!
```

## Install

```shellsession
npm install --save-dev gformat-html-git-patch
```

## Usage

With [`npx`](https://npm.im/npx): (No install required)

```shellsession
npx gformat-html-git-patch
```

## Pre-Commit Hook

You can run `gformat-html-git-patch` as a pre-commit hook using [`husky`](https://github.com/typicode/husky).

```shellstream
yarn add --dev husky
```

In `package.json`'s `"scripts"` section, add:

```
"precommit": "gformat-html-git-patch"
```

## CLI Flags

### `-s --staged`

Only staged files will be formatted, and they will be re-staged after formatting.

## Formatter options

We use prettier [`resolveConfig`](https://prettier.io/docs/en/api.html#prettierresolveconfigfilepath-options) to indentify your tabWidth and printWidth. It will fallback to `.editorconfig`.
