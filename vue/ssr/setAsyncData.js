/* #if IS_SERVER */
import $n_get from 'lodash/get'
import $n_has from 'lodash/has'
import $n_isBoolean from 'lodash/isBoolean'
import $n_isFunction from 'lodash/isFunction'
import $n_pick from 'lodash/pick'

import $n_isValidObject from '../../isValidObject'
import $n_runAsync from '../../runAsync'
import $n_numberDeep from '../../numberDeep'
/* #endif */

import { stateSsrAsyncData } from '../store'

// 【前端】
/* #if IS_WEB */
let isRendered = false
/* #endif */

/**
 * ssr 设置异步数据
 */
export default async function setAsyncData(params) {

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
            Object.assign(o, $n_pick(to.meta, ['title', 'keywords', 'description']))

            // 如果开启 ssr
            // --------------------------------------------------
            if (o.ssr) {

                // 执行路由跳转的组件中的 asyncData 方法返回的数据
                let resAsyncData
                try {
                    let res = to.matched[0].components.default
                    if ($n_isFunction(res)) {
                        res = (await to.matched[0].components.default()).default
                    }

                    to.query = $n_isValidObject($n_get(to, 'query')) ? $n_numberDeep(to.query) : {}
                    to.params = $n_isValidObject($n_get(to, 'params')) ? $n_numberDeep(to.params) : {}

                    resAsyncData = await $n_runAsync(res.asyncData)({
                        route: to,
                        render: true,
                    })
                } catch (e) {
                    resAsyncData = {}
                }

                // 如果有异步数据, 则合并异步数据
                if ($n_isValidObject(resAsyncData)) {

                    // 合并异步数据
                    Object.assign(o, $n_pick(resAsyncData, ['ssr', 'title', 'keywords', 'description']))

                    if (
                        // 如果异步数据有返回初始数据
                        $n_isValidObject($n_get(resAsyncData, 'data'))
                        // 初始数据格式正确
                        && $n_isBoolean($n_get(resAsyncData.data, 'status'))
                        && $n_has(resAsyncData.data, 'data')
                    ) {
                        o.data = {
                            status: resAsyncData.data.status,
                            data: resAsyncData.data.data,
                        }
                    }
                }
            }
            // --------------------------------------------------
        }

        if ($n_isFunction(format)) {
            format(o)
        }

        stateSsrAsyncData.value = o
    /* #endif */
}
