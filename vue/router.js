import { createRouter as vueCreateRouter, createWebHistory, createWebHashHistory, createMemoryHistory, useRoute } from 'vue-router'
import _find from 'lodash/find'
import _isNil from 'lodash/isNil'
import _isFunction from 'lodash/isFunction'
import _has from 'lodash/has'
import _get from 'lodash/get'
import _isString from 'lodash/isString'

import $n_slash from '../slash'
import $n_isValidObject from '../isValidObject'
import $n_isValidString from '../isValidString'
import $n_numberDeep from '../numberDeep'
import $n_url from '../url'

/**
 * 创建路由
 */
let $router = null
export function createRouter(params) {
    // 路由模式
    if (! _has(params, 'history')) {
        const createHistory = IS_SERVER ?
            createMemoryHistory
            : (
                IS_ROUTER_HISTORY ?
                    createWebHistory
                    : createWebHashHistory
            )

        params.history = createHistory('__VUE_ROUTER_BASE__')
    }
    $router = vueCreateRouter(params)
    return $router
}

/**
 * 获取参数
 */
function getOptions(options) {

    // 如果不是有效对象
    if (! $n_isValidObject(options)) {
        // 则无任何操作
        return false
    }

    const o = Object.assign({
        parse: true,
    }, options)

    // 如果存在 path
    if (_has(o, 'path')) {

        if (/^javascript/.test(o.path)) {
            return false
        }

        // 如果为网址
        let urls
        if (/^http(s)?:\/\//.test(o.path)) {

            // 解构地址
            const urls = $n_url(o.path)

            // 如果为站外地址, 则返回完整路径
            if ($n_url().host !== urls.host) {
                return o.path
            }

        // 如果有参数
        } else {
            // 路径开头加上反斜杠
            o.path = $n_slash(o.path, 'start')

            // 解构地址
            urls = $n_url('http://x.com' + o.path, o.parse)
        }

        // 解构地址
        const {
            hash,
            pathname,
            query,
        } = urls

        // 获取 path
        o.path = $n_slash(pathname, 'start', true)

        // 获取 query
        if ($n_isValidObject(query)) {
            o.query = Object.assign({}, query, o.query)
        }

        // 获取 hash
        if ($n_isValidString(hash)) {
            o.hash = '#' + hash
        }
    }

    delete o.parse

    return o
}

/**
 * 返回路由地址的标准化版本
 */
function resolve(options, isFormat = true) {

    // 格式化路由参数
    if (isFormat) {
        options = getOptions(options)
    }

    if (! $n_isValidObject(options)) {
        if (_isString(options)) {
            throw new Error('该路由不存在')
        }
        throw new Error('路由参数必须是 object 格式')
    }

    const res = $router.resolve(options)

    if (
        ! $n_isValidObject(res)
        || res.name === 'error'
    ) {
        throw new Error('该路由不存在')
    }

    const length = res.matched.length
    if (! length) {
        throw new Error('没有找到匹配的路由配置')
    }

    // 获取当前匹配的路由配置
    const route = length === 1 ? res.matched[0] : _find(res.matched, { path: res.path })
    if (! $n_isValidObject(route)) {
        throw new Error('没有找到匹配的路由配置')
    }

    // 如果有重定向
    if (_has(route, 'redirect')) {

        // 如果重定向配置为对象
        if ($n_isValidObject(route.redirect)) {
            return resolve(Object.assign(options, route.redirect), false)

        // 如果重定向配置为方法
        } else if (_isFunction(route.redirect)) {
            return resolve(Object.assign(options, route.redirect(options)), false)
        }
    }

    // 如果有传值
    if (_has(res, 'query')) {
        res.query = $n_numberDeep(res.query)
    }

    res.route = route

    return res
}

/**
 * push 路由
 */
function push(options) {
    const opt = getOptions(options)
    if (opt) {
        $router.push(opt)
    }
}

/**
 * pop 路由
 */
function pop() {
    $router.go(-1)
}

/**
 * replace 路由
 */
function replace(options) {
    const opt = getOptions(options)
    if (opt) {
        $router.replace(opt)
    }
}

/**
 * 获取路由
 */
function getRoute($route = null, path = '', defaultValue = '') {

    // 如果没定义路由
    if (_isNil($route)) {
        // 路由为当前路由
        // $route = useRoute()
        $route = $router.currentRoute.value

    // 如果第一个参数是字符串
    } else if ($n_isValidString($route)) {

        // 第二个参数是默认值
        defaultValue = path
        // 第一个参数是路径
        path = $route
        // 路由为当前路由
        // $route = useRoute()
        $route = $router.currentRoute.value
    }

    // 如果有路由参数
    if ($n_isValidObject($route.query)) {
        // 格式化路由参数
        $n_numberDeep($route.query)
    }

    if (path) {
        return _get($route, path, defaultValue)
    }

    return $route
}

const router = {
    push,
    pop,
    replace,
    resolve,
    // 获取当前路由
    getRoute,
}

export default router
