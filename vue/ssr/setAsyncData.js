/* #if IS_SERVER */
const $n_get = require('lodash/get')
const $n_has = require('lodash/has')
const $n_isBoolean = require('lodash/isBoolean')
const $n_isFunction = require('lodash/isFunction')
const $n_filter = require('lodash/filter')

const $n_isValidObject = require('../../cjs/isValidObject')
const $n_runAsync = require('../../cjs/runAsync')
const $n_numberDeep = require('../../cjs/numberDeep')
/* #endif */

const { stateSsrAsyncData } = require('../store')

// 【前端】
/* #if IS_WEB */
let isRendered = false
/* #endif */

/**
 * ssr 设置异步数据
 */
async function setAsyncData(params) {

    // 【前端】
    // --------------------------------------------------
    /* #if IS_WEB */
        if (isRendered) {
            stateSsrAsyncData.value = {
                data: null,
            }
        } else {
            isRendered = true
        }
    /* #endif */

    // 【后端】
    // --------------------------------------------------
    /* #if IS_SERVER */

        const {
            // 跳转路由
            to,
            // 默认 meta
            meta,
            // 渲染数据格式化
            format,
        } = params

        // 执行路由跳转的组件中的 asyncData 方法返回的数据
        const resAsyncData = $n_has(to, 'matched[0].components.default.asyncData') ? await $n_runAsync(to.matched[0].components.default.asyncData)({
            route: to,
            query: $n_isValidObject($n_get(to, 'query')) ? $n_numberDeep(to.query) : {},
            render: true,
        }) : {}

        const o = Object.assign({
            // 是否开启 ssr
            ssr: false,
            // 标题
            title: '',
            // 关键词
            keywords: '',
            // 描述
            description: '',
            // 初始数据
            data: null,
        }, meta)

        if ($n_isValidObject($n_get(to, 'meta'))) {

            // 获取 ssr
            o.ssr = $n_get(to.meta, 'ssr') === true

            // 合并路由 meta 数据
            Object.assign(o, $n_filter(to.meta, ['title', 'keywords', 'description']))

            // 如果有异步数据, 则合并异步数据
            if ($n_isValidObject(resAsyncData)) {
                // 合并异步数据
                Object.assign(o, $n_filter(resAsyncData, ['ssr', 'title', 'keywords', 'description']))

                if (
                    // 如果开启 ssr
                    o.ssr
                    // 如果异步数据有返回初始数据
                    && $n_isValidObject($n_get(resAsyncData, 'data'))
                    // 初始数据格式正确
                    && $n_isBoolean($n_get(resAsyncData.data, 'status')) && $n_has(resAsyncData.data, 'data')
                ) {
                    o.data = {
                        status: resAsyncData.data.status,
                        data: resAsyncData.data.data,
                    }
                }
            }
        }

        if ($n_isFunction(format)) {
            format(o)
        }

        stateSsrAsyncData.value = o
    /* #endif */
}

module.exports = setAsyncData
