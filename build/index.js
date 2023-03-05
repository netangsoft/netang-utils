const path = require('path')

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
    for (const { relativePath, filePath, isFile, fileName } of files) {
        if (isFile) {
            // 写入 cjs 文件
            await writeFile(path.join(cjsPath, relativePath), toCjs(await readFile(filePath), fileName))
        }
    }
}

/**
 * 获取右边符号
 */
function getRightSymbol(symbol) {
    switch (symbol) {
        case 'class':
            return '{'
        case 'function':
            return '('
        default:
            return ''
    }
}

/**
 * 获取 export default
 */
function getDefaultExport({ defaultName, value, values }) {

    // 获取方法名
    function getMethodName(methodName) {
        return methodName ? methodName : defaultName
    }

    let str = ''

    // 方法名
    let methodName = ''

    let symbol = values[2]

    // 获取方法名右边符号
    const methodNameRightSymbol = getRightSymbol(symbol)

    // 如果有方法名右边的符号
    if (methodNameRightSymbol) {

        // 方法名
        methodName = values[3]
        const index = methodName.indexOf(methodNameRightSymbol)
        if (index > -1) {
            methodName = methodName.substring(0, index)
        }

        // 如果有方法名
        if (methodName) {
            methodName = getMethodName(methodName)
            str += `${symbol} ` + value.substring(value.indexOf(methodName))

        // 如果没有方法名
        } else {
            methodName = getMethodName()
            str += `${symbol} ${methodName} {`
        }

    // 如果没有方法名右边的符号
    } else if (symbol === '{') {
        methodName = getMethodName()
        str += `const ${methodName} = {`

    // 否则为自定义变量
    } else {
        methodName = getMethodName(symbol)
        str += ``
    }

    return {
        replace: str,
        methodName,
    }
}

/**
 * 获取 export 标识
 */
function getExportName(methodName, symbol) {

    // 获取方法名右边符号
    const methodNameRightSymbol = getRightSymbol(symbol)

    // 如果有方法名右边的符号
    if (methodNameRightSymbol) {
        const index = methodName.indexOf(methodNameRightSymbol)
        if (index > -1) {
            methodName = methodName.substring(0, index)
        }
    }

    return methodName
}

/**
 * 获取所有正则匹配
 */
function getMatchAll(content, reg) {

    const matchArr = content.matchAll(reg)
    const lists = []

    for (const match of matchArr) {
        const value = match[0]
        const values = value.split(' ').filter(function (str) {
            return str.replace(/^\s+|\s+$/g, '') !== ''
        })
        lists.push({
            value,
            values,
        })
    }

    return lists
}

/**
 * 转换为 cjs
 */
function toCjs(content, fileName) {

    // 默认导出标识
    let defaultName = fileName.replace('.js', '')
        .replace(/\./g, '_')
        .replace(/-/g, '_')

    // 内容替换
    content = content.replace(/ default{/g, ' default {')
        .replace(/class{/g, 'class {')
        .replace(/function\(/g, 'function (')

    // 【替换 import 为 require】
    // --------------------------------------------------------------------------------

    let lists = getMatchAll(content, /(.*)import(.*)from(.*)/g)

    for (const { value } of lists) {
        const newValue = value.replace('import', 'const')
            .replace(' as ', ': ')
            .replace('from', '= require(')
            .replace('require( ', 'require(') + ')'

        content = content.replace(value, newValue)
    }

    // 【替换 exports】
    // --------------------------------------------------------------------------------

    lists = getMatchAll(content, /(.*)export (.*)/g)
    const num = lists.length

    const exportNames = []
    let exportDefault = ''

    for (const { value, values } of lists) {

        // 第二个符号
        const symbol = values[1]

        // 如果是 export.default
        if (symbol === 'default') {
            const res = getDefaultExport({
                defaultName,
                value,
                values,
            })

            // 替换内容
            content = content.replace(value, res.replace)

            // 如果是 export.default
            if (num === 1) {
                exportDefault = `module.exports = ${res.methodName}`

            // 否则是 export
            } else {
                exportNames.push(res.methodName)
            }

        // 否则是 export
        } else {
            exportNames.push(getExportName(values[2], symbol))
        }
    }

    // 内容替换
    content = content.replace(/export /g, '')
        .replace(/export/g, '')

    if (exportNames.length) {
        for (const methodName of exportNames) {
            content += `\nexports.${methodName} = ${methodName}`
        }
    }

    if (exportDefault) {
        content += `\n${exportDefault}`
    }

    return content
}

run().finally()


