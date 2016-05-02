# SYNOPSIS

Extract the executable from an IPA file along with helpful meta data.

```js
var fs = require('fs');
var extract = require('ipa-extract-exec');

var fd = fs.openSync(__dirname + '/Foo.ipa', 'r');

extract(fd, function(err, path, fd, name, plist, encrypted ) {
  if (err) throw err;
  console.log(`${name} is encrypted: ${encrypted}`)
});
```

# LICENSE

MIT

