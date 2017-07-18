import AWS from '../aws';

const Bucket_Name = "jspsych-builder";
const Api_Version = "2006-03-01";
const Delimiter = "/";

/*
Connect to S3
*/
function connectS3() {
  return new AWS.S3({
    apiVersion: Api_Version,
    params: {
      Bucket: Bucket_Name
    },
  });
}

/*
Returns a promise of S3 API call "putObject"
*/
function uploadFile(param, progressHook) {
  return connectS3().putObject({
    ...param
  }).on('httpUploadProgress', function(evt) {
    progressHook(parseInt((evt.loaded * 100) / evt.total, 10));
  }).promise();
}

/*
Returns require param for S3 API call "putObject"

file --> should have file.name property
*/
function uploadParam(file, experimentId) {
  let path = [AWS.config.credentials.identityId, 
              experimentId, 
              file.name];
  return {
    // path
    Key: path.join(Delimiter),
    // file content
    Body: file
  };
}

/*
Upload a list of files.

files --> array of files with file.name property
experimentId --> id of the experiment
progressHook --> callback that shows user uploading progress
*/
export function uploadFiles(files, experimentId, progressHook){
  return Promise.all(files.map((file) => (
    uploadFile(uploadParam(file, experimentId), (p) => { progressHook(file.name, p) })
    )));
}

/*
Returns require param for S3 API call "deleteObjects"
*/
function $deleteFiles(param){
  return connectS3().deleteObjects({
      ...param
    }).promise();
}

/*
Delete files from S3 bucket

filePaths --> array of S3 file addresses
*/
export function deleteFiles(filePaths) {
  if (filePaths.length < 1) return Promise.resolve("0 file is requested to be deleted.");
  return $deleteFiles({
    Delete: { Objects: filePaths.map((filePath) => ({Key: filePath})) }
  });
}

/*
List bucket contents, the fetched value should be experimentState.media
*/
export function listBucketContents(experimentId){
  return connectS3().listObjectsV2({
      Delimiter: Delimiter,
      Prefix: AWS.config.credentials.identityId + Delimiter + experimentId + Delimiter
    }).promise();
}

/*
Returns signed url
*/
export function getSignedUrl(filePath) {
  return connectS3().getSignedUrl('getObject', {
    Key: filePath
  });
}

/*
Returns array of signed url
*/
export function getSignedUrls(filePaths) {
  return filePaths.map((filePath) => (getSignedUrl(filePath)));
}

/*
Download file

key --> S3 file address
callback --> callback that deals with fetched file content
progressHook --> callback that shows user the downloading progress
index --> index of file in its array
*/
export function getFile(key, callback, progressHook, index) {
  return connectS3().getObject({
    Key: key
  }).on('httpDownloadProgress', function(evt) {
    progressHook({value: evt.loaded, index: index});
  }).promise().then((data) => {
    callback(key, data.Body);
  });
}

/*
Download files
*/
export function getFiles(keys, callback, progressHook) {
  return Promise.all(keys.map((key, i) => (getFile(key, callback, progressHook, i))));
}

/*
Returns param for S3 API call "copyObject"
*/
export function copyParam(source, target) {
  return {
    CopySource: Bucket_Name + "/" + source,
    Key: target
  };
}

/*
Copy S3 file
*/
export function copyFile(param) {
  return connectS3().copyObject(param).promise();
}

/*
Copy S3 files
*/
export function copyFiles(params) {
  return Promise.all(params.map((param) => (copyFile(param))));
}