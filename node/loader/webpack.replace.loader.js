const {
    // html 加载器正则
    includeHtmlReg,
    // js 加载器正则
    includeJsReg,
    // 加载内容
    includeContent,
    // 替换环境变量
    replaceEnv,
    // 批量替换
    batchReplace,
} = require('./loaderUtils')

module.exports = function (source) {

    // 获取配置
    const {
        // 环境变量
        env,
        // 替换内容回调
        replace,
        // 替换器
        replacer,
        // 加载器
        includeLoader,
    } = Object.assign({
        // 环境变量
        env: {},
        // 替换内容回调
        replace: {},
        // 替换器
        replacer: null,
        // 加载器
        includeLoader: null,
    }, this?.getOptions() || this.options || this.query)

    // 加载器
    if (includeLoader) {
        const isHtmlReg = includeHtmlReg.test(source)
        if (isHtmlReg || includeJsReg.test(source)) {
            source = includeContent(this.resourcePath, source, isHtmlReg ? includeHtmlReg : includeJsReg, require(includeLoader))
        }
    }

    // 替换器
    if (replacer) {
        source = require(replacer).call(this, source)
    }

    // 批量替换
    source = batchReplace(source, replace)

    // 条件编译
    source = replaceEnv(source, env)

    return source
}
