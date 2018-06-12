var JSZip = require('jszip');
var FileSaver = require('filesaver.js-npm');
import { initState as jsPsychInitState, jsPsych_Display_Element, StringifiedFunction } from '../../reducers/Experiment/jsPsychInit';
import { createComplexDataObject, ParameterMode, JspsychValueObject, GuiIgonoredInfoEnum } from '../../reducers/Experiment/editor';
import { createTrial } from '../../reducers/Experiment/organizer';
import { isTimeline } from '../../reducers/Experiment/utils';


const SaveData_OSF_API = "https://0xkjisg8e8.execute-api.us-east-2.amazonaws.com/DataStorage/jsPsychMiddleman/";
const SaveDataToOSF_Function_Name = "saveDataToOSF";
const OsfPostHelper = (experimentId) => {
  return `
    function ${SaveDataToOSF_Function_Name}(data) {
        let postData = {
          experimentData: data,
          experimentId: "${experimentId}"
        };
        let request = new XMLHttpRequest();
        request.open("POST", "${SaveData_OSF_API}", true);
        request.onload = () => {
          if (request.status === 200) {
            console.log(request.responseText);
          }
        }
        request.send(JSON.stringify(postData));
    }
  `
}

const SaveData_PHP_API = 'save_data.php';
const SaveData_PHP_Function_Name = 'saveDataPHP';
const SaveData_PHP_Disk_API_Code = `<?php
// data storage path
$dataPath = "data";

try {
  $rest_json = file_get_contents("php://input");
  $_POST = json_decode($rest_json, true);
  if (!file_exists('data')) {
    mkdir('data', 0777, true);
  }
  $filename = sprintf("./%s/%s-%d.csv", $dataPath, uniqid(), time());
  $data = $_POST['filedata'];
  file_put_contents($filename, $data);
  echo '200';
} catch (Exception $e) {
  echo $e->getMessage();
}

?>`;

export const SQLite_Database = {
  filename: 'jsPsychData.sqlite3',
  table: 'jsPsych'
};
const SaveData_PHP_SQLite_Code = `
<?php

$post_data = json_decode(file_get_contents('php://input'), true);
$data_array = $post_data["data_array"];

$database = "${SQLite_Database.filename}";
$table = "${SQLite_Database.table}";

try {
  $conn = new PDO("sqlite:$database");
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  // First stage is to get all column names from the table and store
  // them in $col_names array.
  $stmt = $conn->prepare("SHOW COLUMNS FROM \`$table\`");
  $stmt->execute();
  $col_names = array();
  while($row = $stmt->fetchColumn()) {
    $col_names[] = $row;
  }
  // Second stage is to create prepared SQL statement using the column
  // names as a guide to what values might be in the JSON.
  // If a value is missing from a particular trial, then NULL is inserted
  $sql = "INSERT INTO $table VALUES(";
  for($i = 0; $i < count($col_names); $i++){
    $name = $col_names[$i];
    $sql .= ":$name";
    if($i != count($col_names)-1){
      $sql .= ", ";
    }
  }
  $sql .= ");";
  $insertstmt = $conn->prepare($sql);
  for($i=0; $i < count($data_array); $i++){
    for($j = 0; $j < count($col_names); $j++){
      $colname = $col_names[$j];
      if(!isset($data_array[$i][$colname])){
        $insertstmt->bindValue(":$colname", null, PDO::PARAM_NULL);
      } else {
        $insertstmt->bindValue(":$colname", $data_array[$i][$colname]);
      }
    }
    $insertstmt->execute();
  }
  echo 'Success';
} catch(PDOException $e) {
  echo $e->getMessage();
}
$conn = null;
?>
`;
const SaveData_PHP_MySQL_Code = ``;

const generateSaveData_PHP_API_Code = (mode) => {
  switch(mode) {
    case enums.DIY_Deploy_Mode.mysql:
      return SaveData_PHP_MySQL_Code;
    case enums.DIY_Deploy_Mode.sqlite:
      return SaveData_PHP_SQLite_Code;
    case enums.DIY_Deploy_Mode.disk:
    default:
      return SaveData_PHP_Disk_API_Code;
  }
}
const diyPostHelper = (mode) => {
  return `function ${SaveData_PHP_Function_Name}(data) {
    let request = new XMLHttpRequest();
    request.open("POST", "${SaveData_PHP_API}", true);
    request.onload = () => {
      if (request.status === 200) {
        let response = JSON.parse(request.responseText);
        console.log(response);
      }
    }
    request.send(${mode === enums.DIY_Deploy_Mode.disk ? `JSON.stringify({ filedata: data })` : 'data'});
  }`
}

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

const cloudSaveDataFunctionCode = () => {
  return `
    function() {
      ${SaveDataToOSF_Function_Name}(jsPsych.data.get().csv());
    }
  `
}
const diySaveDataFunctionCode = (mode) => {
  let data = '';
  switch(mode) {
    case enums.DIY_Deploy_Mode.mysql:
    case enums.DIY_Deploy_Mode.sqlite:
      data = 'jsPsych.data.get().json()';
      break;
    case enums.DIY_Deploy_Mode.disk:
    default:
      data = 'jsPsych.data.get().csv()';
  }
  return `function() {
    ${SaveData_PHP_Function_Name}(${data});
  }`
}

const generateDataSaveTrial = ({code}) => {
  let param = {
    type: 'call-function',
    func: createComplexDataObject(null)
  };
  param.func.func.code = code;
  param.func.mode = ParameterMode.USE_FUNC;

  let res = createTrial('SaveDataTrial',
      null,
      "Save Data",
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
export function diyDeploy({state, progressHook, media}) {
  let experimentState = utils.deepCopy(state.experimentState),
      diyDeployInfo = experimentState.diyDeployInfo,
      saveAfter = diyDeployInfo.saveAfter,
      mode = diyDeployInfo.mode;

  /* ************ Step 0: Inject save data trial ************ */
  let saveTrial = generateDataSaveTrial({code: diySaveDataFunctionCode(mode)});
  experimentState[saveTrial.id] = saveTrial;
  experimentState.mainTimeline.splice(saveAfter+1, 0, saveTrial.id);
  /* ************ Step 0: Inject save data trial ************ */

  var zip = new JSZip();

  /* ************ Step 1 ************ */
  // Extract deploy information
  let deployInfo = extractDeployInfomation({experimentState, media});

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
  zip.file("index.html", generatePage({
    deployInfo: deployInfo,
    isDiyDeployment: true,
    diyDeployMode: mode
  }));

  // generate save_data.php according to user's choice of storage
  zip.file(SaveData_PHP_API, generateSaveData_PHP_API_Code(mode));

  // create assets folder
  var assets = zip.folder(Deploy_Folder);
  var jsPsych = zip.folder(jsPysch_Folder);

  // download media
  return myaws.S3.getFiles(filePaths, (key, data) => {
    assets.file(deployInfo.media[key], data);
  }, (loaded) => {
    progressHook(loaded, deployInfo.downloadSize);
  }).then(() => {
    // download jspysch library
    myaws.S3.getJsPsychLib((key, data) => {
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
  state,
  media
}) {
  var experimentState = utils.deepCopy(state.experimentState),
      cloudDeployInfo = experimentState.cloudDeployInfo,
      experimentId = experimentState.experimentId,
      userState = state.userState,
      user = userState.user,
      saveAfter = cloudDeployInfo.saveAfter;

  let saveTrial = generateDataSaveTrial({code: cloudSaveDataFunctionCode()});
  experimentState[saveTrial.id] = saveTrial;
  experimentState.mainTimeline.splice(saveAfter+1, 0, saveTrial.id);

  var deployInfo = extractDeployInfomation({experimentState, media}),
      filePaths = Object.keys(deployInfo.media);

  var indexPage = new File([generatePage({
    deployInfo: deployInfo,
    isCloudDeployment: true,
    experimentId: experimentId
  })], "index.html");
  var param = myaws.S3.generateUploadParam({
    Key: [experimentId, indexPage.name].join(myaws.S3.Delimiter),
    Body: indexPage,
    ContentType: 'text/html'
  });

  function uploadCode() {
    return myaws.S3.uploadFile({
      param: param,
      bucket: myaws.S3.Cloud_Bucket
    });
  }
  
  function uploadAsset() {
    return myaws.S3.listBucketContents({
      Prefix: `${experimentId}/${Deploy_Folder}/`,
      bucket: myaws.S3.Cloud_Bucket
    }).then((data) => {
      let exists = data.Contents.map(item => {
        let keys = item.Key.split(myaws.S3.Delimiter);
        return [state.userState.user.identityId, experimentId, keys[keys.length - 1]].join(myaws.S3.Delimiter);
      })
      filePaths = filePaths.filter(f => exists.indexOf(f) < 0);
      return filePaths.map((f) => {
        return myaws.S3.generateCopyParam({
          source: f,
          target: `${experimentId}/${Deploy_Folder}/${deployInfo.media[f]}`,
          targetBucket: myaws.S3.Cloud_Bucket
        })
      });
    }).then((params) => {
      return myaws.S3.copyFiles({
        params: params
      });
    });
  }

  function uploadLib() {
    // `${experimentId}/${jsPysch_Folder}/`
    return myaws.S3.listBucketContents({
      Prefix: `${jsPysch_Folder}/`,
      bucket: myaws.S3.Website_Bucket
    }).then((data) => {
      let jsPsychParams = data.Contents.map((f) => (
        myaws.S3.generateCopyParam({
          source: f.Key,
          target: `${experimentId}/${f.Key}`,
          targetBucket: myaws.S3.Cloud_Bucket,
          sourceBucket: myaws.S3.Website_Bucket,
        })
      ));
      return myaws.S3.copyFiles({params: jsPsychParams});
    });
  }

  return Promise.all([uploadCode(), uploadAsset(), uploadLib()]);
}

function extractDeployInfomation({experimentState, media}) {
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
  extractDeployInfomationHelper(experimentState, deployInfo, media.Prefix);
  let resources = Array.isArray(media.Contents) ? media.Contents.map(f => [f.Key, f.Size]) : [];
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
  let processFunc = myaws.S3.getSignedUrl;
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
  let parameterInfo = parameterType && utils.injectJsPsychUniversalPluginParameters(jsPsych.plugins[parameterType].info.parameters);

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

      if (utils.isValueEmpty(value)) {
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
          if (!utils.isValueEmpty(trialBlock)) {
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
  isCloudDeployment = false,
  customCode='',
  experimentId='',
  isDiyDeployment = false,
  diyDeployMode='',
}) {
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
      ${isDiyDeployment ? diyPostHelper(diyDeployMode) : ''}
      ${isCloudDeployment ? OsfPostHelper(experimentId) : ''}
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



function preprocessData() {
  let rows = jsPsych.data.get().values(),
    columns = jsPsych.data.get().uniqueNames(),
    dataType = {},
    convertedData = rows.map(() => ({}));

  let isFloat = n => n === +n && n !== (n | 0);
  let db_type = {
    text: 'TEXT',
    integer: 'INTEGER',
    real: 'REAL',
    varchar: 'VARCHAR(255)'
  };
  for (let col of columns) {
    let type = null;

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i],
        v = row[col],
        t = typeof v,
        convertedRow = convertedData[i];
      switch (t) {
        case 'object':
          // Consider it as json string in SQLite
          type = v ? db_type.text : v;
          convertedRow[col] = v ? JSON.stringify(v) : v;
          break;
        case 'boolean':
          type = db_type.integer;
          convertedRow[col] = v ? 1 : 0;
          break;
        case 'number':
          convertedRow[col] = v;
          if (type !== db_type.real) {
            type = isFloat(v) ? db_type.real : db_type.integer;
          }
          break;
        case 'string':
          convertedRow[col] = v;
          if (type === db_type.text || v.length > 255) {
            type = db_type.text;
          } else {
            type = db_type.varchar;
          }
          break;
        case 'undefined':
        default:
          convertedRow[col] = null;
          break;
      }
    }

    if (type !== null) {
      dataType[col] = type;
    } else {
      for (let row of convertedData) {
        delete row[col];
      }
    }
  }

  return {
    data: convertedData,
    dataType: dataType
  }
}
