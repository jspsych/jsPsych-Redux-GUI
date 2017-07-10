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

export function getFile(key, callback, progressHook) {
  return connectS3().getObject({
    Key: key
  }).on('httpDownloadProgress', function(evt) {
    progressHook(evt.loaded);
  }).promise().then((data) => {
    callback(key, data.Body);
  });
}

export function getFiles(keys, callback, progressHook) {
  return Promise.all(keys.map((key) => (getFile(key, callback, progressHook))));
}
