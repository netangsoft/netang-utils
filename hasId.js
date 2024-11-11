import $n_has from 'lodash-es/has.js'
import $n_isNumeric from './isNumeric.js'
import $n_isValidObject from './isValidObject.js'
import $n_isValidString from './isValidString.js'

/*
 * 是否是/含有 id
 */
export default function hasId(value = '', idKey = 'id', isString = false) {

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
