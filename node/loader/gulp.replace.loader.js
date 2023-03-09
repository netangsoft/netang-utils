const Transform = require('stream').Transform
const istextorbinary = require('istextorbinary')

const {
    // 获取加载器
    getLoader,
    // 获取加载正则
    getIncludeReg,
    // 导入内容
    importContent,
    // 加载内容
    includeContent,
    // 替换环境变量
    replaceEnv,
    // 批量替换
    batchReplace,
} = require('./loaderUtils')

module.exports = function (options = {}) {

    // 获取配置
    const o = Object.assign({
        // 环境变量
        env: {},
        // 替换内容
        replace: {},
        // 替换器
        replacer: null,
        // 是否开启导入
        import: false,
        // 加载器
        includeLoader: null,
        // 是否跳过二进制
        skipBinary: true,
    }, options)

    return new Transform({
        objectMode: true,

        /**
         * transformation
         * @param {import("vinyl")} file
         * @param {BufferEncoding} enc
         * @param {(error?: Error | null, data?: any) => void} callback
         */
        transform(file, enc, callback) {

            if (file.isNull()) {
                return callback(null, file)
            }

            function doReplace() {

                if (file.isBuffer()) {

                    // 获取文件内容
                    let source = String(file.contents)

                    // 开启导入
                    if (o.import) {
                        // 导入内容
                        source = importContent(file._base, source)
                    }

                    // 加载器
                    if (o.includeLoader) {
                        // 获取加载正则
                        const { htmlReg, jsReg } = getIncludeReg()
                        const isHtmlReg = htmlReg.test(source)
                        if (isHtmlReg || jsReg.test(source)) {
                            const includeLoader = getLoader(o.includeLoader)
                            if (includeLoader) {
                                source = includeContent(file._base, source, isHtmlReg ? htmlReg : jsReg, includeLoader)
                            }
                        }
                    }

                    // 替换器
                    if (o.replacer) {
                        const replacer = getLoader(o.replacer)
                        if (replacer) {
                            source = replacer(source, file._base)
                        }
                    }

                    // 批量替换
                    source = batchReplace(source, o.replace)

                    // 条件编译
                    source = replaceEnv(source, o.env)

                    file.contents = Buffer.from(source)

                    return callback(null, file)
                }
                callback(null, file)
            }

            // 如果跳过二进制
            if (o.skipBinary) {
                if (! istextorbinary.isText(file.path, file.contents)) {
                    callback(null, file)
                } else {
                    doReplace()
                }
                return
            }

            doReplace()
        }
    })
}
