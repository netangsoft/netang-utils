const {
    // 替换环境变量
    replaceEnv,
    // 批量替换
    batchReplace,
} = require('./loaderUtils')

/**
 * 包含内容
 */
function includeContent(content, reg, loader) {
    return content.replace(reg, (a1, a2) => {
        const args = new Function(`return (function(){return arguments})${a2}`)()
        if (args.length) {
            const res = loader.call(this, ...args)
            if (res) {
                return includeContent.call(this, res, reg, loader)
            }
        }
        return ''
    })
}

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
        const reg1 = new RegExp('(?:/\\*|<!--)[ \\t]*#include(.*)(?:\\*/|-->)','gmi')
        const reg2 = new RegExp('//[ \\t]*#include(.*)\n','gmi')
        const isReg1 = reg1.test(source)
        if (isReg1 || reg2.test(source)) {
            source = includeContent.call(this, source, isReg1 ? reg1 : reg2, require(includeLoader))
        }
    }

    // 替换器
    if (replacer) {
        source = require(replacer).call(this, source)
    }

    // 条件编译
    source = replaceEnv(source, env)

    // 批量替换
    source = batchReplace(source, replace)

    return source
}
