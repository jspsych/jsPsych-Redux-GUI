import AWS from '../aws';

const bucketName = "jspsych-builder";
const API_VERSION = '2006-03-01';

function connectS3() {
  return new AWS.S3({
    apiVersion: API_VERSION,
    params: {
      Bucket: bucketName
    }
  });
}

function uploadFile(file, success, failure){

  connectS3().upload({
      Key: AWS.config.credentials.identityId + '/' + file.name,
      Body: file
    }, function(err, data) {
      if (err) {
        console.log(err);
        failure();
        return;
      }
      success();
    });

}

function deleteFile(file, success, failure){

  connectS3().deleteObject({
      Key: file
    }, function(err, data) {
      if (err) {
        console.log(err);
        failure();
        return;
      }
      success();
    });

}

export function listBucketContents(success, failure){

  connectS3().listObjectsV2(
    {
      Delimiter: '/',
      Prefix:AWS.config.credentials.identityId+"/"
    }, function(err, data){
      if(err) {
        console.log(err);
        failure(err);
      } else {
        console.log(data);
        success(data);
      }
    }
  );

}

export function upload(files, success, failure){
  var completed = 0;
  var updateCount = function(){
    completed++;
    if(completed === files.length){
      success();
    }
  }
  for(var i=0; i<files.length; i++){
    uploadFile(files[i], updateCount, failure);
  }
}

export function deleteObjects(files, success, failure){
  var completed = 0;
  var updateCount = function(){
    completed++;
    if(completed === files.length){
      success();
    }
  }
  for(var i=0; i<files.length; i++){
    deleteFile(files[i], updateCount, failure);
  }
}
