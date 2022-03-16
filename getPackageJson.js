const path = require('path')
const ROOT_PATH = require('./_rootPath')

/**
 * 【node】获取 package.json
 */
function getPackageJson() {
    return require(path.join(ROOT_PATH, 'package.json'))
}

module.exports = getPackageJson
