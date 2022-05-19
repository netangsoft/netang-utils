const _isPlainObject = require('lodash/isPlainObject')

/**
 * 获取对象第一个元素
 * @param value
 * @param defaultValue 默认值
 * @returns {null|*}
 */
function getObjectHead(value, defaultValue = null) {

    if (_isPlainObject(value)) {

        for (const key in value) {

            if (Object.prototype.hasOwnProperty.call(value, key)) {

                return value[key]
            }
        }
    }

    return defaultValue
}

module.exports = getObjectHead
