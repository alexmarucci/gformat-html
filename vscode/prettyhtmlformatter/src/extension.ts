import * as gformatHtml from 'gformat-html';
import * as vscode from 'vscode';

class HTMLDocumentFormatter implements vscode.DocumentFormattingEditProvider {
  public provideDocumentFormattingEdits(
      document: vscode.TextDocument,
      options: vscode.FormattingOptions): Thenable<vscode.TextEdit[]> {
    return this.doFormatDocument(document, options);
  }

  public provideDocumentRangeFormattingEdits(
      document: vscode.TextDocument, range: vscode.Range,
      options: vscode.FormattingOptions): Thenable<vscode.TextEdit[]> {
    return this.doFormatDocument(document, options, range);
  }

  private doFormatDocument(
      document: vscode.TextDocument, options: vscode.FormattingOptions,
      range?: vscode.Range): Thenable<vscode.TextEdit[]> {
    const extensionOptions = this.constructFormatterOptions(document, options);
    const text = this.getTextInRange(document, range);
    const docRange = range ||
        new vscode.Range(
            document.positionAt(0), document.positionAt(text.length));

    const formattedDocument = gformatHtml(text, extensionOptions).contents;
    return Promise.resolve([new vscode.TextEdit(docRange, formattedDocument)]);
  }

  private constructFormatterOptions(
      document: vscode.TextDocument,
      options: vscode.FormattingOptions): gformatHtml.PrettyHtmlOptions {
    const extensionConfig = vscode.workspace.getConfiguration('gformathtml');
    const prettyHtmlConfig = {...extensionConfig} as
        gformatHtml.PrettyHtmlOptions;
    const editorOptions = vscode.window.activeTextEditor ?.options ||
        {} as vscode.TextEditorOptions;

    const lang = document.languageId, uri = document.uri;
    const langConfig = vscode.workspace.getConfiguration(`[${lang}]`, uri);
    const config = vscode.workspace.getConfiguration('editor', uri);
    const printWidth =
        langConfig['editor.wordWrapColumn'] || config.get('wordWrapColumn', 80);

    const tabWidth = Number(editorOptions.tabSize) || options.tabSize;
    const useTabs = !(editorOptions.insertSpaces || options.insertSpaces);

    /* eslint-disable curly */
    if (printWidth) prettyHtmlConfig.printWidth = printWidth;
    if (tabWidth) prettyHtmlConfig.tabWidth = tabWidth;
    if (useTabs) prettyHtmlConfig.useTabs = useTabs;
    if (printWidth) prettyHtmlConfig.printWidth = printWidth;
    /* eslint-enable curly */
    if (extensionConfig.forceWrapAttributes) {
      prettyHtmlConfig.wrapAttributes = true;
    }
    const prettierConfig =
        extensionConfig.usePrettier ? {prettier: {...prettyHtmlConfig}} : {};

    return {...prettyHtmlConfig, ...prettierConfig};
  }

  private getTextInRange(document: vscode.TextDocument, range?: vscode.Range) {
    const codeContent = document.getText();

    if (range) {
      let startOffset = document.offsetAt(range.start);
      let endOffset = document.offsetAt(range.end);

      return codeContent.slice(startOffset, endOffset);
    }

    return codeContent;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const formatter = new HTMLDocumentFormatter();
  context.subscriptions.push(
      vscode.languages.registerDocumentRangeFormattingEditProvider(
          'html', formatter));
  context.subscriptions.push(
      vscode.languages.registerDocumentFormattingEditProvider(
          'html', formatter));
}

export function deactivate() {}
