import $n_isBrowser from './isBrowser'
import $n_isValidString from './isValidString'

/**
 * 跳转
 * @param {string} url
 * @param {boolean} replace
 */
export default function jump(url, replace = false) {

    if (
        // 如果不在浏览器中
        ! $n_isBrowser()
        // 如果 url 为非有效值
        || ! $n_isValidString(url)
    ) {
        return
    }

    // 刷新当前页
    if (url === 'reload') {
        window.location.reload()
        return
    }

    if (replace === true) {
        window.location.replace(url)

    } else {
        window.location.href = url
    }
}
