const webpackPromisify = require('../promisify/webpack')

/**
 * webpack 打包
 */

const webpackBuild = async (options) => {

    const promises = []

    for (const configs of options) {
        promises.push(webpackPromisify(configs))
    }

    await Promise.all(promises)
}

module.exports = webpackBuild
