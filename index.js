'use strict'
const extract = require('ipa-extract-info')
const join = require('path').join
const fromFd = require('yauzl').fromFd
const basename = require('path').basename
const tmp = require('tmp')
const isEncryptedSync = require('./is-encrypted-sync')
const createWriteStream = require('fs').createWriteStream

function isOurExec (entry, name) {
  const filename = entry.fileName
  return filename.indexOf('.app/') && basename(filename) === name
}

function getExecStream (fd, name, cb) {
  fromFd(fd, (err, zip) => {
    if (err) return cb(err)
    zip.on('entry', (entry) => {
      if (!isOurExec(entry, name)) { return }
      zip.openReadStream(entry, (err, stream) => {
        if (err) { return cb(err) }
        return cb(null, stream)
      })
    })
  })
}

function extractExec (fd, cb) {
  extract(fd, (err, res) => {
    if (err) { throw err }

    const plist = res[0]
    const name = plist.CFBundleExecutable
    getExecStream(fd, name, function (err, stream) {
      if (err) { return cb(err) }
      tmp.file((err, path, fd, cleanup) => {
        if (err) { return cb(err) }

        stream.pipe(createWriteStream(null, { fd: fd }))
        stream
          .on('end', () => {
            try {
              return cb(null, path, fd, name, plist, isEncryptedSync(path), cleanup)
            } catch (e) {
              return cb(e)
            }
          })
          .on('error', (err) => {
            return cb(err)
          })
      })
    })
  })
}

module.exports = extractExec

