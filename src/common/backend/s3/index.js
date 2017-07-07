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

function uploadFile(param){
  return connectS3().upload({
      ...param
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

export function uploadFiles(files, experimentId){
  return Promise.all(files.map((file) => (
    uploadFile(uploadParam(file, experimentId))
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

