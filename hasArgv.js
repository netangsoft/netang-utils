const _indexOf = require('lodash/indexOf')

/**
 * 【node】是否有命令
 */
function hasArgv(argv) {
    return _indexOf(process.argv, argv) > -1
}

module.exports = hasArgv
