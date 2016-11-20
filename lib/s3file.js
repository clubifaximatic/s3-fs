const AWS = require('aws-sdk');
const PassThrough = require('stream').PassThrough;

const debug = require('debug')('s3fs');

const url = require('url');

var _s3 = null;

/**
 * constructor
 */
function S3File (fileUrl) {
  const parsed = url.parse(fileUrl);

  this.bucket = parsed.hostname;
  this.file = parsed.pathname;

  //rename slach
  if (this.file && this.file.length > 1) {
    this.file = this.file.substring(1);
  }

  debug('bucket', this.bucket, 'file', this.file);
};

/**
 * Write a chunk to the file
 */
S3File.prototype.write = function (what) {
  if (this.closed) {
    return console.error('ERROR. Stream was closed');
  }

  this.upload.write(what);
};

/**
 * End writing and flush file
 */
S3File.prototype.end = function () {
  this.closed = true;
  this.upload.end();
};

/**
 *
 */
S3File.prototype.createReadStream = function () {
  debug('createReadStream', this.bucket, this.file);

  var stream = getS3Client().getObject({ Bucket: this.bucket, Key: this.file }).createReadStream();

  return stream;
};

/**
 *
 */
S3File.prototype.createWriteStream = function (cb) {
  debug('createWriteStream', this.bucket, this.file);

  // preparate target Stream
  var stream = PassThrough();

  // prepare upload file
  getS3Client().upload({ Bucket: this.bucket, Key: this.file, Body: stream }, function (err, result) {
    if (cb) cb(err, result);
  });

  return stream;
};

S3File.prototype.unlink = function (cb) {
  var params = {
    Bucket: this.bucket,
    Key: this.file
  };

  getS3Client().deleteObject(params, cb);
};

S3File.prototype.read = function (buffer, offset, length, callback) {

};

S3File.prototype.write = function (buffer, offset, length, callback) {
  
};

/**
 * Return the S3Client. Create it if it does not exits, based on environment values
 */
function getS3Client () {
  // create s3Client if it does not exist
  if (_s3 == null) {
    _s3 = new AWS.S3({
      //accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      //secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'eu-west-1'
    });
  }

  return _s3;
}

module.exports = S3File;
