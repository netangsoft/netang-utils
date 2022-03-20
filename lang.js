const _toLower = require('lodash/toLower')
const _get = require('lodash/get')
const _assign = require('lodash/assign')

const isFillObject = require('./isFillObject')
const isFillString = require('./isFillString')

/**
 * 国际化设置
 */
const langSettings = {
    lists: [],
    package: require('./locale/zh-cn'),
}

/**
 * 翻译
 */
function trans(key, replace = null) {

    let str = _get(langSettings.package, _toLower(key), '')
    if (! str) {
        return key.substring(key.lastIndexOf('.') + 1)
    }

    if (isFillObject(replace)) {
        for (const key in replace) {
            const value = replace[key]
            if (isFillString(value)) {
                str = str.replace(':' + key, value)
            }
        }
    }

    return str
}

function settings(params) {
    _assign(langSettings, params)
}

module.exports = {
    langSettings,
    trans,
    settings,
}
