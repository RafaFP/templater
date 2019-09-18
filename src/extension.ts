import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('catCoding.start', () => {
      const panel = vscode.window.createWebviewPanel(
        'catCoding',
        'Cat Coding',
        vscode.ViewColumn.One,
        {
          // Enable scripts in the webview
          enableScripts: true
        }
      );
			let date = new Date();
      panel.webview.html = getWebviewContent(date.toString());
		}),
		vscode.commands.registerCommand('extension.time', () => {
			const d = new Date();
		
			vscode.window.showInformationMessage(d.toString());
		})
	)
}

function getWebviewContent(date: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
		<meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src https:;">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <iframe src="https://www.rosettacode.org/wiki/Factorial#Java" width = "100%" height = "1000" />
</body>
</html>`;
}