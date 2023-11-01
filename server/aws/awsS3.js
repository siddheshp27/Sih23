const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');

exports.uploadToS3 = async (id, buffer) => {
  const client = new S3Client({});
  const bucketUrl = 'https://myfirewallbucket.s3.ap-south-1.amazonaws.com/';
  const command = new PutObjectCommand({
    Bucket: 'myfirewallbucket',
    Key: id,
    Body: buffer,
    ContentType: 'image/jpeg', // Set the Content-Type here,
    ContentDisposition: 'inline' // Display in the browser
  });

  try {
    const response = await client.send(command);
    return `${bucketUrl}${id}`;
  } catch (err) {
    console.error(err);
  }
};
