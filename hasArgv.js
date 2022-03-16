const _ = require('lodash')

/**
 * 【node】是否有命令
 */
function hasArgv(argv) {
    return _.indexOf(process.argv, argv) > -1
}

module.exports = hasArgv
