import * as vscode from 'vscode';
import * as stack from 'stackexchange';
import * as striptags from 'striptags';

export async function multipick() {
  var options = { version: 2.2 };
  var context = new stack(options);

  interface State {
		title: string;
		step: number;
    totalSteps: number;
    resourceGroup: vscode.QuickPickItem | string;
		query: string;
		answer: vscode.QuickPickItem;
	}

	async function collectInputs() {
		const state = {} as Partial<State>;
		await MultiStepInput.run(input => inputQuery(input, state));
		return state as State;
	}
  
  const title = 'Search Stackoverflow questions by terms';

	async function inputQuery(input: MultiStepInput, state: Partial<State>) {
		state.query = await input.showInputBox({
			title,
			step: 1,
			totalSteps: 2,
      value: state.query || '',
			prompt: 'Enter a query for the Stackoverflow question title',
      shouldResume: shouldResume
    });
    return (input: MultiStepInput) => pickAnsweredQuestion(input, state);
  }
  
  async function pickAnsweredQuestion(input: MultiStepInput, state: Partial<State>) {
    const runtimes = await itemsBuilder(state.query);
		const pick = await input.showQuickPick({
			title,
			step: 2,
      totalSteps: 2,
      items: runtimes,
      activeItem: typeof state.answer !== 'string' ? state.answer : undefined,
      placeholder: '',      
			shouldResume: shouldResume
		});
    state.answer = pick;
  }

	function shouldResume() {
		return new Promise<boolean>((resolve, reject) => {

		});
  }
  
	function itemsBuilder(query:string): Promise<vscode.QuickPickItem[]> {
    var filter = {
      pagesize: 5,
      intitle: query,
      sort: 'activity',
      order: 'desc',
      site: 'stackoverflow'
		};

    return new Promise(resolve => context.search.search(filter, function(err:Error, results){
        if (err) throw err;
        let resultPicks = results.items.map(obj => {let nObj:ResultForPick = {"label":"", "answer": ""};
          if(obj.is_answered && obj.accepted_answer_id){
            nObj.label = obj.title;
            nObj.answer = obj.accepted_answer_id;
            return nObj;
          }
        }).filter(function (el:ResultForPick) {return el != null})
        resolve(resultPicks);
      }));
	}

  const state = await collectInputs();
  vscode.window.showInformationMessage(`Getting the content: '${state.answer.answer}'`);
  buildAnswerSelected(options, context, state.answer.answer);
}

async function buildAnswerSelected(options:any, context:any, id:any) {
  var filter = {
    filter: 'withbody',
    site: 'stackoverflow'
  };
  context.answers.answers(filter, function(err:Error, results){
    if (err) throw err;
    
    getQuestionAndOpenAsText(options, context, results.items[0])
  }, [id])
}

async function getQuestionAndOpenAsText(options:any, context:any, answer:any) {
  var filter = {
    filter: 'withbody',
    site: 'stackoverflow'
  };
  context.questions.questions(filter, function(err:Error, results){
    if (err) throw err;
    const questionFixed = striptags(`QUESTION: ##########################################################
																		\n${results.items[0].title}
																		\n${results.items[0].body}`, ['a']);
    const answerFixed = striptags(`ACCEPTED ANSWER: #####################################################
                                    \n${answer.body}`, ['a']);

    buildTextResult(questionFixed + '\n\n\n' + answerFixed);
  }, [answer.question_id])
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

///////// multipick helper code
class InputFlowAction {
	private constructor() { }
	static back = new InputFlowAction();
	static cancel = new InputFlowAction();
	static resume = new InputFlowAction();
}

type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

interface ResultForPick {
	label: string,
	answer: string
}

interface QuickPickParameters<T extends vscode.QuickPickItem> {
	title: string;
	step: number;
	totalSteps: number;
	items: T[];
	activeItem?: T;
	placeholder: string;
  shouldResume: () => Thenable<boolean>;
}

interface InputBoxParameters {
	title: string;
	step: number;
	totalSteps: number;
	value: string;
	prompt: string;
	shouldResume: () => Thenable<boolean>;
}

class MultiStepInput {

	static async run<T>(start: InputStep) {
		const input = new MultiStepInput();
		return input.stepThrough(start);
	}

	private current?: vscode.QuickInput;
	private steps: InputStep[] = [];

	private async stepThrough<T>(start: InputStep) {
		let step: InputStep | void = start;
		while (step) {
			this.steps.push(step);
			if (this.current) {
				this.current.enabled = false;
				this.current.busy = true;
			}
			try {
				step = await step(this);
			} catch (err) {
				if (err === InputFlowAction.back) {
					this.steps.pop();
					step = this.steps.pop();
				} else if (err === InputFlowAction.resume) {
					step = this.steps.pop();
				} else if (err === InputFlowAction.cancel) {
					step = undefined;
				} else {
					throw err;
				}
			}
		}
		if (this.current) {
			this.current.dispose();
		}
	}

	async showQuickPick<T extends vscode.QuickPickItem, P extends QuickPickParameters<T>>({ title, step, totalSteps, items, activeItem, placeholder, shouldResume }: P) {
		const disposables: vscode.Disposable[] = [];
		try {
			return await new Promise<T | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
				const input = vscode.window.createQuickPick<T>();
				input.title = title;
				input.step = step;
				input.totalSteps = totalSteps;
				input.placeholder = placeholder;
				input.items = items;
				if (activeItem) {
					input.activeItems = [activeItem];
				}
				disposables.push(
					input.onDidTriggerButton(item => {
						if (item === vscode.QuickInputButtons.Back) {
							reject(InputFlowAction.back);
						} else {
							resolve(<any>item);
						}
					}),
					input.onDidChangeSelection(items => resolve(items[0])),
					input.onDidHide(() => {
						(async () => {
							reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
						})()
							.catch(reject);
					})
				);
				if (this.current) {
					this.current.dispose();
				}
				this.current = input;
				this.current.show();
			});
		} finally {
      disposables.forEach(d => d.dispose());
    }
  }
	

	async showInputBox<P extends InputBoxParameters>({ title, step, totalSteps, value, prompt, shouldResume }: P) {
		const disposables: vscode.Disposable[] = [];
		try {
			return await new Promise<string | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
				const input = vscode.window.createInputBox();
				input.title = title;
				input.step = step;
				input.totalSteps = totalSteps;
				input.value = value || '';
				input.prompt = prompt;
				disposables.push(
					input.onDidAccept(async () => {
						const value = input.value;
						input.enabled = false;
						input.busy = true;
						resolve(value);
						input.enabled = true;
						input.busy = false;
					}),
					input.onDidHide(() => {
						(async () => {
							reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
						})()
							.catch(reject);
					})
				);
				if (this.current) {
					this.current.dispose();
				}
				this.current = input;
				this.current.show();
			});
		} finally {
      disposables.forEach(d => d.dispose());
    }
  }
}