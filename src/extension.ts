import * as path from 'path';
import * as vscode from 'vscode';
import { multipick } from './multistepinput';
import { pathSnippets } from './snippetpath';
import * as jsonfile from 'jsonfile';
import * as appdata from 'appdata-path';


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('searchPage.start', () => {
      const answer = multipick();
    }),
    vscode.commands.registerCommand('saveSnippet.edit', () => {
      const file = (pathSnippets())
      jsonfile.readFile(file, function (err, obj) {
        if (err) console.error(err)
        console.log(obj)
        
      })
    })
  )
}