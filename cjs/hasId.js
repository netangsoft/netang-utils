const $n_has = require('lodash/has')
const $n_isNumeric = require('./isNumeric')
const $n_isValidObject = require('./isValidObject')
const $n_isValidString = require('./isValidString')

/*
 * 是否是/含有 id
 */
function hasId(value = '', idKey = 'id', isString = false) {

    if (! isString) {

        if ($n_isNumeric(value)) {
            return Number(value) > 0
        }

        return $n_isValidObject(value)
            && $n_has(value, idKey)
            && $n_isNumeric(value[idKey])
            && Number(value[idKey]) > 0
    }

    return $n_isValidString(value)
        || (
            $n_isValidObject(value)
            && $n_has(value, idKey)
            && $n_isValidString(value[idKey])
        )
}

module.exports = hasId