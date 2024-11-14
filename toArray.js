import $n_isValidArray from './isValidArray.js'

/**
 * 强转数组
 */
export default function toArray(value) {
    return $n_isValidArray(value) ? value : []
}
