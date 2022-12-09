const _isNil = require('lodash/isNil')
const forIn = require('./forIn')

/**
 * 移除对象中的 nil 值
 */
function removeObjectNil(target) {

    const obj = {}

    forIn(target, function(val, key) {
        if (! _isNil(val)) {
            obj[key] = val
        }
    })

    return obj
}

module.exports = removeObjectNil
