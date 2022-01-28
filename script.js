const getThrowMessage = require('./getThrowMessage')

// 默认设置
const _scriptSettings = {}

function has(object, key) {
    return object != null && Object.prototype.hasOwnProperty.call(object, key)
}

/**
 * 加载单个资源文件
 * @param {string} url 资源文件地址
 * @returns {Promise}
 */
function runScript(url) {

    return new Promise(function(resolve, reject) {

        if (typeof url !== 'string' || ! /^(http|https):/.test(url)) {
            reject('The resource url is incorrect')
            return;
        }

        const isCss = /\/.+\.css($|\?)/i.test(url)
        let script

        // 加载 css
        if (isCss) {

            if (document.querySelectorAll(`link[href="${url}"]`).length) {
                resolve()
                return
            }

            script = document.createElement('link')
            script.href = url
            script.rel = 'stylesheet'

            // 加载 js
        } else {

            if (document.querySelectorAll(`script[src="${url}"]`).length) {
                resolve()
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
                    resolve()
                }
            }

            // 其他浏览器
        } else {
            script.onload = function() {
                resolve()
            }
        }

        // 发生错误
        script.onerror = function() {
            // 删除节点
            $head.removeChild(script)
            reject(`[${url}] load failed`)
        }
    })
}

function runScripts(urls) {
    return new Promise(function(resolve, reject) {

        async function s(urls) {
            try {
                await runScript(urls[0])
                resolve()
            } catch (e) {
                urls.shift()

                if (! urls.length) {
                    reject(getThrowMessage(e))
                    return
                }

                s(urls).finally()
            }
        }
        s(urls).finally()
    })
}

/**
 * 加载资源文件
 * @param {array} urls
 * @returns {Promise}
 */
function script(urls) {

    return new Promise(function(resolve, reject) {

        const promises = []

        if (! Array.isArray(urls)) {
            urls = [urls]
        }

        for (let url of urls) {

            if (typeof url === 'string') {

                // 如果为 http url
                if (/^(http|https):/.test(url)) {
                    promises.push(runScript(url))
                    continue
                }

                // 否则为定义的参数
                url = has(_scriptSettings, url) ? _scriptSettings[url] : null
            }

            // 否则如果为对象
            if (typeof url === 'object' && has(url, 'urls') && Array.isArray(url.urls)) {

                if (! has(url, 'key') || ! has(window, url.key)) {

                    for (let item of url.urls) {
                        if (typeof item === 'string') {
                            promises.push(runScript(item))
                        } else if (Array.isArray(item) && item.length) {
                            promises.push(runScripts(item))
                        }
                    }
                }

                // 否则错误
            } else {
                reject('The resource url is incorrect')
                return
            }
        }

        if (! promises.length) {
            resolve()
            return
        }

        const windowDefine = has(window, 'define') ? window.define : null

        Promise.all(promises)
            .then(function() {
                resolve()
            })
            .catch(function(e) {
                reject(getThrowMessage(e))
            })
            .finally(function () {
                if (windowDefine !== null) {
                    window.define = windowDefine
                }
            })
    })
}

/**
 * 设置 script
 */
script.settings = function(options) {
    Object.assign(_scriptSettings, options)
}

module.exports = script
