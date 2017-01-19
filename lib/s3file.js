const AWS = require('aws-sdk');
const PassThrough = require('stream').PassThrough;
const url = require('url');

const debug = require('debug')('s3fs');

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


/**
{ IsTruncated: false,
  Contents: [
    { Key: 'databases/products/json/2016/11/15/23/firehose_products_to_s3-2-2016-11-15-23-24-46-92ba3455-1b91-43b2-bb15-95c36b641bff.gz',
       LastModified: Tue Nov 15 2016 23:24:48 GMT+0000 (GMT),
       ETag: '"f87bc3bacb472a0eeee0f78907a52227"',
       Size: 1488235,
       StorageClass: 'STANDARD' 
    }
  ]
  Name: 'data.mallzee.com',
  Prefix: 'databases/products/json/2016/11/15',
  MaxKeys: 1000,
  CommonPrefixes: [
    { Prefix: 'tmp/csv-tmp/' }
  ],
  KeyCount: 96}
*/
S3File.prototype.readdir = function (options, callback) {

  //check options
  if (!callback) {
    callback = options;
    options = {};
  }

  // check prefixt
  const prefix = this.file.endsWith('/') ? this.file : this.file + '/';
  const params = {
    Bucket: this.bucket,
    Prefix: prefix,
    Delimiter: '/',
    ContinuationToken: options.ContinuationToken
  };

  // check options for FLAT (all files)
  if (options.flat) {
    params.Prefix = this.file;
    delete params.Delimiter;
  }

  var _this = this;

  getS3Client().listObjectsV2(params, function (err, result) {
    if (err) return callback(err);

    const docs = [];

    // add folders
    const dirs = false;
    result.CommonPrefixes.forEach(function(doc) {
      docs.push(doc.Prefix)
      dirs = true;
    });

    // add files
    (result.Contents || []).forEach(function (doc) {
      const file = (dirs) ? doc.Key : doc.Key.substring(prefix.length);
      docs.push(file)
    });

    var next = undefined;

    if (result.NextContinuationToken) {

      // call with new parameter
      next = function () {
        const newoptions = {
          flat: options.flat,
           ContinuationToken: result.NextContinuationToken
        }

        _this.readdir(newoptions, callback);
      }
    }

    callback(err, docs, next);
  })
}

/**
/**
var params = {
  Bucket: 'STRING_VALUE', 
  Key: 'STRING_VALUE', 
  IfMatch: 'STRING_VALUE',
  IfModifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
  IfNoneMatch: 'STRING_VALUE',
  IfUnmodifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
  PartNumber: 0,
  Range: 'STRING_VALUE',
  RequestPayer: 'requester',
  ResponseCacheControl: 'STRING_VALUE',
  ResponseContentDisposition: 'STRING_VALUE',
  ResponseContentEncoding: 'STRING_VALUE',
  ResponseContentLanguage: 'STRING_VALUE',
  ResponseContentType: 'STRING_VALUE',
  ResponseExpires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
  SSECustomerAlgorithm: 'STRING_VALUE',
  SSECustomerKey: new Buffer('...') || 'STRING_VALUE',
  SSECustomerKeyMD5: 'STRING_VALUE',
  VersionId: 'STRING_VALUE'
};
*/
S3File.prototype.read = function (encode, callback) {

  //check options
  if (!callback) {
    callback = encode;
    encode = null;
  }

  var params = {
    Bucket: this.bucket,
    Key: this.file
  };

  getS3Client().getObject(params, function (err, buffer) {
    if (err) return callback(err);

    if (encode) {
      return callback(err, buffer.Body.toString(encode));
    }
    callback(err, buffer.Body);
  });
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
