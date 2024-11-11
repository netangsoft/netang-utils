import $n_isPlainObject from 'lodash-es/isPlainObject.js'

import _forEach from './.internal/_forEach.js'
import _forIn from './.internal/_forIn.js'

/**
 * each
 * @param data
 * @param func
 */
export default function each(data, func) {

    // 如果是数组
    if (Array.isArray(data)) {
        return _forEach(data, func, false)
    }

    // 如果是对象
    if ($n_isPlainObject(data)) {
        return _forIn(data, func)
    }
}
