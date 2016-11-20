# s3-fs

Easy access to the AWS S3 files

## interface fs

`file` is a URL such as `s3://my.buket/my/path/file.ext`

### createReadStream

Create and returns a read stream

```js
const fs = require('fs');

const file = 's3://buket/file.json'

fs.createReadStream(file).pipe(process.stdout);
```

### createReadStream

Create and returns a write stream. There is a callback called when the file has been written

```js
var fs = require('fs');

const file = 's3://buket/file.json'

const writeStream = fs.createWriteStream(file, function (err, result) {
  if (err) return console.error('error', err);
  console.log('file saved', result);
});

writeStream.write('test');
writeStream.end();
```

### unlink

remove a s3 file. There is a callback called when the file has been removed

```js
var fs = require('fs');

const file = 's3://buket/file.json'

fs.unlink(file, function (err, result) {
  if (err) return console.error('error', err);
  console.log('file removed', result);
});
```

### unlink

remove a s3 file. There is a callback called when the file has been removed

//
internals.read = function (fd, buffer, offset, length, callback) {
  fd.read(buffer, offset, length, callback);
};



