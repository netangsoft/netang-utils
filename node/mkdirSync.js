const fs = require('fs')
const dirExistsSync = require('./dirExistsSync')

/*
 * 创建目录(递归)
 */
function mkdirSync(dirname) {

    // 如果目录存在
    return !! dirExistsSync(dirname)
        // 或 创建目录
        || !! fs.mkdirSync(dirname, {
            mode: 0o777,
            recursive: true
        })
}

module.exports = mkdirSync
