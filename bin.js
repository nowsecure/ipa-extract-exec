#!/usr/bin/env node
'use strict'
const extractExec = require('./index')
const fs = require('fs')

if (!process.argv[2]) {
  console.error(`${process.argv[1]} <path>`)
  process.exit(1)
}

const fd = fs.openSync(process.argv[2], 'r')

extractExec(fd, (err, path, fd, name, plist, encrypted, cleanupCb) => {
  if (err) { throw err }
  console.log(`${name} is ${encrypted ? 'encrypted' : 'not encrypted'}`)
})
