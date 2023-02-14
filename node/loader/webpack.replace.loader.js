const $n_matchRecursive = require('../../cjs/matchRecursive')

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

function isValidObject(value) {
    const isObject = value != null && typeof value === 'object' && ! Array.isArray(value)
    if (isObject) {
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                return true
            }
        }
    }
    return false
}

/**
 * 替换内容
 */
function replaceContent(content, env, start, end) {

    const startRegex = new RegExp(start, 'mi')

    const matches = $n_matchRecursive(content, start, end)
    if (! matches.length) {
        return content
    }

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
                matchGroup.left = startRegex.exec(match.value)
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
                    builder += matchGroup.left.input + replaceContent(matchGroup.match, env, start, end) + match.value
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
 * 包含内容
 */
function includeContent(content, reg, loader) {
    return content.replace(reg, (a1, a2) => {
        const args = new Function(`return (function(){return arguments})${a2}`)()
        if (args.length) {
            const res = loader.call(this, ...args)
            if (res) {
                return includeContent.call(this, res, reg, loader)
            }
        }
        return ''
    })
}

module.exports = function (source) {

    // 获取配置
    const {
        // 环境变量
        env,
        // 替换内容回调
        replace,
        // 加载器
        includeLoader,
    } = this.getOptions()

    // 加载器
    if (includeLoader) {
        const reg1 = new RegExp('(?:/\\*|<!--)[ \\t]*#include(.*)(?:\\*/|-->)','gmi')
        const reg2 = new RegExp('//[ \\t]*#include(.*)\n','gmi')
        const isReg1 = reg1.test(source)
        if (isReg1 || reg2.test(source)) {
            source = includeContent.call(this, source, isReg1 ? reg1 : reg2, require(includeLoader))
        }
    }

    // 替换内容
    if (isValidObject(replace)) {
        for (const key in replace) {
            const reg = new RegExp(key,'gmi')
            if (reg.test(source)) {
                source = source.replace(reg, replace[key])
            }
        }
    }

    // 条件编译
    if (isValidObject(env)) {
        source = replaceContent(source, env, '[ \t]*(?://|/\\*)[ \t]*#(ifndef|ifdef|if)[ \t]+([^\n*]*)(?:\\*(?:\\*|/))?(?:[ \t]*\n+)?', '[ \t]*(?://|/\\*)[ \t]*#endif[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n)?')
        source = replaceContent(source, env, '[ \t]*<!--[ \t]*#(ifndef|ifdef|if)[ \t]+(.*?)[ \t]*(?:-->|!>)(?:[ \t]*\n+)?', '[ \t]*<!(?:--)?[ \t]*#endif[ \t]*(?:-->|!>)(?:[ \t]*\n)?')
    }

    return source
}
