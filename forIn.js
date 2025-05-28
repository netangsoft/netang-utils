import $n_isPlainObject from 'lodash/isPlainObject'

import _forIn from './.internal/_forIn'

/**
 * forIn
 * @param data
 * @param func
 */
export default function forIn(data, func) {
    // 如果是对象
    if ($n_isPlainObject(data)) {
        return _forIn(data, func)
    }
}
