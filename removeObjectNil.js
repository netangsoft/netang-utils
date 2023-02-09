import $n_isNil from 'lodash/isNil'
import $n_forIn from './forIn'

/**
 * 移除对象中的 nil 值
 */
export default function removeObjectNil(target) {

    const obj = {}

    $n_forIn(target, function(val, key) {
        if (! $n_isNil(val)) {
            obj[key] = val
        }
    })

    return obj
}
