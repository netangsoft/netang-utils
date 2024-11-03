import loaderUtils from './loaderUtils.js'

const {
    // 加载匹配
    importMacth,
    // 获取加载器
    getLoader,
    // 导入内容
    importContent,
    // 替换环境变量
    replaceEnv,
    // 批量替换
    batchReplace,
} = loaderUtils

/**
 * 替换
 */
function viteReplaceLoader(options) {

    // 获取配置
    const o = Object.assign({
        // 环境变量
        env: {},
        // 替换内容回调
        replace: {},
        // 替换器
        replacer: null,
        // 加载别名
        importAlias: {},
        // 加载器
        importLoader: null,
    }, options)

    return {
        enforce: 'pre',
        transform(source, resourcePath) {

            // 加载器
            const importReg = importMacth(source)
            if (importReg) {
                source = importContent(resourcePath, importReg, source, o.importAlias, o.importLoader, o.env)
            }

            // 替换器
            if (o.replacer) {
                const replacer = getLoader(o.replacer)
                if (replacer) {
                    source = replacer(source, resourcePath)
                }
            }

            // 批量替换
            source = batchReplace(source, o.replace)

            // 条件编译
            source = replaceEnv(source, o.env)

            return {
                code: source,
                map: null,
            }
        }
    }
}

export default viteReplaceLoader
