import path from 'path'
import xregexp from 'xregexp'

import $n_isFunction from 'lodash-es/isFunction.js'
import $n_isValidObject from '../../isValidObject.js'
import $n_forIn from '../../forIn.js'
import $n_trimString from '../../trimString.js'

import getFileTypeSync from '../getFileTypeSync.js'
import readFileSync from '../readFileSync.js'
import fileExistsSync from '../fileExistsSync.js'

/**
 * 获取加载器
 */
function getLoader(loader) {
    try {
        if ($n_isFunction(loader)) {
            return loader
        }
        loader = import(loader)
        if ($n_isFunction(loader)) {
            return loader
        }
    } catch (e) {
        console.log(`    [error]getLoader(${loader})`, e)
    }
    return null
}

/**
 * 加载匹配
 */
function importMacth(source, name = '#import') {
    const htmlReg = new RegExp('(?:/\\*|<!--)[ \\t]*' + name + '(.*)(?:\\*/|-->)','gmi')
    if (htmlReg.test(source)) {
        return htmlReg
    }
}

/**
 * 获取加载文件路径
 */
function getImportFilePath(parentPath, filePath, importAlias) {

    // 如果是别名
    if ($n_isValidObject(importAlias)) {
        for (const key in importAlias) {
            if (filePath.startsWith(key)) {
                return path.join(importAlias[key], filePath.substring(String(key).length))
            }
        }
    }

    // 否则是相对路径
    return path.join(getFileTypeSync(parentPath) === 'dir' ? parentPath : path.dirname(parentPath), filePath)
}

/**
 * 执行内容
 */
function runContent(reg, source, cb, defaultValue = '') {
    return source.replace(reg, function(a1, a2) {
        a2 = $n_trimString(a2)
        if (a2.startsWith('(') && a2.endsWith(')')) {
            // 获取参数
            const args = new Function(`return (function(){return arguments})${a2}`)()
            if (args && args.length) {
                return cb(args, source, defaultValue)
            }
        }
        return defaultValue
    })
}

/**
 * 加载内容
 */
function importContent(filePath, reg, source, importAlias, importLoader, env) {
    return runContent(reg, source, function(args) {

        // 获取加载文件路径
        const importFilePath = getImportFilePath(filePath, args[0], importAlias)
        if (fileExistsSync(importFilePath)) {

            // 读取文件内容
            source = readFileSync(importFilePath)

            // 如果没有正则匹配, 则说明是最终加载的内容
            reg = importMacth(source)
            if (! reg) {
                // 获取加载器
                const loader = getLoader(importLoader)
                if (loader) {
                    const newArgs = []
                    for (let i = 1; i < args.length; i++) {
                        newArgs.push(args[i])
                    }
                    return loader(source, importFilePath, ...newArgs)
                }
                return source
            }

            // 否则继续执行加载内容
            return importContent(importFilePath, reg, source, importAlias, importLoader, env)
        }
    })
}

/**
 * 测试表达式
 */
function testPasses(env, test) {
    try {
        if (test) {
            for (let key in env) {
                test = test.replace(new RegExp(key, 'gi'), env[key] ? 'true' : 'false')
            }
            return new Function(`return (${test})`)()
        }
    } catch(e) {}
}

/**
 * 替换内容
 */
function replaceContent(content, env, leftReg, rightReg) {

    const matches = xregexp.matchRecursive(content, leftReg, rightReg, 'gmi', {
        valueNames: ['between', 'left', 'match', 'right']
    })
    if (! matches.length) {
        return content
    }

    const leftRegex = new RegExp(leftReg, 'mi')

    const matchGroup = {
        left: null,
        match: null,
    }

    const res = matches.reduce(function(builder, match) {
        switch (match.name) {
            case 'between':
                builder += match.value
                break
            case 'left':
                matchGroup.left = leftRegex.exec(match.value)
                break
            case 'match':
                matchGroup.match = match.value
                break
            case 'right':
                const variant = matchGroup.left[1]
                const test = (matchGroup.left[2] || '').trim()
                let status = true
                switch (variant) {
                    case 'if':
                    case 'ifdef':
                        status = true
                        break
                    case 'ifndef':
                        status = false
                        break
                    default:
                        throw new Error('Unknown if variant ' + variant + '.')
                }
                if (testPasses(env, test) === status) {
                    builder += matchGroup.left.input + replaceContent(matchGroup.match, env, leftReg, rightReg) + match.value
                }
                break
        }
        return builder
    }, '')

    if (res) {
        return res
    }

    return content
}

/**
 * 替换环境变量
 */
function replaceEnv(source, env) {

    // 条件编译
    if ($n_isValidObject(env)) {
        source = replaceContent(source, env, '[ \t]*(?://|/\\*)[ \t]*#(ifndef|ifdef|if)[ \t]+([^\n*]*)(?:\\*(?:\\*|/))?(?:[ \t]*\n+)?', '[ \t]*(?://|/\\*)[ \t]*#endif[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n)?')
        source = replaceContent(source, env, '[ \t]*<!--[ \t]*#(ifndef|ifdef|if)[ \t]+(.*?)[ \t]*(?:-->|!>)(?:[ \t]*\n+)?', '[ \t]*<!(?:--)?[ \t]*#endif[ \t]*(?:-->|!>)(?:[ \t]*\n)?')
    }

    return source
}

/**
 * 批量替换
 */
function batchReplace(source, replaceObj) {
    $n_forIn(replaceObj, function (item, key) {
        const reg = new RegExp(key,'gmi')
        if (reg.test(source)) {
            source = source.replace(reg, item)
        }
    })
    return source
}

export default {
    // 获取加载器
    getLoader,
    // 加载匹配
    importMacth,
    // 执行内容
    runContent,
    // 导入内容
    importContent,
    // 替换环境变量
    replaceEnv,
    // 批量替换
    batchReplace,
}
