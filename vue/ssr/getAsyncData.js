import { useRoute } from 'vue-router'

import $n_has from 'lodash/has'
import $n_get from 'lodash/get'

import $n_isValidObject from '../../cjs/isValidObject'
import $n_runAsync from '../../cjs/runAsync'
import $n_numberDeep from '../../cjs/numberDeep'

import getInitData from './getInitData'

/**
 * ssr 获取异步数据
 */
export default async function() {

    // 获取初始数据
    const initData = getInitData()
    if (initData !== false) {
        return initData
    }

    // 获取当前路由
    const route = useRoute()

    // 执行路由跳转的组件中的 asyncData 方法返回的数据
    if ($n_has(route, 'matched[0].components.default.asyncData')) {

        const {
            data
        } = await $n_runAsync(route.matched[0].components.default.asyncData)({
            route,
            query: $n_isValidObject($n_get(route, 'query')) ? $n_numberDeep(route.query) : {},
            render: false,
        })

        if ($n_isValidObject(data)) {
            return data
        }

        /* #if IS_DEV && IS_WEB */
        throw new Error('asyncData 返回数据错误')
        /* #endif */
    }

    /* #if IS_DEV && IS_WEB */
    throw new Error('没有找到 asyncData 方法')
    /* #endif */
}
