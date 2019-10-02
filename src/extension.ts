import * as path from 'path';
import * as vscode from 'vscode';
import { multipick } from './multistepinput';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('searchPage.start', () => {
      const answer = multipick();
    })
  )
}