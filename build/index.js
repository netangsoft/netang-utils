const path = require('path')
const plugin = require('@babel/plugin-transform-modules-commonjs')
const { transformAsync } = require('@babel/core')

const readFile = require('../node/readFile')
const writeFile = require('../node/writeFile')
const readdir = require('../node/readdir')
const remove = require('../node/remove')

/**
 * 执行
 */
async function run() {

    // cjs 文件夹路径
    const cjsPath = path.join(__dirname, '../cjs')

    // 删除 cjs 文件夹
    await remove(cjsPath)

    // 读取所有文件
    const files = await readdir(path.join(__dirname, '../'), {
        // 包含规则
        includes: [
            '.internal/**/*.js',
            'locale/**/*.js',
            '*.js',
        ],
        // 忽略规则
        ignores: [
            '.internal/_buildImportFile.js',
        ],
    })

    // 遍历文件
    for (const { relativePath, filePath, fileName, isFile } of files) {
        if (isFile) {

            // 读取文件内容
            const content = await readFile(filePath)

            // 替换导出方式
            // 将 exports.default 改为 module.exports
            let replaceExport = 'module.exports'

            // 判断是否有多个导出
            // --------------------------------------------------
            // 如果为导出默认
            if (content.indexOf('export default') > -1) {

                // 如果存在其他导出
                // 例如 export const test = 1
                const arr = content.match(/export/g)
                if (arr && arr.length > 1) {

                    // 则将 exports.default 改为 exports.当前函数名
                    replaceExport = `exports.${fileName.replace('.js', '')}`
                }
            }
            // --------------------------------------------------

            // 转为 cjs
            const { code } = await transformAsync(content, {
                plugins: [ plugin ],
                sourceType: 'module',
            })

            // 写入 cjs 文件
            await writeFile(path.join(cjsPath, relativePath), code.replace('exports.default', replaceExport))
        }
    }
}

run().finally()


