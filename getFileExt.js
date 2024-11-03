import $n_isValidString from './isValidString.js'

/**
 * 获取后缀
 */
export default function getFileExt(fileName, separator = '.') {
    if ($n_isValidString(fileName)) {
        const index = fileName.lastIndexOf(separator)
        if (index > -1) {
            return fileName.substring(index + 1)
        }
    }
    return ''
}
