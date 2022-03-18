const trim = require('lodash/trim')

/**
 * 转义正则特殊字符
 */
const regExpTag = ['\\', '*', '+', '|', '{', '}', '(', ')', '^', '$', '[', ']', '?', ',', '.', '&']
function regExp2String(reg) {
    reg = trim(reg)
    if (!reg) {
        return ''
    }

    regExpTag.forEach((item) => {
        reg = reg.replace(new RegExp('\\' + item, 'g'), '\\' + item)
    })

    return reg
}

/**
 * 条件编译
 */
function conditionCompile(data, env, first, end) {
    first = regExp2String(first)
    end = regExp2String(end)

    return data.replace(new RegExp(`(\\n?)([ \\t]*)(${first}\\s*\]if.*${end})\\n?([\\s\\S]*?)\\n?(${first}\\s*\]endif.*${end})\\n?`, 'gi'), function(match) {

        const str = match.match(new RegExp(`${first}\\s*\]if(.*)${end}`))
        if (str && Array.isArray(str) && str[1]) {
            let condition = trim(str[1])
            if (!condition) {
                return ''
            }

            for (let key in env) {
                condition = condition.replace(new RegExp(key, 'gi'), env[key] ? 'true' : 'false')
            }

            if (!new Function(`return (${condition})`)()) {
                return ''
            }
        }

        return match
    })
}

module.exports = function (source) {

    if (this.cacheable) {
        this.cacheable()
    }

    const options = this.options || this.query

    // 条件编译
    if (typeof options.env === 'object') {
        source = conditionCompile(source, options.env, '<!--', '-->')
        source = conditionCompile(source, options.env, '/*', '*/')
        source = conditionCompile(source, options.env, '//', '')
    }

    return source
}
