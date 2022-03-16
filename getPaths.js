const fs = require('fs')
const path = require('path')
const _startsWith = require('lodash/startsWith')
const _toUpper = require('lodash/toUpper')
const _snakeCase = require('lodash/snakeCase')
const ROOT_PATH = require('./_rootPath')

/**
 * 【node】获取所有根目录的路径
 */
function getPaths() {
    const paths = {
        ROOT_PATH,
    }
    const files = fs.readdirSync(ROOT_PATH)
    for (let file of files) {
        if (! _startsWith(file, '.')) {
            const fileKey = _toUpper(_snakeCase(file)) + '_PATH'
            const filePath = path.join(ROOT_PATH, file)
            paths[fileKey] = filePath
        }
    }
    return paths
}

module.exports = getPaths
