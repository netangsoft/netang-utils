const _toLower = require('lodash/toLower')
const _get = require('lodash/get')

const isValidObject = require('./isValidObject')
const isValidString = require('./isValidString')

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

    if (isValidObject(replace)) {
        for (const key in replace) {
            const value = replace[key]
            if (isValidString(value)) {
                str = str.replace(':' + key, value)
            }
        }
    }

    return str
}

function settings(params) {
    Object.assign(langSettings, params)
}

module.exports = {
    langSettings,
    trans,
    settings,
}
