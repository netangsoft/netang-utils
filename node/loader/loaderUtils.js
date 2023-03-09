const path = require('path')
const xregexp = require('xregexp')

const $n_isFunction = require('lodash/isFunction')
const $n_isValidObject = require('../../cjs/isValidObject')
const $n_forIn = require('../../cjs/forIn')

const getFileTypeSync = require('../getFileTypeSync')
const readFileSync = require('../readFileSync')
const fileExistsSync = require('../fileExistsSync')

/**
 * 获取加载器
 */
function getLoader(loader) {
    try {
        if ($n_isFunction(loader)) {
            return loader
        }
        loader = require(loader)
        if ($n_isFunction(loader)) {
            return loader
        }
    } catch (e) {}
    return null
}

/**
 * 获取加载正则
 */
function getIncludeReg(name = 'include') {
    return {
        // html 加载器正则
        htmlReg: new RegExp('(?:/\\*|<!--)[ \\t]*#' + name + '(.*)(?:\\*/|-->)','gmi'),
        // js 加载器正则
        jsReg: new RegExp('//[ \\t]*#' + name + '(.*)\n','gmi'),
    }
}

/**
 * 加载内容
 */
function includeContent(filePath, content, reg, loader) {
    return content.replace(reg, function(a1, a2) {
        const args = new Function(`return (function(){return arguments})${a2}`)()
        if (args.length) {
            const res = loader(filePath, ...args)
            if (res) {
                return includeContent(filePath, res, reg, loader)
            }
        }
        return ''
    })
}

/**
 * 导入内容
 */
function importContent(filePath, source) {

    // 获取加载正则
    const { htmlReg, jsReg } = getIncludeReg('import')
    const isHtmlReg = htmlReg.test(source)
    if (isHtmlReg || jsReg.test(source)) {
        return source.replace(isHtmlReg ? htmlReg : jsReg, function(a1, a2) {
            const args = new Function(`return (function(){return arguments})${a2}`)()
            if (args.length) {
                const fileType = getFileTypeSync(filePath)
                const importFilePath = path.join(fileType === 'dir' ? filePath : path.dirname(filePath), args[0])
                if (fileExistsSync(importFilePath)) {
                    return importContent(importFilePath, readFileSync(importFilePath))
                }
            }
            return ''
        })
    }
    return source
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

module.exports = {
    // 获取加载器
    getLoader,
    // 获取加载正则
    getIncludeReg,
    // 加载内容
    includeContent,
    // 导入内容
    importContent,
    // 替换环境变量
    replaceEnv,
    // 批量替换
    batchReplace,
}
