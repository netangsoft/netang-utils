const $n_isValidString = require('./isValidString')

/**
 * 获取后缀
 */
function getFileExt(fileName, separator = '.') {
    if ($n_isValidString(fileName)) {
        const index = fileName.lastIndexOf(separator)
        if (index > -1) {
            return fileName.substring(index + 1)
        }
    }
    return ''
}

module.exports = getFileExt