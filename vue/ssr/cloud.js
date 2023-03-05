const qs = require('qs')

const $n_trimStart = require('lodash/trimStart')

const $n_slash = require('../../cjs/slash')
const $n_isValidObject = require('../../cjs/isValidObject')
const $n_runAsync = require('../../cjs/runAsync')

const ssrRender  = require('./render')

/* #if IS_PRO */
const manifest = __HTML_MANIFEST__
/* #endif */

/**
 * ssr 云函数
 */
function cloud(render) {
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

module.exports = cloud
