import $n_has from 'lodash/has.js'

import $n_runAsync from './runAsync.js'

/**
 * switch function
 */
export default function switcher(key, obj) {

    if ($n_has(obj, key)) {
        return $n_runAsync(obj[key])()
    }

    if ($n_has(obj, 'default')) {
        return $n_runAsync(obj.default)()
    }
}
