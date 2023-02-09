import $n_toLower from 'lodash/toLower'
import $n_get from 'lodash/get'

import $n_isValidObject from './isValidObject'
import $n_isValidString from './isValidString'

import zhCn from './locale/zh-cn'

/**
 * 国际化设置
 */
export const langSettings = {
    lists: [],
    package: zhCn,
}

/**
 * 设置
 * @param params
 */
export function settings(params) {
    Object.assign(langSettings, params)
}

/**
 * 翻译
 */
export default function trans(key, replace = null) {

    let str = $n_get(langSettings.package, $n_toLower(key), '')
    if (! str) {
        return key.substring(key.lastIndexOf('.') + 1)
    }

    if ($n_isValidObject(replace)) {
        for (const key in replace) {
            const value = replace[key]
            if ($n_isValidString(value)) {
                str = str.replace(':' + key, value)
            }
        }
    }

    return str
}
