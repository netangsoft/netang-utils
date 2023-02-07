const fs = require('fs')
const path = require('path')
const rootPath = require('@netang/node-utils/rootPath')

/**
 * 生成 @netang/utils 引入文件
 */
module.exports = async function (params) {

    const o = Object.assign({
        // 包含文件列表
        includes: [],
        // 忽略文件
        ignore: [],
        // 库名
        package: '@netang/utils',
        // 文件后缀名
        ext: '.mjs',
        // 生成文件地址
        outputPath: '',
    }, params)

    if (! o.outputPath) {
        console.log('outputPath 不能为空')
        return
    }

    // 文件头
    const headers = []

    // 文件内容
    const contents = []

    const files = fs.readdirSync(path.join(rootPath, `node_modules/${o.package}`))
    for (const file of files) {
        if (file.endsWith(o.ext)) {

            // 文件名
            const fileName = file.replace(o.ext, '')

            if (
                (! o.includes.length || o.includes.indexOf(fileName) > -1)
                || (! o.ignore.length || o.ignore.indexOf(fileName) === -1)
            ) {
                headers.push(`import ${fileName} from '${o.package}/${fileName}'`)
                contents.push(`    ${fileName},`)
            }
        }
    }

    // 生成文件
    fs.writeFileSync(path.join(rootPath, o.outputPath), headers.length ? `${headers.join('\n')}\n\nexport default {\n${contents.join('\n')}\n}` : '')
}
