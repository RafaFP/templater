export const model = 
{
  "Snippet Model": {
    "prefix": "templater model",
    "body": [
      "if((${1:variable}) != 'undefined'){",
      "  console.log(${1:variable});",
      "} else {",
      "  console.log(${2:error})",
      ","
    ],
    "description": "a model for you to edit your own snippets"
  }
};

export const newSnip = {
  "prefix": "<new template shortcut>",
  "body": [],
  "description": "<new template description>"
};