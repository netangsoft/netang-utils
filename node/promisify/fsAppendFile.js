const fs = require('fs')
const { promisify } = require('util')
module.exports = promisify(fs.appendFile)
