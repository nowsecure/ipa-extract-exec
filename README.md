# SYNOPSIS

Extract the executable from an IPA file along with helpful meta data.

```js
var fs = require('fs');
var extract = require('ipa-extract-exec');
var encryptedSync = require('macho-is-encrypted').path

var fd = fs.openSync(__dirname + '/Foo.ipa', 'r');

extract(fd, function (err, tmpPath, name, plist, origFile) {
  if (err) throw err;
  const encrypted = encryptedSync(tmpPath)
  console.log(`${name} (${plist.CFBundleIdentifier}) is ${encrypted}`)
});
```

# LICENSE

MIT

