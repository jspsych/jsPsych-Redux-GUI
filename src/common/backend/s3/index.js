import AWS from '../aws';

const Bucket_Name = "jspsych-builder";
const Api_Version = "2006-03-01";
const Delimiter = "/";

function connectS3() {
  return new AWS.S3({
    apiVersion: Api_Version,
    params: {
      Bucket: Bucket_Name
    },
  });
}

function uploadFile(param, progressHook) {
  return connectS3().putObject({
    ...param
  }).on('httpUploadProgress', function(evt) {
    progressHook(parseInt((evt.loaded * 100) / evt.total));
  }).promise();
}

function uploadParam(file, experimentId) {
  let path = [AWS.config.credentials.identityId, 
              experimentId, 
              file.name];
  return {
    Key: path.join(Delimiter),
    Body: file
  };
}

export function uploadFiles(files, experimentId, progressHook){
  return Promise.all(files.map((file) => (
    uploadFile(uploadParam(file, experimentId), (p) => { progressHook(file.name, p) })
    )));
}

function $deleteFiles(param){
  return connectS3().deleteObjects({
      ...param
    }).promise();
}

export function deleteFiles(filePaths) {
  if (filePaths.length < 1) return Promise.resolve("0 file is requested to be deleted.");
  return $deleteFiles({
    Delete: { Objects: filePaths.map((filePath) => ({Key: filePath})) }
  });
}

export function listBucketContents(experimentId){
  return connectS3().listObjectsV2({
      Delimiter: Delimiter,
      Prefix: AWS.config.credentials.identityId + Delimiter + experimentId + Delimiter
    }).promise();
}

export function getSignedUrl(filePath) {
  return connectS3().getSignedUrl('getObject', {
    Key: filePath
  });
}

export function getSignedUrls(filePaths) {
  return filePaths.map((filePath) => (getSignedUrl(filePath)));
}

export function getFile(key, callback, progressHook, index) {
  return connectS3().getObject({
    Key: key
  }).on('httpDownloadProgress', function(evt) {
    progressHook({value: evt.loaded, index: index});
  }).promise().then((data) => {
    callback(key, data.Body);
  });
}

export function getFiles(keys, callback, progressHook) {
  return Promise.all(keys.map((key, i) => (getFile(key, callback, progressHook, i))));
}

export function copyParam(source, target) {
  return {
    CopySource: Bucket_Name + "/" + source,
    Key: target
  };
}

export function copyFile(param) {
  return connectS3().copyObject(param).promise();
}

export function copyFiles(params) {
  return Promise.all(params.map((param) => (copyFile(param))));
}