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
internals.read = function (fd, buffer, offset, length, callback) {
  fd.read(buffer, offset, length, callback);
};

//
internals.readFile = function (file, callback) {
  var fd = new S3File(file);
  internals.read(fd, buffer, 0, 0, callback);
};

//
internals.write = function (fd, buffer, offset, length, callback) {
  fd.write(buffer, offset, length, callback);
};

//
internals.writeFile = function (file, buffer, callback) {
  var fd = new S3File(file);
  internals.write(fd, buffer, 0, 0, callback);
};
