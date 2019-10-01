import * as path from 'path';
import * as vscode from 'vscode';
import * as copypaste from 'copy-paste';
import * as stack from 'stackexchange';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('searchPage.start', () => {
      var options = { version: 2.2 };
      var context = new stack(options);

      listAnsweredQuestions(options, context);
    }),



		vscode.commands.registerCommand('searchPage.selectedCode', () => {
      var options = { version: 2.2 };
      var context = new stack(options);

      const answer = buildAnswerSelected(options, context, 57562177);    
    })
  )
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

async function listAnsweredQuestions(options:any, context:any) {
	let result = await vscode.window.showInputBox({
    placeHolder: 'For example: Java loop'
  });

  var filter = {
    pagesize: 5,
    intitle: result,
    sort: 'activity',
    order: 'desc',
    site: 'stackoverflow'
  };
  context.search.search(filter, function(err, results){
    if (err) throw err;
    
    buildAnsweredItems(results.items);
  });
}

async function buildAnswerSelected(options:any, context:any, id:any) {
  var filter = {
    filter: 'withbody',
    site: 'stackoverflow'
  };
  context.answers.answers(filter, function(err, results){
    if (err) throw err;
    
    console.log(results.items);
    getQuestion(options, context, results.items[0])
  }, [id])
}

async function getQuestion(options:any, context:any, answer:any) {
  var filter = {
    filter: 'withbody',
    site: 'stackoverflow'
  };
  context.questions.questions(filter, function(err, results){
    if (err) throw err;
    
    console.log(results.items);
    buildTextResult(results.items[0].body + '\n\n\n' + answer.body);
  }, [57561617])
}

function buildTextResult(content:string){
  const setting: vscode.Uri = vscode.Uri.parse("untitled:" + "Selected Code");
  vscode.workspace.openTextDocument(setting).then((a: vscode.TextDocument) => {
    vscode.window.showTextDocument(a, 1, false).then(e => {
        e.edit(edit => {
            edit.insert(new vscode.Position(0, 0), content);
        });
      });
  })
}