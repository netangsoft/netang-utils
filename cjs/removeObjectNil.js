const $n_isNil = require('lodash/isNil')
const $n_forIn = require('./forIn')

/**
 * 移除对象中的 nil 值
 */
function removeObjectNil(target) {

    const obj = {}

    $n_forIn(target, function (val, key) {
        if (! $n_isNil(val)) {
            obj[key] = val
        }
    })

    return obj
}

module.exports = removeObjectNil