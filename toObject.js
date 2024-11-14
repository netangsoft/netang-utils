import $n_isValidObject from './isValidObject.js'

/**
 * 强转对象
 */
export default function toObject(value) {
    return $n_isValidObject(value) ? value : {}
}
