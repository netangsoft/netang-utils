const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const ROOT_PATH = require('./_rootPath')

/**
 * 【node】获取所有根目录的路径
 */
function getPaths() {
    const paths = {
        ROOT_PATH,
    }
    const pathsInfo = {}
    const files = fs.readdirSync(ROOT_PATH)
    for (let file of files) {
        if (! _.startsWith(file, '.')) {
            const fileKey = _.toUpper(_.snakeCase(file)) + '_PATH'
            const filePath = path.join(ROOT_PATH, file)
            paths[fileKey] = filePath
            pathsInfo[fileKey] = {
                name: file,
                path: filePath,
            }
        }
    }

    return {
        paths,
        pathsInfo,
    }
}

module.exports = getPaths
