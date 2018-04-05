var JSZip = require('jszip');
var FileSaver = require('filesaver.js-npm');
import { initState as jsPsychInitState, jsPsych_Display_Element, StringifiedFunction } from '../../reducers/Experiment/jsPsychInit';
import { createComplexDataObject, ParameterMode, JspsychValueObject, GuiIgonoredInfoEnum } from '../../reducers/Experiment/editor';
import { createTrial } from '../../reducers/Experiment/organizer';
import { isTimeline } from '../../reducers/Experiment/utils';
import {
  getSignedUrl,
  getFiles,
  getJsPsychLib,
  generateUploadParam,
  uploadFile,
  generateCopyParam,
  copyFiles,
  Cloud_Bucket,
  Bucket_Name as User_Bucket,
  Website_Bucket,
  Delimiter,
  listBucketContents
} from '../s3';
import { injectJsPsychUniversalPluginParameters, isValueEmpty } from '../../utils';

const SaveDataAPI = "https://0xkjisg8e8.execute-api.us-east-2.amazonaws.com/DataStorage/jsPsychMiddleman/";
const SaveDataToOSF_Function_Name = "saveDataToOSF";

const jsPsych = window.jsPsych;

const Deploy_Folder = 'assets';

const jsPysch_Folder = 'jsPsych';

const DEPLOY_PATH = 'assets/';

const jsPsych_PATH = 'jsPsych/';

const welcomeObj = {
  ...jsPsychInitState,
  timeline: [{
        type: 'image-keyboard-response',
        stimulus: createComplexDataObject('https://s3.us-east-2.amazonaws.com/builder.jspsych.org/jsPsych/jspsych-logo-readme.jpg'),
        choices: createComplexDataObject(jsPsych.NO_KEYS),
        stimulus_duration: createComplexDataObject(null),
        trial_duration: createComplexDataObject(null),
        response_ends_trial: createComplexDataObject(null),
      }
  ]
}

const undefinedObj = {
  ...jsPsychInitState,
  timeline: [
    {
      type: 'html-keyboard-response',
        stimulus: createComplexDataObject(null),
        choices: createComplexDataObject(null),
        prompt: createComplexDataObject('<p>No trial is defined or selected!</p>'),
        stimulus_duration: createComplexDataObject(null),
        trial_duration: createComplexDataObject(null),
        response_ends_trial: createComplexDataObject(null),
    }
  ]
}

const generateDataSaveInCloudTrial = () => {
  let param = {
    type: 'call-function',
    func: createComplexDataObject(null)
  };
  param.func.func.code = `
    function() {
      ${SaveDataToOSF_Function_Name}(jsPsych.data.get().csv());
    }
  `
  param.func.mode = ParameterMode.USE_FUNC;

  let res = createTrial('SaveDataTrial',
      null,
      "Save Data To OSF",
      true,
      param
    );
  return res;
}


const errorMessageObj = (error) => {
  let message = '';
  for (let e of error) {
    message += `Parameter "${e}" must have a valid value.<br>`;
  }
  return {
    ...jsPsychInitState,
    timeline: [
      {
        type: 'html-keyboard-response',
          stimulus: createComplexDataObject(''),
          choices: createComplexDataObject(null),
          prompt: createComplexDataObject(`<p style="color:red">${message}</p>`),
          stimulus_duration: createComplexDataObject(null),
          trial_duration: createComplexDataObject(null),
          response_ends_trial: createComplexDataObject(null),
      }
    ]
  }
}


export const MediaPathTag = (filename) => (`<path>${filename}</path>`);

// Code for generating welcome
export const Welcome = 'jsPsych.init(' + stringify(welcomeObj) + ');';

// Code for generating undefined page
export const Undefined = 'jsPsych.init(' + stringify(undefinedObj) + ');';

const ErrorMessage = (error) => ('jsPsych.init(' + stringify(errorMessageObj(error)) + ');');

/*
DIY deploy built experiment for user
It will:
1. Extract deploy information
2. Download used media
3. Generate code, bundle media with index.html as zip

Param
state, whole redux state
progressHook, callback from presentational component that will show user downloading progress
*/
export function diyDeploy(state, progressHook) {
  let experimentState = state.experimentState;
  var zip = new JSZip();

  /* ************ Step 1 ************ */
  // Extract deploy information
  let deployInfo = extractDeployInfomation(experimentState);

  /* ************ Step 2 ************ */
  let filePaths = Object.keys(deployInfo.media);
  // initialize progress
  progressHook(filePaths.map((d) => (0)), deployInfo.downloadSize);

  /* ************ Step 2 && 3 ************ */
  // generate error log
  if (deployInfo.errorLog !== '') {
    zip.file("error log.txt", deployInfo.errorLog)
  }
  // generate index.html, append it in zip file
  zip.file("index.html", generatePage({deployInfo: deployInfo}));
  // create assets folder
  var assets = zip.folder(Deploy_Folder);
  var jsPsych = zip.folder(jsPysch_Folder);

  // download media
  return getFiles(filePaths, (key, data) => {
    assets.file(deployInfo.media[key], data);
  }, (loaded) => {
    progressHook(loaded, deployInfo.downloadSize);
  }).then(() => {
    // download jspysch library
    getJsPsychLib((key, data) => {
      jsPsych.file(key, data);
    }).then(() => {
      // append downloaded in zip
    zip.generateAsync({
        type: "blob"
      })
      .then(function(blob) {
        FileSaver.saveAs(blob, deployInfo.experimentName + ".zip");
      });
    }) 
  }).finally(() => {
    // clear progress
    progressHook(null, null, true);
  })
}

export function cloudDeploy({
  state
}) {
  var experimentState = utils.deepCopy(state.experimentState),
      experimentId = experimentState.experimentId,
      userState = state.userState,
      user = userState.user,
      insertAfter = userState.cloudDeployInfo[experimentId].saveAfter;

  let saveTrial = generateDataSaveInCloudTrial();
  experimentState[saveTrial.id] = saveTrial;
  experimentState.mainTimeline.splice(insertAfter+1, 0, saveTrial.id);

  var deployInfo = extractDeployInfomation(experimentState),
      filePaths = Object.keys(deployInfo.media);

  var indexPage = new File([generatePage({
    deployInfo: deployInfo,
    cloudMode: true,
    userId: user.identityId,
    experimentId: experimentId
  })], "index.html");
  var param = generateUploadParam({
    Key: [experimentId, indexPage.name].join(Delimiter),
    Body: indexPage,
    ContentType: 'text/html'
  });

  function uploadCode() {
    return uploadFile({
      param: param,
      bucket: Cloud_Bucket
    });
  }
  
  function uploadAsset() {
    return listBucketContents({
      Prefix: `${experimentId}/${Deploy_Folder}/`,
      bucket: Cloud_Bucket
    }).then((data) => {
      let exists = data.Contents.map(item => {
        let keys = item.Key.split(Delimiter);
        return [state.userState.user.identityId, experimentId, keys[keys.length - 1]].join(Delimiter);
      })
      filePaths = filePaths.filter(f => exists.indexOf(f) < 0);
      return filePaths.map((f) => {
        return generateCopyParam({
          source: f,
          target: `${experimentId}/${Deploy_Folder}/${deployInfo.media[f]}`,
          targetBucket: Cloud_Bucket
        })
      });
    }).then((params) => {
      return copyFiles({
        params: params
      });
    });
  }

  function uploadLib() {
    // `${experimentId}/${jsPysch_Folder}/`
    return listBucketContents({
      Prefix: `${jsPysch_Folder}/`,
      bucket: Website_Bucket
    }).then((data) => {
      let jsPsychParams = data.Contents.map((f) => (
        generateCopyParam({
          source: f.Key,
          target: `${experimentId}/${f.Key}`,
          targetBucket: Cloud_Bucket,
          sourceBucket: Website_Bucket,
        })
      ));
      return copyFiles({params: jsPsychParams});
    });
  }

  return Promise.all([uploadCode(), uploadAsset(), uploadLib()]);
}

function extractDeployInfomation(experimentState) {
  let deployInfo = {
    experimentName: experimentState.experimentName,
    // search for used media
    /*
    media = {
      s3-address-of-file: filename
    }
    */
    media: {},
    code: generateCode(experimentState, true, true),
    errorLog: '',
    downloadSize: 0
  }
  extractDeployInfomationHelper(experimentState, deployInfo, experimentState.media.Prefix);
  let resources = Array.isArray(experimentState.media.Contents) ? experimentState.media.Contents.map(f => [f.Key, f.Size]) : [];
  for (let f of Object.keys(deployInfo.media)) {
    let found = false, size = 0;
    for (let r of resources) {
      if (r[0] === f) {
        found = true;
        size = r[1];
        break;
      }
    }
    if (found) {
      deployInfo.downloadSize += size;
    } else {
      deployInfo.errorLog += `"${deployInfo.media[f]}" is not found!\r\n`
      delete deployInfo.media[f];
    }
  }
  
  return deployInfo;
}

/*
Walk through experimentState to extract used media, that is, populate deployInfo.plugin and deployInfo.media  O(n)
It populates deployInfo.media so that it is ready for using s3 getObject API.

media = {
  s3-address-of-file: filename
}

Param:
obj, starts with experimentState
deployInfo, defined above in diyDeploy
prefix, experimentState.media.Prefix
*/

function extractDeployInfomationHelper(obj, deployInfo, prefix) {
  if (!obj) return;
  switch (typeof obj) {
    case 'object':
      if (Array.isArray(obj)) {
        for (let o of obj) extractDeployInfomationHelper(o, deployInfo, prefix);
      } else {
        for (let key of Object.keys(obj)) extractDeployInfomationHelper(obj[key], deployInfo, prefix);
      }
      break;
    case 'string':
      let matches = obj.match(/<path>(.*?)<\/path>/g);
      if (matches) {
        // populate deployInfo.media
        for (let m of matches) {
          m = m.replace(/<\/?path>/g, '');
          // state.media.Prefix + m is the s3 address
          deployInfo.media[prefix + m] = m;
        }
      }
      break;
    default:
      break;
  }
}


/*
state - experimentState
all - indicates if play all experiments
deploy - indicates if in deploy mode (include all nodes)
*/ 
export function generateCode(state, all=false, deploy=false) {
  // if all experiments are requested, then source is obviously mainTimeline
  // otherwise, only generate code for the currently previewed node
  let timelineNodes = (all) ? state.mainTimeline : [state.previewId];
  let blocks = [];
  let node;

  // bool that descides if this node should be include
  let include;

  for (let id of timelineNodes) {
    if (!id) continue;
    node = state[id];
    // if play all experiments, let node.enable decide if this node is included
    // if in deploy mode, include all nodes
    include = (!all || deploy) ? true : node.enabled;
    if (include) {
      // generate timeline block
      if (isTimeline(node)) {
        if (node.childrenById.length > 0 || deploy) {
          blocks.push(generateTimelineBlock(state, node, all, deploy));
        }
        // generate trial block
      } else {
        if (node.parameters.type) {
          let error = [];
          let trialBlock = generateTrialBlock({
            state: state,
            trial: node,
            all: all,
            deploy: deploy,
            parameterType: node.parameters.type,
            error: error
          });

          // when in preview mode, render error message if there is
          if (!deploy && error.length > 0) {
            return ErrorMessage(error);
          }

          if (trialBlock) {
            blocks.push(trialBlock);
          }
        }
      }
    }
  }

  // if nothing is generated
  if (!blocks.length) {
    return Welcome;
  }

  // finalize jsPsych block
  let obj = {
    ...state.jsPsychInit,
    timeline: blocks
  };

  // if in deploy mode, we want the experiment to take over whole page
  if (deploy) {
    obj["display_element"] = undefined;
  }

  // fetch s3 path, if there is one (if user hasn't logged in or saved anything, state.media is empty)
  let s3Path = (state && state.media) ? state.media.Prefix : "";

  // call jsPsych
  return "jsPsych.init(" + stringify(obj, (deploy) ? DEPLOY_PATH : s3Path) + ");";
}


/*
Resolve path for media that are inserted by typing "<path>filename</path>"

Param
str, path string
filePath, the path of file
*/
function resolveMediaPath(str, prefix) {
  let matches = (str) ? str.match(/<path>(.*?)<\/path>/g) : null;
  let deploy = prefix === DEPLOY_PATH;
  let processFunc = getSignedUrl;
  // in diy deploy mode, we don't get file from S3
  if (deploy) {
    processFunc = p => p;
  }
  if (matches) {
    for (let m of matches) {
      str = str.replace(m, 
        processFunc(prefix + m.replace(/<\/?path>/g, ''))
      );
    }
  }
  return str;
}


/*
Generate jspsych trial block.
For each parameter in trial.parameters, it should be a composite object which
is defined in reducers/editor

***Note that if a parameter value is undefined, then we return false to let caller 
function knows that this trial should not be rendered;

export const createComplexDataObject = (value=null, func=createFuncObj(), mode=null) => ({
  isComplexDataObject: true,
  mode: mode, 
  value: value,
  func: func,
  timelineVariable: null,
})
*/
function generateTrialBlock({state, trial, all=false, deploy=false, parameterType, error}) {
  let res = {};
  let parameters = trial.parameters;
  let parameterInfo = parameterType && injectJsPsychUniversalPluginParameters(jsPsych.plugins[parameterType].info.parameters);

  for (let key of Object.keys(parameters)) {
    // NOTE: this function currently does not fully operate on nested options
    // don't render if (parameter_default_value is undefined and its actual value is null/undefined)
    // if (parameterInfo[key].hasOwnProperty('default') && parameterInfo[key].default === undefined) {
    //   console.log(parameters[key])
    // }
    if (parameterInfo && parameterInfo[key] && parameterInfo[key].default === undefined) {
      let mode = parameters[key].mode;
      let value = null;
      switch(mode) {
        case ParameterMode.USE_FUNC:
          value = parameters[key].func.code;
          break;
        case ParameterMode.USE_TV:
          value = parameters[key].timelineVariable;
          break;
        default:
          value = parameters[key].value;
          break;
      }

      if (isValueEmpty(value)) {
        error.push(parameterInfo[key].pretty_name);
      }
    }

    res[key] = parameters[key];
  }
  return res;
}

/*
Generate jsPysch timeline block

*/
function generateTimelineBlock(state, node, all=false, deploy=false) {
  // spread parameters to res
  let res = {
    ...node.parameters
  }
  delete res[GuiIgonoredInfoEnum.root];
  let timeline = [];
  let desc, include;
  for (let descId of node.childrenById) {
    desc = state[descId];
    // if play all experiments, let node.enable decide if this node is included
    // if in deploy mode, include all nodes
    include = (!all || deploy) ? true : desc.enabled;
    if (include) {
      if (isTimeline(desc)) {
        // if timeline is empty, skip
        if (desc.childrenById.length > 0) {
          // recusive call
          timeline.push(generateTimelineBlock(state, desc, all, deploy));
        } 
      } else {
        if (desc.parameters.type) {
          // generate trial block
          let error = [];
          let trialBlock = generateTrialBlock({
            state: state,
            trial: desc,
            all: all,
            deploy: deploy,
            parameterType: desc.parameters.type,
            error: error
          });
          if (!isValueEmpty(trialBlock)) {
            timeline.push(trialBlock);
          }
        }
      }
    }
  }

  res.timeline = timeline;
  return res;
}

/*
Generate index.html

deployInfo is defined in function deploy
*/
export function generatePage({
  deployInfo,
  cloudMode = false,
  userId = '',
  customCode='',
  experimentId=''
}) {
  let OsfPostHelper = `
    function ${SaveDataToOSF_Function_Name}(data) {
        let postData = {
          userId: "${userId}",
          experimentData: data,
          experimentId: "${experimentId}"
        };
        let request = new XMLHttpRequest();
        request.open("POST", "${SaveDataAPI}", true);
        request.send(JSON.stringify(postData));
    }
  `

  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${deployInfo.experimentName}</title>
      <link href="./jsPsych/jspsych.css" rel="stylesheet" type="text/css"></link>
      <script type="text/javascript" src="./jsPsych/jspsych.min.js"></script>
    </head>
    <body id="${jsPsych_Display_Element}" class="${jsPsych_Display_Element}">
    </body>
    <script>
      ${customCode}
      ${cloudMode ? OsfPostHelper : ''}
      ${deployInfo.code}
    </script>
  </html>
`
}

/*
Specially written for stringify obj in this app to generate code
For functions, turn it to
{
  isFunc: true,
  code: function
}

For all trial item, turn it to
{
  isComplexDataObject: true,
  value: value,
  mode: string,
  func: func obj
  timelineVariable: string
}

*/
export function stringify(obj, filePath) {
  if (!obj) return JSON.stringify(obj);
  
  let type = typeof obj;
  switch (type) {
    // if target is object
    case 'object':
      let res = [];
      // if target is array
      if (Array.isArray(obj)) {
        res.push("[");
        let l = obj.length,
          i = 1;
        for (let item of obj) {
          res.push(stringify(item, filePath));
          if (i++ < l) {
            res.push(",");
          }
        }
        res.push("]");
        // if it is supposed to be function, call stringifyFunc
      } else if (obj.isFunc) { // keep obj.isFunc for backward compatability
        return stringifyFunc(obj, filePath);
        // if it is a trial item
      } else if (obj.isComplexDataObject) { // keep obj.isComplexDataObject for backward compatability
        switch(obj.mode) {
          // if user wants to use function mode
          case ParameterMode.USE_FUNC:
            // recusive call stringify to generate code for obj.func
            return stringify(obj.func, filePath);
          // if user wants to use timeline variable 
          case ParameterMode.USE_TV:
            // add jsPsych api call
            return `jsPsych.timelineVariable("${obj.timelineVariable}")`;
          case ParameterMode.USE_VAL:
          default:
            // recusive call stringify to generate code for obj.value
            return stringify(obj.value, filePath);
        }
      } else {
        // normal object
        res.push("{");
        let keys = Object.keys(obj);
        let l = keys.length,
          i = 1;
        for (let key of keys) {
          res.push('"' + key + '":' + stringify(obj[key], filePath));
          if (i++ < l) {
            res.push(",");
          }
        }
        res.push("}");
      }
      return res.join("");
    default:
      // resolve path for all normal values
      return resolveMediaPath(JSON.stringify(obj), filePath);
  }
}

/*
This function [uses esprima to parse function code and] resolve
media path for all files wrapped in this tag <path></path>

*/
function stringifyFunc(obj, filePath) {
  let func = obj.ifEval ? obj.code : JSON.stringify(obj.code);
  
  return resolveMediaPath(func, filePath);
}