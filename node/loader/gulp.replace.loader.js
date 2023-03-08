const Transform = require('stream').Transform
const istextorbinary = require('istextorbinary')

const {
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

                    // 替换环境变量
                    source = replaceEnv(source, o.env)

                    // 批量替换
                    source = batchReplace(source, o.replace)

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
