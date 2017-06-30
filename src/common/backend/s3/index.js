import AWS from '../aws';
const bucketName = "jspsych-builder";

function uploadFile(file, success, failure){

  var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: bucketName}
  });

  s3.upload({
      Key: file.name,
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

  var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: bucketName}
  });

  s3.deleteObject({
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

  var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: bucketName}
  });

  s3.listObjectsV2({}, function(err, data){
    if(err) {
      console.log(err);
      failure(err);
    } else {
      //console.log(data);
      success(data);
    }
  });

}

export function upload(files, success, failure){
  var completed = 0;
  for(var i=0; i<files.length; i++){
    uploadFile(files[i], function(){
      completed++;
      if(completed == files.length){
        success();
      }
    }, failure);
  }
}

export function deleteObjects(files, success, failure){
  var completed = 0;
  for(var i=0; i<files.length; i++){
    deleteFile(files[i], function(){
      completed++;
      if(completed == files.length){
        success();
      }
    }, failure);
  }
}
