const getThrowMessage = require('./getThrowMessage')


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
            reject('资源地址不正确3')
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
            reject(`[${url}]加载失败`)
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

        if (! Array.isArray(urls)) {
            reject('资源地址不正确1')
            return
        }

        const promises = []

        for (let url of urls) {

            // 如果为字符串
            if (typeof url === 'string') {
                promises.push(runScript(url))

            // 否则如果为对象
            } else if (typeof url === 'object' && has(url, 'urls') && Array.isArray(url.urls)) {

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
                reject('资源地址不正确2')
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

module.exports = script
