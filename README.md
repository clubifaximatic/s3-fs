# s3-fs

Easy access to the AWS S3 files

## interface fs

`file` is a URL chema such as `s3://my.buket/my/path/file.ext`

### fs.createReadStream(file)

Create and returns a stream for reading

```js
const fs = require('fs');

const file = 's3://buket/file.json'

fs.createReadStream(file).pipe(process.stdout);
```

### fs.createWriteStream(file)

Create and returns a stream for writing. There is a callback called when the file has been written

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

### fs.unlink(file)

remove a s3 file. There is a callback called when the file has been removed

```js
var fs = require('fs');

const file = 's3://buket/file.json'

fs.unlink(file, function (err, result) {
  if (err) return console.error('error', err);
  console.log('file removed', result);
});
```
