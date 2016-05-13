#!/usr/bin/env node
'use strict'
const extractExec = require('./')
const fs = require('fs')
const encryptedSync = require('macho-is-encrypted').path

if (!process.argv[2]) {
  console.error(`${process.argv[1]} <path>`)
  process.exit(1)
}

const fd = fs.openSync(process.argv[2], 'r')

const ENC_DESC = {
  true: 'encrypted',
  false: 'not encrypted'
}

extractExec(fd, (err, tmpPath, name, plist, origFile, cleanupCb) => {
  if (err) { throw err }
  const encrypted = encryptedSync(tmpPath)
  console.log(`${name} (${plist.CFBundleIdentifier}) is ${ENC_DESC[encrypted]}`)
})
