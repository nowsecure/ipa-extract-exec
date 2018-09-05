'use strict'
const basename = require('path').basename
const createWriteStream = require('fs').createWriteStream
const extractPlists = require('ipa-extract-info')
const fromFd = require('yauzl').fromFd
const once = require('once')
const tmp = require('tmp')

const isAppPath = (fileName) => fileName.indexOf('.app/') > 0
const isBundleExec = (entry, name) => basename(entry.fileName) === name
const isOurExec = (entry, name) => isAppPath(entry.fileName) && isBundleExec(entry, name)

function getExecStream (fd, execname, cb) {
  cb = once(cb)
  fromFd(fd, (err, zip) => {
    if (err) return cb(err)
    let entries = 0
    zip.on('entry', function onentry (entry) {
      if (!cb.called && ++entries > zip.entryCount) {
        return cb(new Error(`Failed to find executable stream for ${execname}`))
      }
      if (!isOurExec(entry, execname)) { return }

      // stop listening for other entries as we found the one we want...
      zip.removeListener('entry', onentry)
      zip.openReadStream(entry, (err, stream) => {
        if (err) { return cb(err) }
        return cb(null, entry, stream)
      })
    })
  })
}

function extractExec (fd, cb) {
  cb = once(cb)
  extractPlists(fd, (err, plists) => {
    if (err) { throw err }

    // TODO: what if we get multiple plists?
    const plist = plists[0]
    getExecStream(fd, plist.CFBundleExecutable, (err, entry, exec) => {
      if (err) { return cb(err) }
      tmp.file((err, tmpPath, fd, cleanup) => {
        if (err) { return cb(err) }

        exec.pipe(createWriteStream(null, { fd: fd }))
          .on('error', cb)
          .on('close', () => {
            return cb(null, tmpPath, plist.CFBundleExecutable, plist, entry.fileName, cleanup)
          })
      })
    })
  })
}

module.exports = extractExec

