'use strict'
const macho = require('macho')
const fatmacho = require('fatmacho')
const fs = require('fs')

function isEncryptedSync (path) {
  const data = fs.readFileSync(path)
  let exec
  try {
    exec = [].concat(macho.parse(data))
  } catch (e) {
    const fat = fatmacho.parse(data)
    exec = [].concat(fat)
  }

  for (let bin of exec) {
    const exec = macho.parse(bin.data)
    for (let cmd of exec.cmds) {
      if (cmd.type === 'encryption_info') {
        if (cmd.id) {
          return true
        }
      }
    }
  }
  return false
}

module.exports = isEncryptedSync

