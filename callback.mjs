import $n_run from './run'
import $n_isRequired from './isRequired'

/**
 * callback
 * 回调
 * @param data
 * @param {function} callback
 * @returns {any}
 */
export default function callback(data, callback) {
    return $n_run(callback)(data, $n_isRequired(data))
}
