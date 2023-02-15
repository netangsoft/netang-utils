const $n_isPlainObject = require('lodash/isPlainObject')

/**
 * 检查是否为非空对象
 * @param value
 * @returns {boolean}
 */
function isValidObject(value) {

    if ($n_isPlainObject(value)) {

        for (const key in value) {

            if (Object.prototype.hasOwnProperty.call(value, key)) {

                return true
            }
        }
    }

    return false
}

module.exports = isValidObject