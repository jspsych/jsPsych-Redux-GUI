import AWS from '../aws';

export const Bucket_Name = "jspsych-builder";
export const Website_Bucket = "builder.jspsych.org";
export const Cloud_Bucket = "experiments.jspsych.org";
export const Api_Version = "2006-03-01";
export const Delimiter = "/";

/*
Connect to S3
*/
function connectS3(bucket=Bucket_Name) {
  return new AWS.S3({
    apiVersion: Api_Version,
    params: {
      Bucket: bucket
    },
  });
}

/*
Returns a promise of S3 API call "putObject"
*/
export function uploadFile({
  param,
  progressHook = null,
  bucket = Bucket_Name
}) {
  if (!progressHook) {
    return connectS3(bucket).putObject({
      ...param
    }).promise();
  } else {
    return connectS3(bucket).putObject({
      ...param
    }).on('httpUploadProgress', function(evt) {
      progressHook(parseInt((evt.loaded * 100) / evt.total, 10));
    }).promise();
  }
}

/*
Returns require param for S3 API call "putObject"

file --> should have file.name property (file object)
*/
export function generateUploadParam({Key, Body, ...params}) {
  return {
    // specified s3 path of to-be-stored file
    Key: Key,
    // file content
    Body: Body,
    ...params
  };
}

/*
Upload a list of files.

progressHook --> callback that shows user uploading progress
*/
export function uploadFiles({params, progressHook=null, bucket=Bucket_Name}){
  return Promise.all(params.map((param) => {
    return uploadFile({
      param: param, 
      progressHook: progressHook ? (p) => { progressHook(param.Body.name, p) } : progressHook, 
      bucket: bucket
    })
    }));
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
export function listBucketContents({Prefix, Delimiter = Delimiter, bucket = Bucket_Name}){
  return connectS3(bucket).listObjectsV2({
      Delimiter: Delimiter,
      Prefix: Prefix
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
export function generateCopyParam({
  source,
  target,
  sourceBucket = Bucket_Name,
  targetBucket = Bucket_Name,
  ...params
}) {
  return {
    Bucket: targetBucket,
    CopySource: `${sourceBucket}/${source}`,
    Key: target,
    ...params
  };
}

/*
Copy S3 file
*/
export function copyFile({param, bucket=Bucket_Name}) {
  return connectS3(bucket).copyObject(param).promise();
}

/*
Copy S3 files
*/
export function copyFiles({params, bucket=Bucket_Name}) {
  return Promise.all(params.map((param) => (copyFile({param: param, bucket: bucket}))));
}


export function getJsPsychLib(callback) {
  let prefix = 'jsPsych/'
  let libFiles = ['jspsych.css', 'jspsych.min.js'];

  return Promise.all(libFiles.map((name) => {
    return connectS3(Website_Bucket).getObject({
      Key: prefix + name
    }).promise().then((data) => {
      callback(name, data.Body);
    });
  }));
}


export function deleteObject(param) {
  return connectS3().deleteObject({...param}).promise();
}