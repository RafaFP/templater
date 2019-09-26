import * as path from 'path';
import * as vscode from 'vscode';
import * as copypaste from 'copy-paste';

export function activate(context: vscode.ExtensionContext) {
  var global: string;
  context.subscriptions.push(
    vscode.commands.registerCommand('searchPage.start', () => {
      const panel = vscode.window.createWebviewPanel(
        'searchPage',
        'Search page',
        vscode.ViewColumn.One,
        {
          enableScripts: true
        }
      );
      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(
        message => {
          switch (message.command) {
            case 'selection':
              vscode.window.showInformationMessage(message.text);
              global = copypaste.copy(message.text);
              return;
          }
        },
        undefined,
        context.subscriptions
      );
    }),
		vscode.commands.registerCommand('searchPage.selectedCode', () => {
      // const editor = vscode.window.activeTextEditor;
      // const selection = editor.selection;
      // const text = editor.document.getText(selection);

			const setting: vscode.Uri = vscode.Uri.parse("untitled:" + "Selected Code");
      vscode.workspace.openTextDocument(setting).then((a: vscode.TextDocument) => {
        vscode.window.showTextDocument(a, 1, false).then(e => {
            e.edit(edit => {
                edit.insert(new vscode.Position(0, 0), global);
            });
          });
      })
    })
  )
}

function getWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <h1 id="lines-of-code">teste</h1>
    <h1 id="lines-of-code-counter">0</h1>
    <script>
      (function() {
          const vscode = acquireVsCodeApi();

          setInterval(() => {
            if (true) {
              vscode.postMessage({
                  command: 'selection',
                  text: "a"
              })
            }
          }, 1000);
      }())
    </script>

    <iframe id="frame" src="https://www.rosettacode.org/wiki/Factorial#Java" width = "100%" height = "300" /> 

</body>
</html>`;
      }