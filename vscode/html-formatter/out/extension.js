"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gformatHtml = require("gformat-html");
const vscode = require("vscode");
class HTMLDocumentFormatter {
    provideDocumentFormattingEdits(document, options) {
        return this.doFormatDocument(document, options);
    }
    provideDocumentRangeFormattingEdits(document, range, options) {
        return this.doFormatDocument(document, options, range);
    }
    doFormatDocument(document, options, range) {
        const extensionOptions = this.constructFormatterOptions(document, options);
        const text = this.getTextInRange(document, range);
        const docRange = range ||
            new vscode.Range(document.positionAt(0), document.positionAt(text.length));
        const formattedDocument = gformatHtml(text, extensionOptions).contents;
        return Promise.resolve([new vscode.TextEdit(docRange, formattedDocument)]);
    }
    constructFormatterOptions(document, options) {
        var _a;
        const extensionConfig = vscode.workspace.getConfiguration('gformathtml');
        const prettyHtmlConfig = Object.assign({}, extensionConfig);
        const editorOptions = ((_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.options) ||
            {};
        const lang = document.languageId, uri = document.uri;
        const langConfig = vscode.workspace.getConfiguration(`[${lang}]`, uri);
        const config = vscode.workspace.getConfiguration('editor', uri);
        const printWidth = langConfig['editor.wordWrapColumn'] || config.get('wordWrapColumn', 80);
        const tabWidth = Number(editorOptions.tabSize) || options.tabSize;
        const useTabs = !(editorOptions.insertSpaces || options.insertSpaces);
        /* eslint-disable curly */
        if (printWidth)
            prettyHtmlConfig.printWidth = printWidth;
        if (tabWidth)
            prettyHtmlConfig.tabWidth = tabWidth;
        if (useTabs)
            prettyHtmlConfig.useTabs = useTabs;
        if (printWidth)
            prettyHtmlConfig.printWidth = printWidth;
        /* eslint-enable curly */
        if (extensionConfig.forceWrapAttributes) {
            prettyHtmlConfig.wrapAttributes = true;
        }
        const prettierConfig = extensionConfig.usePrettier ? { prettier: Object.assign({}, prettyHtmlConfig) } : {};
        return Object.assign(Object.assign({}, prettyHtmlConfig), prettierConfig);
    }
    getTextInRange(document, range) {
        const codeContent = document.getText();
        if (range) {
            let startOffset = document.offsetAt(range.start);
            let endOffset = document.offsetAt(range.end);
            return codeContent.slice(startOffset, endOffset);
        }
        return codeContent;
    }
}
function activate(context) {
    const formatter = new HTMLDocumentFormatter();
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('html', formatter));
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('html', formatter));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code
// below import {format} from 'path'; import * as vscode from 'vscode';
// import * as prettyHtml from '../../../packages/gformat-html';
// export function activate(context: vscode.ExtensionContext) {
//   // whole document formatting
//   context.subscriptions.push(
//       vscode.languages.registerDocumentFormattingEditProvider(
//           {language: 'html'}, {
//             provideDocumentFormattingEdits: (document, options) => {
//               const formattedDocument =
//               prettyHtml(document.getText()).contents; const range = new
//               vscode.Range(
//                   // line 0, char 0:
//                   0, 0,
//                   // last line:
//                   document.lineCount,
//                   // last character:
//                   document.lineAt(document.lineCount -
//                   1).range.end.character);
//               return [new vscode.TextEdit(range, formattedDocument)];
//             }
//           }));
// }
// // this method is called when your extension is activated
// // your extension is activated the very first time the command is executed
// // export function activate(context: vscode.ExtensionContext) {
// //   // 👍 formatter implemented using API
// //   const ext =
// //   vscode.languages.registerDocumentFormattingEditProvider('html', {
// //     provideDocumentFormattingEdits(
// //         document: vscode.TextDocument, options: vscode.FormattingOptions):
// //         vscode.TextEdit[] {
// //           const range = new vscode.Range(
// //               // line 0, char 0:
// //               0, 0,
// //               // last line:
// //               document.lineCount,
// //               // last character:
// //               document.lineAt(document.lineCount -
// 1).range.end.character);
// //           const formattedDocument =
// prettyHtml(document.getText()).contents;
// //           console.log(formattedDocument);
// //           return [new vscode.TextEdit(range, formattedDocument)];
// //           // return new PrettyHtmlFormatter(document, options).format();
// //         }
// //   });
// //   context.subscriptions.push(ext);
// // }
// class PrettyHtmlFormatter {
//   /** @param document The VS Code document to format. */
//   constructor(
//       private readonly document: vscode.TextDocument,
//       private readonly options?: vscode.FormattingOptions) {
//     this.options = this.options || {insertSpaces: false, tabSize: 4};
//     if (typeof this.options.insertSpaces === undefined) {
//       this.options.insertSpaces = false;
//     }
//     if (typeof this.options.tabSize !== 'number' ||
//         isNaN(this.options.tabSize)) {
//       this.options.tabSize = 2;
//     }
//     this.options.tabSize = Math.max(0, 2);
//   }
//   /**
//    * Format a text range and return a text edit array compatible with VS Code
//    * formatting providers.
//    */
//   format(range?: vscode.Range): vscode.TextEdit[] {
//     // format the whole document if no range is provided by VS code
//     range = range ||
//         new vscode.Range(
//             // line 0, char 0:
//             0, 0,
//             // last line:
//             this.document.lineCount,
//             // last character:
//             this.document.lineAt(this.document.lineCount - 1)
//                 .range.end.character);
//     const formattedDocument = prettyHtml(this.document.getText()).contents;
//     return [new vscode.TextEdit(range, formattedDocument)];
//     // xml.Compiler.formatXmlString(this.document.getText())
//     //     .then(formattedXml => {
//     //       resolve([new vscode.TextEdit(range, formattedXml)]);
//     //     })
//     //     .catch(err => {
//     //       XmlFormatter.showFormattingErrorMessage(err);
//     //       reject();
//     //     });
//   }
//   private constructPrettyHtmlOptions() {}
// }
// // this method is called when your extension is deactivated
// export function deactivate() {}
//# sourceMappingURL=extension.js.map