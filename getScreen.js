import $n_isBrowser from './isBrowser'

/**
 * 获取屏幕宽高【即将废弃】
 */
export default function getScreen() {
    if ($n_isBrowser()) {
        return {
            width: document.documentElement.clientWidth || document.body.clientWidth,
            height: document.documentElement.clientHeight || document.body.clientHeight,
        }
    }
    return {
        width: 0,
        height: 0,
    }
}
