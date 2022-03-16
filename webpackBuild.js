const { promisify } = require('util')
const webpack = require('webpack')
const webpackPromisify = promisify(webpack)
const webpackDevServer = require('webpack-dev-server-ssr')

async function webpackServerWatch(webpackConfig) {
    return await new Promise(function(resolve) {
        const compiler = webpack(webpackConfig)
        const server = new webpackDevServer(compiler, {
            // sockPort: configData.webPort,
            // port: configData.webPort,
            host: '0.0.0.0',
            stats: {
                // 添加资源信息
                assets: true,
                // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
                cachedAssets: false,
                // 添加 children 信息
                children: false,
                // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
                chunks: false,
                // 以不同颜色区分构建信息
                colors: true,
                // 添加构建模块信息
                modules: false,
                warnings: false,
                entrypoints: false
            },
            // 关闭 webpack-dev-server 自带的 server info 信息
            disableInfo: true,
            disableHostCheck: true,
            publicPath: '/',
            hotOnly: true,
            hot: true,
            https: false,
            clientLogLevel: 'error',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With,content-type,Authorization'
            }
        })
        compiler.hooks.done.tap('DonePlugin', resolve)
        // server.listen(configData.webPort)
    })
}

/**
 * 【node】webpack 打包
 */
const webpackBuild = async (options, callback) => {

    const promises = []

    for (const { watch, configs } of options) {
        if (watch === true) {
            promises.push(webpackServerWatch(configs))
        } else {
            promises.push(webpackPromisify(configs))
        }
    }

    await Promise.all(promises).finally(callback)
}

module.exports = webpackBuild
