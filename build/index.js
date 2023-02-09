const path = require('path')
const fs = require('fs')
const plugin = require('@babel/plugin-transform-modules-commonjs')
const { transformAsync } = require('@babel/core')

const delFile = require('@netang/node-utils/delFile')
const dirExists = require('@netang/node-utils/dirExists')
const writeFile = require('@netang/node-utils/writeFile')

/**
 * 生成 cjs
 */
async function toCjs(fromPath, toPath) {

    const files = fs.readdirSync(fromPath)
    for (const file of files) {

        const fromChildPath = path.join(fromPath, file)
        const toChildPath = path.join(toPath, file)

        // 如果是后缀为 .js 的文件
        if (file.endsWith('.js')) {

            // 读取文件内容
            const content = fs.readFileSync(fromChildPath, 'utf-8')

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
                    replaceExport = `exports.${file.replace('.js', '')}`
                }
            }
            // --------------------------------------------------

            // 转为 cjs
            const { code } = await transformAsync(content, {
                plugins: [ plugin ],
                sourceType: 'module',
            })

            // 写入 cjs 文件
            writeFile(toChildPath, code.replace('exports.default', replaceExport))

        } else if (
            // 否则如果是文件夹
            dirExists(fromChildPath)
            // 不是忽略文件夹
            && ['.git', '.idea', 'build'].indexOf(file) === -1
        ) {
            await toCjs(fromChildPath, toChildPath)
        }
    }
}

// 删除 cjs 文件夹
delFile(path.join(__dirname, '../cjs'))

// 生成 cjs
toCjs(path.join(__dirname, '../'), path.join(__dirname, '../cjs'))
    .finally()

