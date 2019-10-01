import * as path from 'path';
import * as vscode from 'vscode';
import * as copypaste from 'copy-paste';
import * as stack from 'stackexchange';

export function activate(context: vscode.ExtensionContext) {
  var global: string;

  context.subscriptions.push(
    vscode.commands.registerCommand('searchPage.start', () => {
      var options = { version: 2.2 };
      var context = new stack(options);

      showInputBox(options, context);
    }),



		vscode.commands.registerCommand('searchPage.selectedCode', () => {

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

function buildWebview(item:any) {
  const panel = vscode.window.createWebviewPanel(
    'searchPage',
    'Search page',
    vscode.ViewColumn.One,
    {
      enableScripts: true
    }
  );

  panel.webview.html = 
  `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>templater</title>
            </head>
            <body>
                ${content}
                <script>
                  (function() {
                      const vscode = acquireVsCodeApi();
                      setInterval(() => {
                        if (true) {
                          vscode.postMessage({
                              command: 'selection',
                              text: 'a'
                          })
                        }
                      }, 1000);
                  }())
                </script>

            </body>
            </html>`;
}

function buildAnsweredItems(items:any){
  let answeredArray:string = 'Found the following results, click the selected answer to check its content: \n';
  console.log(items)
  items.forEach(element => {
    if(element.is_answered && element.accepted_answer_id){
      answeredArray = (answeredArray + `${element.title}: ${element.accepted_answer_id} \n`);
    }
  });

  const setting: vscode.Uri = vscode.Uri.parse("untitled:" + "Selected results");
  vscode.workspace.openTextDocument(setting).then((a: vscode.TextDocument) => {
    vscode.window.showTextDocument(a, 1, false).then(e => {
        e.edit(edit => {
            edit.insert(new vscode.Position(0, 0), answeredArray);
        });
      });
  })
}

async function showInputBox(options:any, context:any) {
  let query:string;
	let result = await vscode.window.showInputBox({
    placeHolder: 'For example: Java loop'
  });

  var filter = {
    pagesize: 5,
    intitle: result,
    sort: 'activity',
    order: 'desc'
  };
  context.search.search(filter, function(err, results){
    if (err) throw err;
    
    buildAnsweredItems(results.items);
  });
}