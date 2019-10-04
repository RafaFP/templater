import * as fs from 'fs';
import { pathSnippets } from './snippetpath';
import { model, newSnip } from './templatermodelsnippet';

export function log(){
  getSnippets().then(res => console.log(res))
}

export function appendAndOpenFile(text:string){
  const file:string = (pathSnippets());
  const obj = getSnippets().then(res => {
    console.log(buildNewSnip(res, text))

    fs.writeFile(file, JSON.stringify(res, null, 2), function (err) {
      if (err) console.error(err)
    })
  });
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
  let r = Math.random().toString(36).substring(7);
  let name = `rename snippet ${r}`
  res[name] = newSnip;
  console.log(res)
  //return JSON.stringify(JSON.parse(`{"rename snippet ${r}": ${JSON.stringify(newSnip)}}`), null, 2);
}
