const path = require('path')
const dirExists = require('./dirExists')
const readdir = require('./readdir')
const rootPath = require('./rootPath')
const writeFile = require('./writeFile')

/**
 * 生成引入配置文件
 */
module.exports = async function (params) {

    const o = Object.assign({
        // 包含文件列表
        includes: [],
        // 忽略文件
        ignore: [],
        // 库名
        package: '',
        // 文件后缀名
        ext: '.js',
        // 生成文件地址
        outputPath: '',
        // 格式化文件名
        format: null,
    }, params)

    if (! o.outputPath) {
        console.log('The parameter [outputPath] cannot be empty')
        return
    }

    if (! o.package) {
        console.log('The parameter [package] cannot be empty')
        return
    }

    // 获取包路径
    const packagePath = path.join(rootPath, `node_modules/${o.package}`)

    // 如果包路径不存在
    if (! await dirExists(packagePath)) {
        console.log(`${o.package} folder does not exist`)
        return
    }

    // 文件头
    const headers = []

    // 文件内容
    const contents = []

    const files = await readdir(packagePath, { deep: false })
    for (const { fileName, isFile } of files) {
        if (isFile && fileName.endsWith(o.ext)) {

            // 文件名
            const name = fileName.replace(o.ext, '')

            if (
                (! o.includes.length || o.includes.indexOf(name) > -1)
                && (! o.ignore.length || o.ignore.indexOf(name) === -1)
            ) {
                headers.push(`import ${name} from '${o.package}/${name}'`)
                contents.push(`    ${name},`)
            }
        }
    }

    // 生成文件
    await writeFile(path.join(rootPath, o.outputPath), headers.length ? `${headers.join('\n')}

/**
 * ${o.package}
 * 注意: 不要修改, 该文件是由配置生成的
 */
export default {

${contents.join('\n')}
}` : '')
}
