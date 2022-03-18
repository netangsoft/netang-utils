const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const os = require('os')
const { EOL } = os

/**
 * 转义正则特殊字符
 */
const regExpTag = ['\\', '*', '+', '|', '{', '}', '(', ')', '^', '$', '[', ']', '?', ',', '.', '&']
function regExp2String(reg) {
    reg = _.trim(reg)
    if (!reg) {
        return ''
    }

    regExpTag.forEach((item) => {
        reg = reg.replace(new RegExp('\\' + item, 'g'), '\\' + item)
    })

    return reg
}

/**
 * 替换编译
 */
function replaceCompile(replace, filePath, env, first, end) {
    first = regExp2String(first)
    end = regExp2String(end)

    return replace(new RegExp(`(\\n?)([ \\t]*)(${first}\\s*#import.*${end})\\n?`, 'gi'), function(match) {
        const str = match.match(new RegExp(`${first}\\s*#import(.*)${end}`))
        if (str && Array.isArray(str) && str[1]) {
            const condition = _.trim(str[1])
            if (! condition) {
                return ''
            }

            function getImport(args) {

                // 获取 import 内容
                const content = fs.readFileSync(path.join(filePath, args[0]), 'utf-8')

                // 如果有执行函数
                if (args.length > 1 && _.isFunction(args[1])) {
                    const res = args[1](content, env, _)
                    if (res != null) {
                        return EOL + res + EOL
                    }
                }

                return EOL + content + EOL
            }

            return getImport(new Function(`return (${condition})`)())
        }

        return match
    })
}

module.exports = function(replace, filePath, env) {
    return replaceCompile(replace, filePath, env, '/*', '*/')
}
