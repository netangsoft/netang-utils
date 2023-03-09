const {
    // 获取加载器
    getLoader,
    // 获取加载正则
    getIncludeReg,
    // 加载内容
    includeContent,
    // 导入内容
    importContent,
    // 替换环境变量
    replaceEnv,
    // 批量替换
    batchReplace,
} = require('./loaderUtils')

module.exports = function (source) {

    // 获取配置
    const o = Object.assign({
        // 环境变量
        env: {},
        // 替换内容回调
        replace: {},
        // 替换器
        replacer: null,
        // 加载器
        includeLoader: null,
        // 是否开启导入
        import: false,
    }, this?.getOptions() || this.options || this.query)

    // 开启导入
    if (o.import) {
        // 导入内容
        source = importContent(this.resourcePath, source)
    }

    // 加载器
    if (o.includeLoader) {
        // 获取加载正则
        const { htmlReg, jsReg } = getIncludeReg()
        const isHtmlReg = htmlReg.test(source)
        if (isHtmlReg || jsReg.test(source)) {
            const includeLoader = getLoader(o.includeLoader)
            if (includeLoader) {
                source = includeContent(this.resourcePath, source, isHtmlReg ? htmlReg : jsReg, includeLoader)
            }
        }
    }

    // 替换器
    if (o.replacer) {
        const replacer = getLoader(o.replacer)
        if (replacer) {
            source = replacer(source, this.resourcePath)
        }
    }
    
    // 批量替换
    source = batchReplace(source, o.replace)

    // 条件编译
    source = replaceEnv(source, o.env)

    return source
}
