const process = require('process')

/**
 * 【node】获取文件 hash 名称
 */
function getPlatform() {

    if (process.platform === 'darwin') {
        return 'darwin'
    }

    if (process.platform === 'linux') {
        return 'linux'
    }

    if (process.arch === 'ia32') {
        return 'win32'
    }

    return 'win64'
}

module.exports = getPlatform
