import $n_isNil from 'lodash/isNil'
import $n_has from 'lodash/has'
import $n_isValidObject from './isValidObject'
import $n_isValidString from './isValidString'
import $n_numberDeep from './numberDeep'
import $n_forIn from './forIn'
import $n_json from './json'

import { storageOptions as o } from './settings'

/**
 * 获取 storage 前缀
 */
function getStoragePrefix(key) {
    return o.prefix + key
}

/**
 * 获取所有缓存 keys
 * @returns {object}
 */
function getStorageKeys() {

    let info = o.get(getStoragePrefix('keys'))
    if (! $n_isNil(info)) {

        info = $n_json.parse(info)

        // 将已过期的缓存删除
        if ($n_isValidObject(info)) {

            // 删除次数
            let delNum = 0

            // 当前时间戳(微秒)
            const nowTime = Date.now()

            // 批量删除过期的缓存
            $n_forIn(info, function(val, key) {
                if (
                    val > 0
                    && val <= nowTime
                ) {
                    delNum++
                    delete info[key]
                    o.delete(key)
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
    o.set(getStoragePrefix('keys'), $n_json.stringify(info))
}

/**
 * 从所有缓存 keys 中删除单独 key
 * @param info
 * @param {string} key
 */
function deleteStorageKeys(info, key) {
    if ($n_has(info, key)) {
        delete info[key]
        setStorageKeys(info)
    }
}

/**
 * 保存缓存
 * @param {string} key 键名
 * @param {any} value 值
 * @param {number|null} expires 过期时间
 */
function setStorage(key, value, expires = null) {

    if (! $n_isValidString(key) || $n_isNil(value)) {
        return
    }

    // 获取 key
    key = getStoragePrefix(key)

    // 先获取所有缓存的 keys 信息
    const info = getStorageKeys()

    // 获取过期时间
    if ($n_isNil(expires)) {
        expires = o.expires
    }
    expires = expires > 0 ? Date.now() + expires : 0
    if (
        ! $n_has(info, key)
        || info[key] !== expires
    ) {
        info[key] = expires
        setStorageKeys(info)
    }

    // 更新缓存数据
    o.set(key, $n_json.stringify(value))
}

/**
 * 获取缓存
 * @param {string} key 键名
 * @param {any} defaultValue 默认值
 * @returns {any}
 */
function getStorage(key = '', defaultValue = null) {

    if (! $n_isValidString(key)) {
        // 返回 null
        return defaultValue
    }

    // 获取 key
    key = getStoragePrefix(key)

    // 先获取所有缓存的 keys 信息
    const info = getStorageKeys()

    if ($n_has(info, key)) {

        // 获取当前缓存
        let res = o.get(key)
        if (! $n_isNil(res)) {

            // 解析 json 数据
            res = $n_json.parse(res)
            if (res !== null) {
                // 返回解析好的数据
                return $n_numberDeep(res)
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

    if ($n_isValidString(key)) {

        // 获取 key
        key = getStoragePrefix(key)

        // 删除当前缓存
        o.delete(key)

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
    $n_forIn(info, function(value, key) {
        o.delete(key)
    })

    // 删除 keys 缓存
    o.delete(getStoragePrefix('keys'))
}

/**
 * 仅更新缓存值(仅当缓存存在时有效)
 * @param {string} key 键名
 * @param {any} value 值
 */
function updateValueStorage(key, value)
{
    const expires = getStorageTtl(key)
    if (expires > 0) {
        setStorage(key, value, expires)
    }
}

/**
 * 获取缓存剩余时间(秒)
 * @param {string} key 键名
 */
function getStorageTtl(key = '') {

    if ($n_isValidString(key)) {

        // 获取 key
        key = getStoragePrefix(key)

        // 先获取所有缓存的 keys 信息
        const info = getStorageKeys()

        if (
            $n_has(info, key)
            && info[key] > 0
        ) {
            const expires = info[key] - Date.now() // 当前时间戳(微秒)
            if (expires > 0) {
                return expires
            }
        }

    }

    return 0
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
}

export default storage
