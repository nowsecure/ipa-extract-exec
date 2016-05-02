'use strict'
const macho = require('macho')
const fatmacho = require('fatmacho')
const fs = require('fs')

function isEncrypted (cmds) {
  for (let cmd of cmds) {
    if (cmd.type === 'encryption_info') {
      if (cmd.id) {
        return true
      }
    }
  }

  return false;
}

function isEncryptedSync (path) {
  const data = fs.readFileSync(path)
  try {
    const exec = macho.parse(data)
    return isEncrypted(exec.cmds)
  } catch (e) {
    const fat = fatmacho.parse(data)
    for (let bin of fat) {
      const exec = macho.parse(bin.data)
      if (isEncrypted(exec.cmds)) { return true }
    }
  }
  return false
}

module.exports = isEncryptedSync

