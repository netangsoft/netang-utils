const isFillString = require('./isFillString')

/**
 * 获取后缀
 */
function getExt(fileName, separator = '.') {
    if (isFillString(fileName)) {
        const index = fileName.lastIndexOf(separator)
        if (index > -1) {
            return fileName.substring(index + 1)
        }
    }
    return ''
}

module.exports = getExt
