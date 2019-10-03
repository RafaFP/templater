import * as jsonfile from 'jsonfile';
import { pathSnippets } from './snippetpath';

export function log(){
  const file:string = (pathSnippets());
  
  jsonfile.readFile(file, function (err, obj) {
    if (err) { console.error('No snippets yet'); return; }
    console.log(obj)
    return obj;
  })
}

export function appendAndOpenFile(){
  const file:string = (pathSnippets());
  const obj:JSON = {"nonono": "no"};

  jsonfile.writeFile(file, obj, { flag: 'a' }, function (err) {
    if (err) console.error(err)
  })
}
