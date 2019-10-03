import * as vscode from 'vscode';
import { multipick } from './multistepinput';
import * as snippet from './snippet';
import * as model from './templatermodelsnippet';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('searchPage.start', () => {
      const answer = multipick();
    }),
    vscode.commands.registerCommand('saveSnippet.edit', () => {
      const editor = vscode.window.activeTextEditor;
      let text = editor.document.getText(editor.selection);
      //snippet.log();
      //console.log(model.model);
      console.log(text);
    })
  )
}