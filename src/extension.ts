import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "templater" is now active!');

	let snip = vscode.commands.registerCommand('extension.addSnip', () => {
		vscode.window.showErrorMessage('no full implement for this yet man');
	});

	let time_command = vscode.commands.registerCommand('extension.time', () => {
		let d = new Date();

		vscode.window.showInformationMessage(d.toString());
	});

	context.subscriptions.push(snip, time_command);
}

export function deactivate() { }
