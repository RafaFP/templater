import * as fs from 'fs';
import * as vscode from 'vscode';
import { pathSnippets } from './snippetpath';
import { model, newSnip } from './templatermodelsnippet';

export function log(){
  getSnippets().then(res => console.log(res))
}

export function appendAndOpenFile(text:string){
  const file:string = (pathSnippets());
  const obj = getSnippets().then(res => {

    fs.writeFile(file, JSON.stringify(buildNewSnip(res, text), null, 2), function (err) {
      if (err) console.error(err)
    })
  });
  vscode.workspace.openTextDocument(file).then((a: vscode.TextDocument) => {
    vscode.window.showTextDocument(a, 1, false).then(e => {
      let lastLine = e.document.lineAt(e.document.lineCount - 1);
      let position = new vscode.Position(lastLine.lineNumber, 0);
      let newSelection = new vscode.Selection(position, position);
      let newRange = new vscode.Range(position, position);
      e.selection = newSelection;
      e.revealRange(newRange, 3);
    });
  })
}

function getSnippets() {
  const file:string = (pathSnippets());
  return new Promise(resolve => {
    fs.readFile(file, function (err, obj) {
      if (err || !obj.toString('utf8')) { initialize().then(res => {resolve(res)}) }
      resolve(JSON.parse(obj));
    }
  }));
}

function initialize() {
  const file:string = (pathSnippets());
  return new Promise (resolve => {
    fs.writeFile(file, JSON.stringify(model, null, 2), function (err) {
      if (err) console.error(err)
      fs.readFile(file, function (err, obj) {
        if (err) { console.error(err) }
        resolve(JSON.parse(obj));
      })
    })
  });
}

function buildNewSnip(res:string,text:string) {
  //setup
  let r = Math.random().toString(36).substring(7);
  let name = `rename snippet ${r}`
  let resolvedSnippets = JSON.parse(JSON.stringify(res));

  //add code
  let createdSnip = JSON.parse(JSON.stringify(newSnip));
  createdSnip.body = text.split('\n');

  //build json
  resolvedSnippets[name] = createdSnip;
  return resolvedSnippets;
}
