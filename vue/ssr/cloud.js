import qs from 'qs'

import $n_trimStart from 'lodash/trimStart'

import $n_slash from '../../slash'
import $n_isValidObject from '../../isValidObject'
import $n_runAsync from '../../runAsync'

import ssrRender from './render'

/* #if IS_PRO */
const manifest = __HTML_MANIFEST__
/* #endif */

/**
 * ssr 云函数
 */
export default function cloud(render) {
    return async function({ path, queryStringParameters }, { FUNCTION_NAME }) {

        // 获取当前地址
        let url = $n_slash($n_trimStart($n_slash(path, 'start', true), '/' + FUNCTION_NAME), 'start', true)
        if ($n_isValidObject(queryStringParameters)) {
            url += '?' + qs.stringify(queryStringParameters)
        }

        return {
            mpserverlessComposedResponse: true,
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html;charset=utf-8',
            },
            body: await ssrRender(Object.assign(
                await $n_runAsync(render)({
                    url,
                }),
                {
                    manifest,
                }
            )),
        }
    }
}
