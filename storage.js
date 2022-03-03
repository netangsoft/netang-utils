const isFillObject = require('./isFillObject')
const isFillString = require('./isFillString')
const toNumberDeep = require('./toNumberDeep')
const json = require('./json')

// storage 默认设置
const _storageSettings = {
    // 缓存前缀
    prefix: 'netang:',
    // 过期时间
    expires: 604800,
}

/**
 * 获取所有缓存 keys
 * @returns {object}
 */
function getStorageKeys() {

    let info = localStorage.getItem(getStoragePrefix('keys'))
    if (! _.isNil(info)) {

        info = json.parse(info)

        // 将已过期的缓存删除
        if (isFillObject(info)) {

            // 删除次数
            let delNum = 0

            // 当前时间戳(微秒)
            const nowTime = new Date().getTime()

            // 批量删除过期的缓存
            _.forEach(info, function(val, key) {
                if (
                    val > 0
                    && val <= nowTime
                ) {
                    delNum++
                    delete info[key]
                    localStorage.removeItem(key)
                }
            })

            // 更新 keys
            if (delNum > 0) {
                setStorageKeys(info)
            }

            return info
        }
    }

    return {}
}

/**
 * 保存所有缓存 keys
 * @param info
 */
function setStorageKeys(info) {
    localStorage.setItem(getStoragePrefix('keys'), json.stringify(info))
}

/**
 * 从所有缓存 keys 中删除单独 key
 * @param info
 * @param {string} key
 */
function deleteStorageKeys(info, key) {
    if (_.has(info, key)) {
        delete info[key]
        setStorageKeys(info)
    }
}

/**
 * 获取 storage 前缀
 */
function getStoragePrefix(key) {
    return _.get(_storageSettings, 'prefix', '') + key
}

/**
 * 获取 storage 过期时间
 * @param {number} expires 过期时间(默认:7天)
 * @returns {number}
 */
function getStorageExpires(expires) {
    return expires > 0 ? expires : (_storageSettings.expires || 0)
}

/**
 * 保存缓存
 * @param {string} key 键名
 * @param {any} value 值
 * @param {number} expires 过期时间
 */
function setStorage(key, value, expires = 0) {

    if (! isFillString(key) || _.isNil(value)) {
        return
    }

    // 获取 key
    key = getStoragePrefix(key)

    // 先获取所有缓存的 keys 信息
    const info = getStorageKeys()

    // 获取过期时间
    expires = getStorageExpires(expires)
    // 当前时间戳(秒)
    expires = expires > 0 ? new Date().getTime() + expires : 0
    if (
        ! _.has(info, key)
        || info[key] !== expires
    ) {
        info[key] = expires
        setStorageKeys(info)
    }

    // 更新缓存数据
    localStorage.setItem(key, json.stringify(value))
}

/**
 * 获取缓存
 * @param {string} key 键名
 * @param {any} defaultValue 默认值
 * @returns {any}
 */
function getStorage(key = '', defaultValue = null) {

    if (! isFillString(key)) {
        // 返回 null
        return defaultValue
    }

    // 获取 key
    key = getStoragePrefix(key)

    // 先获取所有缓存的 keys 信息
    const info = getStorageKeys()

    if (_.has(info, key)) {

        // 获取当前缓存
        let res = localStorage.getItem(key)
        if (! _.isNil(res)) {

            // 解析 json 数据
            res = json.parse(res)
            if (res !== null) {
                // 返回解析好的数据
                return toNumberDeep(res, defaultValue)
            }
        }

        // 否则数据不存在, 则删除当前缓存 key
        deleteStorageKeys(info, key)
    }

    // 返回 null
    return defaultValue
}

/**
 * 删除缓存
 * @param {string} key 键名
 */
function deleteStorage(key) {

    if (isFillString(key)) {

        // 获取 key
        key = getStoragePrefix(key)

        // 删除当前缓存
        localStorage.removeItem(key)

        // 删除缓存 key
        deleteStorageKeys(getStorageKeys(), key)
    }
}

/**
 * 删除所有缓存
 */
function flushStorage() {

    // 先获取所有缓存的 keys 信息
    const info = getStorageKeys()

    // 遍历并删除
    _.forEach(info, function(value, key) {
        localStorage.removeItem(key)
    })

    // 删除 keys 缓存
    localStorage.removeItem(getStoragePrefix('keys'))
}

/**
 * 仅更新缓存值(仅当缓存存在时有效)
 * @param {string} key 键名
 * @param {any} value 值
 */
function updateValueStorage(key, value)
{
    const expires = this.getTtl(key)
    if (expires > 0) {
        setStorage(key, value, expires)
    }
}

/**
 * 获取缓存剩余时间(秒)
 * @param {string} key 键名
 */
function getStorageTtl(key = '') {

    if (isFillString(key)) {

        // 获取 key
        key = getStoragePrefix(key)

        // 先获取所有缓存的 keys 信息
        const info = getStorageKeys()

        if (
            _.has(info, key)
            && info[key] > 0
        ) {
            const expires = info[key] - new Date().getTime() // 当前时间戳(微秒)
            if (expires > 0) {
                return expires
            }
        }

    }

    return 0
}

/**
 * 设置 storage
 */
function storageSettings(options) {
    _.assign(_storageSettings, options)
}

/**
 * storage
 */
const storage = {

    // 保存缓存
    set: setStorage,

    // 获取缓存
    get: getStorage,

    // 删除缓存
    delete: deleteStorage,

    // 删除所有缓存
    flush: flushStorage,

    // 仅更新缓存值(仅当缓存存在时有效)
    updateValue: updateValueStorage,

    // 获取缓存剩余时间(秒)
    getTtl: getStorageTtl,

    // 设置 storage
    settings: storageSettings,
}

module.exports = storage
