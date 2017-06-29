import AWS from '../aws';
const bucketName = "jspsych-builder";

function uploadFile(file){

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
        return;
      }
      alert('Successfully uploaded file.');
    });

}

export function upload(files){
  for(var i=0; i<files.length; i++){
    uploadFile(files[i]);
  }
}
