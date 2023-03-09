const Transform = require('stream').Transform
const istextorbinary = require('istextorbinary')

const $n_isFunction = require('lodash/isFunction')

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

module.exports = function (options = {}) {

    // 获取配置
    const o = Object.assign({
        // 环境变量
        env: {},
        // 替换内容
        replace: {},
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

                    // 加载器
                    if (o.includeLoader) {
                        const isHtmlReg = includeHtmlReg.test(source)
                        if (isHtmlReg || includeJsReg.test(source)) {
                            source = includeContent(file._base, source, isHtmlReg ? includeHtmlReg : includeJsReg, $n_isFunction(o.includeLoader) ? o.includeLoader : require(o.includeLoader))
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
