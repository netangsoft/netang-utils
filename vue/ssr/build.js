const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const Service = require('@vue/cli-service/lib/Service')
const { defineConfig } = require('@vue/cli-service')

const rootPath = require('../../node/rootPath')
const env = require('../../node/getEnv')()
const readdirSync = require('../../node/readdirSync')
const getFileHashNameSync = require('../../node/getFileHashNameSync')
const removeSync = require('../../node/removeSync')
const replaceLoader = require.resolve('../../node/loader/webpack.replace.loader.js')

const $n_get = require('lodash/get')
const $n_has = require('lodash/has')
const $n_isFunction = require('lodash/isFunction')
const $n_merge = require('lodash/merge')

const $n_forEach = require('../../cjs/forEach')
const $n_forIn = require('../../cjs/forIn')
const $n_join = require('../../cjs/join')
const $n_sortAsc = require('../../cjs/sortAsc')
const $n_isValidString = require('../../cjs/isValidString')
const $n_getFileExt = require('../../cjs/getFileExt')

let WebpackManifestPlugin = null

/**
 * 获取 html 模板变量
 */
function getHtmlDefine({ lang, meta, css, js, script }) {

    // 【meta】
    // ------------------------------
    let __HTML_META__ = ''
    let hasCharset = false
    let hasViewport = false
    $n_forEach(meta, function(item) {
        const metas = []
        $n_forIn(item, function(value, key) {
            metas.push(`${key}="${value}"`)
            if (! hasCharset && key === 'charset') {
                hasCharset = true
            }
            if (! hasViewport && value === 'viewport') {
                hasViewport = true
            }
        })
        if (metas.length) {
            __HTML_META__ += `<meta ${$n_join(metas, ' ')}>`
        }
    })
    if (! hasViewport) {
        __HTML_META__ = `<meta name="viewport" content="width=device-width,initial-scale=1.0">` + __HTML_META__
    }
    if (! hasCharset) {
        __HTML_META__ = `<meta charset="utf-8">` + __HTML_META__
    }

    // 【css】
    // ------------------------------
    let __HTML_CSS__ = ''
    $n_forEach(css, function(item) {
        __HTML_CSS__ += `<link href="${item}" rel="stylesheet">`
    })

    // 【js】
    // ------------------------------
    let __HTML_JS__ = ''
    $n_forEach(js, function(item) {
        __HTML_JS__ += `<script src="${item}" defer="defer"></script>`
    })

    // 【script】
    // ------------------------------
    let __HTML_SCRIPT__ = ''
    if ($n_isValidString(script)) {
        __HTML_SCRIPT__ = script
    }

    return {
        __HTML_LANG__: lang,
        __HTML_META__,
        __HTML_CSS__,
        __HTML_JS__,
        __HTML_SCRIPT__,
    }
}

/**
 * 服务编译
 */
async function build(params) {

    const o = $n_merge({
        // 入口
        entry: path.join(rootPath, 'src/main.js'),
        // 是否开启 ssr
        ssr: false,
        // 开启后端监听
        nodemon: true,
        // 新环境变量
        env: null,
        // 替换全局变量
        replaceDefine: null,
        // 加载器
        includeLoader: null,
        // 公共配置
        common: {},
        // 前端配置
        web: {
            // 开发服务
            devServer: {
                port: '58809',
            },
        },
        // 后端配置
        server: {
            // 开发服务
            devServer: {
                port: '58808',
            },
        },
        // html 模板
        html: {
            lang: 'en',
            meta: [],
            css: [],
            js: [],
            script: '',
        },
    }, params)

    // 前端打包路径
    if (! $n_get(o.web, 'outputDir')) {
        o.web.outputDir = o.ssr ? path.join(rootPath, 'dist/web') : path.join(rootPath, 'dist')
    }

    // 后端打包路径
    if (! $n_get(o.server, 'outputDir')) {
        o.server.outputDir = path.join(rootPath, 'dist/server')
    }

    // 获取模板替换变量
    const replaceDefine = Object.assign(getHtmlDefine(o.html), {
        // 前端端口
        __WEB_PORT__: o.web.devServer.port,
        // 后端端口
        __SERVER_PORT__: o.server.devServer.port,
    })

    /**
     * 获取配置
     */
    function getConfig(server, defineEnv) {

        // 发布地址
        const publicPath = server ? o.server.publicPath : o.web.publicPath

        // 全局模板变量
        const newReplaceDefine = Object.assign({
            // vuy 路由基础路径
            __VUE_ROUTER_BASE__: publicPath,
        }, replaceDefine, $n_isFunction(o.replaceDefine) ? o.replaceDefine(server) : {})

        // 新环境变量
        const newEnv = Object.assign({
            // 路由是否 history 类型
            IS_ROUTER_HISTORY: true,
        }, env, $n_isFunction(o.env) ? o.env(server) : {}, {
            // 是否开启 ssr
            IS_SSR: o.ssr,
            // 前端
            IS_WEB: ! server,
            // 后端
            IS_SERVER: server,
        })

        // 配置
        const config = $n_merge({
            // 依赖关系
            // https://cli.vuejs.org/zh/config/#runtimecompiler
            transpileDependencies: [
                '@netang/utils',
                '@netang/quasar',
            ],

            // 生产源地图
            productionSourceMap: env.IS_DEV,

            // 开发服务
            devServer: {},

            // webpack 配置
            configureWebpack: {
                // 生成文件
                output: {},
                // 插件
                plugins: [],
            },
        }, o.common, server ? o.server : o.web)

        // 如果开启 ssr
        if (o.ssr) {
            $n_merge(config, {
                pages: {
                    index: {
                        // 入口
                        entry: o.entry,
                    },
                },
            })
        }

        // 如果是后端
        if (server) {

            // 生成 js 文件名
            config.configureWebpack.output.filename = '[name].js'
            config.configureWebpack.output.chunkFilename = '[name].js'

            // 开启 node
            config.configureWebpack.target = 'node'

            // 如果是开发模式
            if (env.IS_DEV) {
                // 打包路径
                config.outputDir = path.join(rootPath, 'build/server')
            }

        // 否则为前端
        } else {

            // 如果开启 ssr
            if (o.ssr) {
                if (! WebpackManifestPlugin) {
                    WebpackManifestPlugin = require('webpack-manifest-plugin').WebpackManifestPlugin
                }
                // 生成资源清单
                config.configureWebpack.plugins.push(new WebpackManifestPlugin({
                    fileName: 'manifest.json',
                }))
            }

            // 如果是开发模式
            if (env.IS_DEV) {

                // 打包路径
                config.outputDir = path.join(rootPath, 'build/web')

                // 开发服务
                config.devServer.host = '0.0.0.0'
                config.devServer.headers = {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
                    'Access-Control-Allow-Headers': 'X-Requested-With,content-type,Authorization',
                }
            }
        }

        // 用户 webpack 配置
        const userChainWebpack = $n_has(config, 'chainWebpack') ? config.chainWebpack : ()=>{}

        // 修改 webpack 配置参数
        config.chainWebpack = function(chain) {

            // 定义环境变量
            chain.plugin('netang-env')
                .use(webpack.DefinePlugin, [
                    Object.assign({}, newEnv, defineEnv)
                ])

            // 条件编译 .vue 文件
            chain.module
                .rule('vue')
                .use(replaceLoader)
                .loader(replaceLoader)
                .options({
                    env: newEnv,
                    replace: newReplaceDefine,
                    includeLoader: o.includeLoader,
                })
                .end()

            // 条件编译 .js 文件
            chain.module
                .rule('js')
                .use(replaceLoader)
                .loader(replaceLoader)
                .options({
                    env: newEnv,
                    replace: newReplaceDefine,
                    includeLoader: o.includeLoader,
                })
                .end()

            // 如果为前端
            if (! server) {

                const htmlFiles = {}

                // 修改复制文件
                chain.plugin('copy')
                    .tap((args) => {

                        const first = args[0].patterns[0]

                        const {
                            from,
                            to,
                        } = first

                        first.globOptions.ignore.push('**/*')

                        const files = readdirSync(from)
                        for (const file of files) {
                            if (file.isFile && file.fileName !== 'index.html') {
                                const lastIndex = file.relativePath.lastIndexOf('.')
                                const newRelativePath = lastIndex > -1
                                    ? `${file.relativePath.substring(0, lastIndex)}.${getFileHashNameSync(file.filePath)}.${file.relativePath.substring(lastIndex + 1)}`
                                    : `${file.relativePath}.${getFileHashNameSync(file.filePath)}`

                                htmlFiles[file.fileName] = `${publicPath}${newRelativePath}`

                                args[0].patterns.push({
                                    from: file.filePath,
                                    to: path.join(to, newRelativePath),
                                })
                            }
                        }

                        return args
                    })

                // 添加 html 复制文件映射参数
                chain.plugin('html')
                    .tap((args) => {
                        // 复制文件映射
                        args[0].files = htmlFiles
                        return args
                    })

            // 否则是后端
            } else if (env.IS_PRO) {

                // 修改下列规则
                const rules = ['css', 'postcss', 'scss', 'sass', 'less', 'stylus']
                const oneOfs = ['vue-modules', 'vue', 'normal-modules', 'normal']
                $n_forEach(rules, function(rule) {
                    $n_forEach(oneOfs, function(oneOf) {
                        chain.module
                            .rule(rule)
                            .oneOf(oneOf)
                            .use('extract-css-loader')
                            .tap(function(options) {
                                options.emit = false
                                return options
                            })
                    })
                })
            }

            // 用户 webpack 配置
            userChainWebpack(chain, newEnv, server)
        }

        return config
    }

    /**
     * 开启服务
     */
    function service(server, config) {

        // 构建模式
        let name = 'build'

        // 是否观察模式
        let watch = false

        // 如果是后端
        if (server) {
            // 如果是开发模式
            if (env.IS_DEV) {
                // 设为观察模式
                watch = true
            }

        // 否则为前端
        } else {
            // 如果是开发模式
            if (env.IS_DEV) {
                // 观察编译模式
                name = 'serve'
            }
        }

        // 开始 vue 构建服务
        return new Service(rootPath, {
            // webpack 配置
            inlineOptions: defineConfig(config)
        }).run(
            name,
            {
                _: [name],
                modern: false,
                report: false,
                'report-json': false,
                'inline-vue': false,
                watch,
                open: false,
                copy: false,
                https: false,
                verbose: false,
            },
            [name]
        )
    }

    // 如果是开发模式
    // ------------------------------
    if (o.ssr && env.IS_DEV) {
        const webConfig = getConfig(false)
        await Promise.all([
            // 编译前端
            service(false, webConfig),
            // 编译后端
            service(true, getConfig(true)),
        ])
            .finally(()=>{
                if (o.nodemon) {
                    require('nodemon')({
                        watch: path.join(rootPath, 'build/server'),
                        script: path.join(rootPath, 'build/server/index.js')
                    })
                }
            })

        return {
            options: o,
            webConfig,
        }
    }

    // 否则是生产模式 || 非 ssr 模式
    // ------------------------------
    // 编译前端
    console.log('\n------编译前端')
    const webConfig = getConfig(false)
    await service(false, webConfig)

    const result = {
        options: o,
        webConfig,
    }

    // 如果开启 ssr
    if (o.ssr) {

        // 读取 index.html 内容
        const html = fs.readFileSync(path.join(webConfig.outputDir, 'index.html'), 'utf-8')

        // 读取 manifest.json
        const manifestJson = require(path.join(webConfig.outputDir, 'manifest.json'))

        // 生成 json 内容
        const json = {
            // ico
            ico: '',
            // css
            css: '',
            // js
            js: '',
        }

        // 如果有 ico
        if ($n_has(manifestJson, 'favicon.ico')) {
            json.ico = `<link href="${manifestJson['favicon.ico']}" rel="icon">`
        }

        const css = []
        const js = []
        $n_forIn(manifestJson, function(url, fileName) {
            const index = html.indexOf(url)
            if (index > -1) {
                const pos = fileName.lastIndexOf('.')
                if (pos > -1) {
                    const suffix = fileName.substring(pos)
                    if (suffix === '.css') {
                        css.push({
                            index,
                            url,
                        })
                    } else if (suffix === '.js') {
                        js.push({
                            index,
                            url,
                        })
                    }
                }
            }
        })

        // 获取 css
        $n_forEach($n_sortAsc(css, 'index'), function({ url }) {
            json.css += `<link href="${url}" rel="stylesheet">`
        })

        // 获取 js
        $n_forEach($n_sortAsc(js, 'index'), function({ url }) {
            json.js += `<script src="${url}" defer="defer"></script>`
        })

        // 编译后端
        console.log('\n------编译后端')
        const serverConfig = getConfig(true, {
            // 设置资源清单环境变量
            __HTML_MANIFEST__: JSON.stringify(json),
        })
        await service(true, serverConfig)

        // 删除非 js 文件
        const files = readdirSync(serverConfig.outputDir, { order: 'desc' })
        for (const file of files) {
            const ext = $n_getFileExt(file.fileName)
            if (ext !== 'js' || ext !== 'file') {
                removeSync(file.filePath)
            }
        }

        result.serverConfig = serverConfig
    }

    return result
}

module.exports = build
