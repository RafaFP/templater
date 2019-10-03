import * as appdata from 'appdata-path';

function getPlatform() {
  return process.platform
}

export const isWindows: boolean = (getPlatform() === 'win32')
export const isMacOS: boolean = (getPlatform() === 'darwin')
export const isLinux: boolean = (getPlatform() === 'linux')

export function pathSnippets(): string {
  if(isLinux){
    return `${appdata.getAppDataPath()}/Code/User/snippets/templater.code-snippets`
  };
  if(isMacOS){
    return `${appdata.getAppDataPath()}/Code/User/snippets/templater.code-snippets`
  };
  if(isWindows){
    return `${appdata.getAppDataPath()}\\Code\\User\\snippets\\templater.code-snippets`
  };
  throw new Error('Could not figure out OS');
}