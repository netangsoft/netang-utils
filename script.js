import $n_getThrowMessage from './getThrowMessage.js'

function has(object, key) {
    return object != null && Object.prototype.hasOwnProperty.call(object, key)
}

function runScript(url) {

    return new Promise(function(resolve, reject) {

        if (typeof url !== 'string' || ! /^http(s)?:\/\//i.test(url)) {
            reject(`[${url}]格式不正确`)
            return;
        }

        const isCss = /\/.+\.css($|\?)/i.test(url)
        let script

        // 加载 css
        if (isCss) {

            if (document.querySelectorAll(`link[href="${url}"]`).length) {
                resolve(url)
                return
            }

            script = document.createElement('link')
            script.href = url
            script.rel = 'stylesheet'

        // 加载 js
        } else {

            if (document.querySelectorAll(`script[src="${url}"]`).length) {
                resolve(url)
                return
            }

            script = document.createElement('script')
            script.src = url
        }

        // head 头部追加
        const $head = document.querySelector('head')
        $head.insertBefore(script, $head.childNodes[0])

        // IE
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    resolve(url)
                }
            }

        // 其他浏览器
        } else {
            script.onload = function() {
                resolve(url)
            }
        }

        // 发生错误
        script.onerror = function() {
            // 删除节点
            $head.removeChild(script)
            reject(`[${url}]加载失败`)
        }
    })
}

function runScripts(urls) {
    return new Promise( async function(resolve, reject) {

        async function run(urls) {
            try {
                resolve(await runScript(urls[0]))

            } catch (e) {
                await urls.shift()

                if (! urls.length) {

                    reject($n_getThrowMessage(e))
                    return
                }

                await run(urls)
            }
        }

        await run(urls)
    })
}

/**
 * 加载资源文件
 * @param {array} urls
 * @returns {Promise}
 */
export default function script(urls) {
    return new Promise(function(resolve, reject) {

        function fail() {
            reject('资源地址格式不正确')
        }

        if (! Array.isArray(urls)) {
            fail()
            return
        }

        const promises = []

        for (const url of urls) {

            // 如果为数组
            if (Array.isArray(url)) {
                promises.push(runScripts(url))

            // 如果为对象
            } else if (typeof url === 'object') {
                if (
                    has(url, 'urls')
                    && has(url, 'key')
                    && !! url.key
                    && Array.isArray(url.urls)
                ) {
                    if (! has(window, url.key)) {
                        const _urls = []
                        for (const item of url.urls) {
                            if (typeof item === 'string') {
                                _urls.push(item)
                            } else if (Array.isArray(item) && item.length) {
                                promises.push(runScripts(item))
                            }
                        }
                        if (_urls.length) {
                            promises.push(runScripts(_urls))
                        }
                    }
                } else {
                    fail()
                    return
                }

            // 如果为字符串
            } else if (typeof url === 'string') {
                promises.push(runScript(url))

            // 否则错误
            } else {
                fail()
                return
            }
        }

        if (! promises.length) {
            resolve()
            return
        }

        // const windowDefine = has(window, 'define') ? window.define : null

        Promise.all(promises)
            .then(resolve)
            .catch(function(e) {
                reject($n_getThrowMessage(e))
            })
            // .finally(function () {
            //     if (windowDefine !== null) {
            //         window.define = windowDefine
            //     }
            // })
    })
}
