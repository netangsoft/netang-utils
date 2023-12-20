const Transform = require('stream').Transform
const istextorbinary = require('istextorbinary')

const {
    // 加载匹配
    importMacth,
    // 获取加载器
    getLoader,
    // 执行内容
    runContent,
    // 导入内容
    importContent,
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
        replaceLoader: null,
        // 执行器
        runLoader: null,
        // 加载别名
        importAlias: {},
        // 加载器
        importLoader: null,
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
                    const importReg = importMacth(source)
                    if (importReg) {
                        source = importContent(file._base, importReg, source, o.importAlias, o.importLoader, o.env)
                    }

                    // 执行器
                    if (o.runLoader) {
                        const runLoader = getLoader(o.runLoader)
                        if (runLoader) {
                            const runReg = importMacth(source, '#run')
                            if (runReg) {
                                source = runLoader(source, file._base, runReg, runContent)
                            }
                        }
                    }

                    // 替换器
                    if (o.replaceLoader) {
                        const replaceLoader = getLoader(o.replaceLoader)
                        if (replaceLoader) {
                            source = replaceLoader(source, file._base)
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
