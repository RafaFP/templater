import * as vscode from 'vscode';
import { multipick } from './multistepinput';
import * as snippet from './snippet';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('searchPage.start', () => {
      const answer = multipick();
    }),
    vscode.commands.registerCommand('saveSnippet.edit', () => {
      const editor = vscode.window.activeTextEditor;
      if(vscode.window.activeTextEditor){
        let text = editor.document.getText(editor.selection);
        snippet.appendAndOpenFile(text);
      }
      //snippet.log();
    })
  )
}