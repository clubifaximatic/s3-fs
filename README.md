# s3-fs

Easy access to the AWS S3 files

## interface fs

`file` is a URL chema such as `s3://my.buket/my/path/file.ext`

### fs.createReadStream(file)

Create and returns a stream for reading

```js
const fs = require('s3-fs');

const file = 's3://buket/file.txt'

fs.createReadStream(file).pipe(process.stdout);
```

### fs.createWriteStream(file)

Create and returns a stream for writing. There is a callback called when the file has been written

```js
var fs = require('s3-fs');

const file = 's3://buket/file.txt'

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
var fs = require('s3-fs');

const file = 's3://buket/file.txt'

fs.unlink(file, function (err, result) {
  if (err) return console.error('error', err);
  console.log('file removed', result);
});
```

### fs.readdir(dir, [options,] callback)

Return the name of files and folders ({String}) in the passed path (path must finish with '/'). If the returned name finish with '/' means it is a "folder"

*Options*

  * If passed `{ flat: true }` as options it returns all the tree under the directory, not only the first level

*Callback*

  1. error or null if no error
  2. array of documents or empty array if o documents found
  3. next functon to be called (next()) if there are more results, or `null if no more results

```js
var fs = require('s3-fs');

const dir = 's3://buket/mydir/'

fs.unlink(dir, function (err, files, next) {
  if (err) return console.error('error', err);
  files.forEach(function(doc) {
    console.log(doc);
  });

   // more results. 
  if (next) next();
});
```

### fs.readFile(file, [encoding,] callback)

Return the content of the file ({Buffer}) if not encoding is specified. If encoding is specified, it is applied to the resulting buffer

```js
var fs = require('s3-fs');

const file = 's3://buket/file.txt'

fs.readFile(file, function (err, buffer) {
  if (err) return console.error('error', err);

  console.log('file content: ', buffer.toString());
});

fs.readFile(file, 'base64', function (err, buffer) {
  if (err) return console.error('error', err);

  console.log('file content: ', buffer.toString());
});
```
