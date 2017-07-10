var esprima = require("esprima");
var escodegen = require("escodegen");
var JSZip = require('jszip');
var FileSaver = require('filesaver.js-npm');
import { initState as jsPsychInitState, jsPsych_Display_Element } from '../../reducers/Experiment/jsPsychInit';
import { isTimeline } from '../../reducers/Experiment/utils';
import { getSignedUrl, getFiles } from '../s3';

const Deploy_Folder = 'assets';
const AWS_S3_MEDIA_TYPE = "AWS-S3-MEDIA";
const DEPLOY_PATH = 'assets/';
const welcomeObj = {
  ...jsPsychInitState,
  timeline: [
    {
      type: 'text',
      text: 'Welcome to jsPysch Experiment Builder!',
      choice: "",
    }
  ]
}

const undefinedObj = {
  ...jsPsychInitState,
  timeline: [
    {
      type: 'text',
      text: '',
      choice: "",
    }
  ]
}

export const MediaObject = (filename, prefix) => ({
  type: AWS_S3_MEDIA_TYPE,
  filename: filename, // maybe array
  prefix: prefix,
})

export const isS3MediaType = (item) => (typeof item === 'object' && item && item.type === AWS_S3_MEDIA_TYPE);

export const Welcome = 'jsPsych.init(' + stringify(welcomeObj) + ');';

export const Undefined = 'jsPsych.init(' + stringify(undefinedObj) + ');';

export function diyDeploy(state) {
  let experimentState = state.experimentState;
  var zip = new JSZip();

  let deployInfo = {
    experimentName: experimentState.experimentName,
    plugins: {},
    medias: {},
    code: generateCode(experimentState, true, true),
  }
  walk(experimentState, experimentState.mainTimeline, deployInfo);

  zip.file("index.html", generatePage(deployInfo));
  var assets = zip.folder(Deploy_Folder);
  getFiles(Object.keys(deployInfo.medias)).then((datas) => {
    assets.file("eggplant.png", datas[0].Body);
  }).then(() => {
    zip.generateAsync({
        type: "blob"
      })
      .then(function(blob) {
        FileSaver.saveAs(blob, deployInfo.experimentName + ".zip");
      });
  })
}


function walk(state, childrenById, deployInfo) {
  let node;
  for (let id of childrenById) {
    node = state[id];
    if (isTimeline(node)) {
      walk(state, node.childrenById, deployInfo);
    } else {
      let parameters = node.parameters;
      deployInfo.plugins[parameters.type] = 1;

      // search for media
      let item;
      for (let key of Object.keys(parameters)) {
        item = parameters[key];
        if (isS3MediaType(item)) {
          if (Array.isArray(item.filename)) {
            for (let name of item.filename) {
              deployInfo.medias[item.prefix + name] = 1;
            }
          } else {
            deployInfo.medias[item.prefix + item.filename] = 1;
          }
        }
      }
    }
  }
  return deployInfo;
}


/*
state - experimentState
all - indicates if play all experiments
deploy - indicates if in deploy mode (include all nodes)
*/ 
export function generateCode(state, all=false, deploy=false) {
  let timeline = (all) ? state.mainTimeline : [state.previewId];
  let blocks = [];
  let node;
  // bool that descides if this node should be include
  let include;
  for (let id of timeline) {
    if (!id) continue;
    node = state[id];
    // if play all experiments, let node.enable decide if this node is included
    // if in deploy mode, include all nodes
    include = (!all || deploy) ? true : node.enabled;
    if (include) {
      if (isTimeline(node)) {
        if (node.childrenById.length > 0) {
          blocks.push(generateTimeline(state, node, all, deploy));
        }
      } else {
        blocks.push(generateTrial(state, node, all, deploy));
      }
    }
  }

  if (!blocks.length) {
    return Undefined;
  }

  let obj = {
    ...state.jsPsychInit,
    timeline: blocks
  };

  return "jsPsych.init(" + stringify(obj) + ");";
}

function generatePage(deployInfo) {
  let plugins = Object.keys(deployInfo.plugins).map((name) =>
    (`<script type="text/javascript" src="jsPsych/plugins/jspsych-${name}.js"></script>`)
  )
  let pluginsStr = "";
  for (let p of plugins) pluginsStr += p;
  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${deployInfo.experimentName}</title>
      <script type="text/javascript" src="jsPsych/jspsych.js"></script>
      ${pluginsStr}
      <link href="jsPsych/css/jspsych.css" rel="stylesheet" type="text/css"></link>
    </head>
    <body id="${jsPsych_Display_Element}" class="${jsPsych_Display_Element}">
    </body>
    <script>
      ${deployInfo.code}
    </script>
  </html>
`
}

function resolveMediaPath(mediaObject, deploy) {
  let prefix = mediaObject.prefix;
  let processFunc = getSignedUrl;
  if (deploy) {
    prefix = DEPLOY_PATH;
    processFunc = p => (p);
  } 
  if (typeof mediaObject.filename === 'string') {
    return processFunc(prefix + mediaObject.filename);
  } else if (Array.isArray(mediaObject.filename)) {
    return mediaObject.filename.map((f) => (processFunc(prefix + f)));
  }
}

/*
Note that FOR NOW AWS S3 Media Type Object MUST be in the first level
of trial.paramters
*/
function generateTrial(state, trial, all=false, deploy=false) {
  let res = {};
  let parameters = trial.parameters, item;
  for (let key of Object.keys(parameters)) {
    item = parameters[key];
    if (isS3MediaType(item)) {
      item = resolveMediaPath(item, deploy);
    }
    res[key] = item;
  }

  if (res.timing_stim && !all) {
    res.timing_stim = -1;
  }

  return res;
}

function generateTimeline(state, node, all=false, deploy=false) {
  let res = {
    ...node.parameters
  }
  let timeline = [];
  let desc, include;
  for (let descId of node.childrenById) {
    desc = state[descId];
    // if play all experiments, let node.enable decide if this node is included
    // if in deploy mode, include all nodes
    include = (!all || deploy) ? true : desc.enabled;
    if (include) {
      if (isTimeline(desc)) {
        if (desc.childrenById.length > 0) {
          timeline.push(generateTimeline(state, desc, all, deploy));
        } 
      } else {
        timeline.push(generateTrial(state, desc, all, deploy));
      }
    }
  }

  res.timeline = timeline;
  return res;
}



/*
Specially written for stringify obj in this app to generate code
For functions, turn it to
{
  isFunc: true,
  code: function
}

*/
export function stringify(obj) {
  if (!obj) return JSON.stringify(obj);

  let type = typeof obj;
  switch(type) {
    case 'object':
      let res = [];
      if (Array.isArray(obj)) {
        res.push("[");
        let l = obj.length, i = 1;
        for (let item of obj) {
          res.push(stringify(item));
          if (i++ < l) {
            res.push(",");
          }
        }
        res.push("]");
      } else if (obj.isFunc) {
        return stringifyFunc(obj.code, obj.info);
      }else {
        res.push("{");
        let keys = Object.keys(obj);
        let l = keys.length, i = 1;
        for (let key of keys) {
          res.push('"' + key + '":' + stringify(obj[key]));
          if (i++ < l) {
            res.push(",");
          }
        }
        res.push("}");
      }
      return res.join("");
    default:
      return JSON.stringify(obj);
  }
}

function stringifyFunc(code, info=null) {
  try {
    let tree = esprima.parse(code);
    let res = escodegen.generate(tree, {
            format: {
                compact: true,
                semicolons: true,
                parentheses: false
            }
        });
    return res;
  } catch (e) {
    // let log = JSON.stringify({error: e, info: info});
    let func = "function() { console.log('" + JSON.stringify({error: e, info: info}) + "'); }";
    return func;
  }
}
