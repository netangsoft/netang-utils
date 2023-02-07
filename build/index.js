const path = require('path')
const fs = require('fs')
const plugin = require('@babel/plugin-transform-modules-commonjs')
const { transformAsync } = require('@babel/core');

/**
 * 转为 cjs 文件
 */
async function toCjs(filePath) {

    // 文件内容
    const content = fs.readFileSync(filePath, 'utf-8')

    // 转为 cjs
    const { code } = await transformAsync(content, {
        plugins: [ plugin ],
        sourceType: 'module',
    })

    // 写入 .js 文件
    fs.writeFileSync(filePath.replace('.mjs', '.js'), code.replace('exports.default', 'module.exports'))
}

/**
 * 设置所有文件
 */
async function setFiles(filePath, suffix, callback) {

    const files = fs.readdirSync(filePath)
    for (const file of files) {

        const childPath = path.join(filePath, file)

        // 如果是文件夹
        if (fs.statSync(childPath).isDirectory()) {
            if (['.git', '.idea', 'build'].indexOf(file) === -1) {
                await setFiles(childPath, suffix, callback)
            }

        // 否则是后缀为 .xxx 的文件
        } else if (file.endsWith(suffix)) {
            await callback(childPath)
        }
    }
}

async function run(dirPath) {

    // 先删除所有 .js
    await setFiles(dirPath, '.js',  async function (childPath) {

        // 删除文件
        fs.rmSync(childPath, { recursive: true, force: true })
    })

    // 再编译所有 .cjs
    await setFiles(dirPath, '.mjs',  toCjs)
}

run(path.join(__dirname, '../')).finally()

