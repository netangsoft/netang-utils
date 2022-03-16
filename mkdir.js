const fs = require('fs')
const path = require('path')
const dirExists = require('./dirExists')

/*
 * 【node】创建目录(递归)
 */
function mkdir(dirname) {

    if (dirExists(dirname)) {
        return true
    }

    if (mkdir(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
    }

    return false
}

module.exports = mkdir
