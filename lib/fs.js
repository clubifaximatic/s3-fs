var S3File = require('./s3file');

var internals = {};

module.exports = internals;

//
internals.open = function (file) {
  return new S3File(file);
};

//
internals.createReadStream = function (file, compressed) {
  return new S3File(file).createReadStream();
};

//
internals.createWriteStream = function (file, cb) {
  return new S3File(file).createWriteStream(cb);
};

//
internals.unlink = function (file, cb) {
  new S3File(file).unlink(cb);
};


//
internals.readFile = function (file, options, callback) {
  new S3File(file).read(options, callback);
};

//
internals.writeFile = function (file, buffer, options, callback) {
  new S3File(file).write(buffer, options, callback);
};

//
internals.readdir = function(path, options, callback) {
  var dir = new S3File(path)
  dir.readdir(options, callback)

  return dir;
};

// //
// internals.read = function (fd, buffer, offset, length, callback) {
//   fd.read(buffer, offset, length, callback);
// };

// //
// internals.write = function (fd, buffer, offset, length, callback) {
//   fd.write(buffer, offset, length, callback);
// };
