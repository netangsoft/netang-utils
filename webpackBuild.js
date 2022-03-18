const { promisify } = require('util')
const webpack = require('webpack')
const webpackPromisify = promisify(webpack)

/**
 * 【node】webpack 打包
 */

const webpackBuild = async (options) => {

    const promises = []

    for (const configs of options) {
        promises.push(webpackPromisify(configs))
    }

    await Promise.all(promises)
}

module.exports = webpackBuild
