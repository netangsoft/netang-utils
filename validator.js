const _isArray = require('lodash/isArray')
const _isString = require('lodash/isString')
const _indexOf = require('lodash/indexOf')
const _has = require('lodash/has')
const _isEqual = require('lodash/isEqual')
const _startsWith = require('lodash/startsWith')
const _isFunction = require('lodash/isFunction')
const _trim = require('lodash/trim')
const _toLower = require('lodash/toLower')
const _get = require('lodash/get')
const _split = require('lodash/split')
const _assign = require('lodash/assign')
const _isEmpty = require('lodash/isEmpty')
const _join = require('lodash/join')
const _map = require('lodash/map')
const _cloneDeep = require('lodash/cloneDeep')
const _toPairs = require('lodash/toPairs')
// const _toNumber = require('lodash/toNumber')

const isNumeric = require('./isNumeric')
const isFillArray = require('./isFillArray')
const isFillObject = require('./isFillObject')
const isFillString = require('./isFillString')
const isRequired = require('./isRequired')
const size = require('./size')
const toNumberDeep = require('./toNumberDeep')
const replaceAll = require('./replaceAll')

const { langSettings, trans } = require('./lang')

/**
 * 表单验证
 */

// 全部都不是 required
function allFailingRequired(data, vals) {
    for (let i = 0, len = vals.length; i < len; i++) {
        if (isRequired(data[vals[i]])) {
            return false
        }
    }
    return true
}

function anyFailingRequired(data, vals) {
    for (let i = 0, len = vals.length; i < len; i++) {
        if (! isRequired(data[vals[i]])) {
            return true
        }
    }
    return false
}

function getSize(value, type) {

    // 如果为数字
    if (type === 'numeric') {
        return isNumeric(value) ? value : false
    }

    // 如果为数组
    if (type === 'array') {
        return _isArray(value) ? value.length : false
    }

    // 否则为字符串
    return (_isString(value) || isNumeric(value)) ? String(value).length : false
}

/**
 * gte:field
 * 验证字段必须大于或等于给定的 field 。
 * 字符串、数字、数组和文件都使用 size 进行相同的评估。
 */
function gte(value, {type, val}) {

    const size = getSize(value, type)
    if (size === false) {
        return false
    }

    return size >= val
}

/**
 * lte:field
 * 验证中的字段必须小于或等于给定的 字段 。
 * 字符串、数值、数组和文件大小的计算方式与 size 方法进行评估。
 */
function lte(value, {type, val}) {

    const size = getSize(value, type)
    if (size === false) {
        return false
    }

    return size <= val
}

/**
 * in:foo,bar,…
 * 验证字段必须包含在给定的值列表中。
 */
function _in(value, {vals}) {

    if (isFillArray(value)) {
        for (let i = 0, len = value.length; i < len; i++) {
            if (_indexOf(vals, value[i]) === -1) {
                return false
            }
        }
        return true
    }

    if (_isString(value) || isNumeric(value)) {
        return _indexOf(vals, value) > -1
    }

    return false
}

const ruleMethods = {

    /**
     * alpha
     * 待验证字段只能由字母组成。
     */
    alpha(value) {
        return /^[A-Za-z]+$/.test(value)
    },

    /**
     * alpha_dash
     * 待验证字段可能包含字母、数字，短破折号（-）和下划线（_）。
     */
    alpha_dash(value) {
        return /^[A-Za-z0-9\-\_]+$/.test(value)
    },

    /**
     * alpha_num
     * 待验证字段只能由字母和数字组成。
     */
    alpha_num(value) {
        return /^[A-Za-z0-9]+$/.test(value)
    },

    /**
     * array
     * 待验证字段必须是有效的数组。
     */
    array(value) {
        return _isArray(value)
    },

    /**
     * between:min,max
     * 验证字段的大小必须在给定的 min 和 max 之间。
     * 字符串、数字、数组的计算方式都使用 size 方法。
     */
    between(value, {vals, type}) {

        const size = getSize(value, type)
        if (size === false) {
            return false
        }

        return size >= vals[0] && size <= vals[1]
    },

    /**
     * boolean
     * 验证的字段必须可以转换为 Boolean 类型。 可接受的输入为 true ， false ， 1 ， 0 ， "1" 和 "0" 。
     */
    boolean(value) {
        return value === true || value === false || value === 0 || value === 1 || value === '0' || value === '1'
    },

    /**
     * confirmed
     * 验证字段必须具有匹配字段 foo_confirmation 。
     * 例如，验证字段为 password ，输入中必须存在与之匹配的 password_confirmation 字段。
     */
    confirmed(value, { data, key }) {
        const index = key.length - 13
        if (key.substring(index) === '_confirmation') {
            const compareKey = key.substr(0, index)
            if (_has(data, compareKey)) {
                return _isEqual(String(data[compareKey]), String(value))
            }
        }
        return false
    },

    /**
     * different:field
     * 验证的字段值必须与字段 field 的值不同。
     */
    different(value, {other}) {
        return other != null && value !== other
    },

    /**
     * digits_between:min,max
     * 验证中的字段必须为 numeric，并且长度必须在给定的 min 和 max 之间。
     */
    digits(value, {val}) {
        return isNumeric(value) && String(value).length === val
    },

    /**
     * digits_between:min,max
     * 验证中的字段必须为 numeric，并且长度必须在给定的 min 和 max 之间。
     */
    digits_between(value, {vals}) {
        if (isNumeric(value)) {
            const len = String(value).length
            return len >= vals[0] && len <= vals[1]
        }
        return false
    },

    /**
     * email
     * 验证的字段必须符合 e-mail 地址格式。
     */
    email(value) {
        return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(value)
    },

    /**
     * gt:field
     * 验证字段必须大于给定的 _field_。
     * 字符串、数字、数组都使用 size 进行相同的评估。
     */
    gt(value, {type, val}) {

        const size = getSize(value, type)
        if (size === false) {
            return false
        }

        return size > val
    },

    /**
     * gte:field
     * 验证字段必须大于或等于给定的 field 。
     * 字符串、数字、数组和文件都使用 size 进行相同的评估。
     */
    gte,

    /**
     * lt:field
     * 验证的字段必须小于给定的字段。
     * 字符串、数值、数组和文件大小的计算方式与 size 方法进行评估。
     */
    lt(value, {type, val}) {

        const size = getSize(value, type)
        if (size === false) {
            return false
        }

        return size < val
    },

    /**
     * lte:field
     * 验证中的字段必须小于或等于给定的 字段 。
     * 字符串、数值、数组和文件大小的计算方式与 size 方法进行评估。
     */
    lte,

    /**
     * max:value
     * 验证中的字段必须小于或等于 value。
     * 字符串、数字、数组的计算方式都用 size规则。
     */
    max: lte,

    /**
     * min:value
     * 验证字段必须具有最小值。
     * 字符串，数值，数组的计算方式都与 size 规则一致。
     */
    min: gte,

    /**
     * in:foo,bar,…
     * 验证字段必须包含在给定的值列表中。
     */
    in: _in,

    /**
     * not_in:foo,bar,…
     * 验证字段不能包含在给定的值的列表中。
     */
    not_in(value, res) {
        return !_in(value, res)
    },

    /**
     * integer
     * 验证的字段必须是整数。
     */
    integer(value) {
        return /^[\-+]?[0-9]+$/.test(value)
    },

    /**
     * numeric
     * 验证字段必须为数值。
     */
    numeric(value) {
        return isNumeric(value)
    },

    /**
     * regex:pattern
     * 验证字段必须与给定的正则表达式匹配。
     * 验证时，这个规则使用 PHP 的 preg_match 函数。
     * 指定的模式应遵循 preg_match 所需的相同格式，也包括有效的分隔符。
     * 例如： 'email' => 'not_regex:/^.+$/i'
     */
    regex(value, {oldVal}) {
        return oldVal.test(value)
    },

    /**
     * not_regex:pattern
     * 验证字段必须与给定的正则表达式不匹配。
     * 验证时，这个规则使用 PHP 的 preg_match 函数。
     * 指定的模式应遵循 preg_match 所需的相同格式，也包括有效的分隔符。
     * 例如： 'email' => 'not_regex:/^.+$/i'
     */
    not_regex(value, {oldVal}) {
        return !oldVal.test(value)
    },

    /**
     * required
     * 验证的字段必须存在于输入数据中，而不是空。如果满足以下条件之一，则字段被视为「空」
     * @param value null/空字符串/空对象
     * @returns {boolean}
     */
    required: isRequired,

    /**
     * required_if:anotherfield,value,…
     * 如果其它字段 anotherfield 为任一值(value1 或 value2 或 value3 等, 也可只有一个 value1), 则此验证字段必须存在且不为空
     */
    required_if(value, {other, vals}) {
        return isRequired(value) || !isRequired(other) || _indexOf(vals, other) === -1
    },

    /**
     * required_unless:anotherfield,value,…
     * 如果其它字段 _anotherfield_ 不等于任一值 _value_ ，则此验证字段必须存在且不为空
     */
    required_unless(value, {other, vals}) {

        if (_indexOf(vals, other) === -1) {
            return isRequired(value)
        }

        return true
    },

    /**
     * required_with:foo,bar,…
     * 在其他任一指定字段出现时，验证的字段才必须存在且不为空。
     */
    required_with(value, {data, vals}) {

        if (!allFailingRequired(data, vals)) {
            return isRequired(value)
        }

        return true
    },

    /**
     * required_with_all:foo,bar,…
     * 只有在其他指定字段全部出现时，验证的字段才必须存在且不为空。
     */
    required_with_all(value, {data, vals}) {

        if (!anyFailingRequired(data, vals)) {
            return isRequired(value)
        }

        return true
    },

    /**
     * required_without:foo,bar,…
     * 在其他指定任一字段不出现时，验证的字段才必须存在且不为空。
     */
    required_without(value, {data, vals}) {

        if (anyFailingRequired(data, vals)) {
            return isRequired(value)
        }

        return true
    },

    /**
     * required_without_all:foo,bar,…
     * 只有在其他指定字段全部不出现时，验证的字段才必须存在且不为空。
     */
    required_without_all(value, {data, vals}) {

        if (allFailingRequired(data, vals)) {
            return isRequired(value)
        }

        return true
    },

    /**
     * same:field
     * 验证字段的值必须与给定字段的值相同。
     */
    same(value, {other}) {
        return _isEqual(value, other)
    },

    /**
     * size:value
     * 验证字段必须与给定值的大小一致。
     * 对于字符串，value 对应字符数。
     * 对于数字，value 对应给定的整数值（attribute 必须有 numeric 或者 integer 规则）。
     * 对于数组，size 对应数组的 count 值。
     */
    size(value, {val, type}) {

        const size = getSize(value, type)
        if (size === false) {
            return false
        }

        return size === val
    },

    /**
     * starts_with:foo,bar,…
     * 验证字段必须以给定值之一开头。
     */
    starts_with(value, {vals}) {

        if (_isString(value) || isNumeric((value))) {

            for (let i = 0,len = vals.length; i < len; i++) {
                if (_startsWith(value, vals[i])) {
                    return true
                }
            }

            return false
        }
    },

    /**
     * string
     * 验证字段必须是一个字符串。
     */
    string(value, {oldValue}) {
        return _isString(oldValue)
    },

    /**
     * url
     * 验证的字段必须是有效的 URL。
     */
    url(value) {
        const strRegex = '^((https|http|ftp|rtsp|mms)?://)'
            + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
            + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
            + '|' // 允许IP和DOMAIN（域名）
            + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
            + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
            + '[a-z]{2,6})' // first level domain- .com or .museum
            + '(:[0-9]{1,4})?' // 端口- :80
            + '((/?)|' // a slash isn't required if there is no file name
            + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'

        return (new RegExp(strRegex)).test(value)
    },

    /**
     * chs
     * 字段必须为: 汉字
     */
    chs(value) {
        return /^[\u4E00-\u9FA5]+$/u.test(value)
    },

    /**
     * chs_alpha
     * 字段必须为: 汉字、字母
     */
    chs_alpha(value) {
        return /^[\u4E00-\u9FA5a-zA-Z]+$/u.test(value)
    },

    /**
     * chs_alpha_dash
     * 字段必须为: 汉字、字母、数字，短破折号（-）和下划线（_）。
     */
    chs_alpha_dash(value) {
        return /^[\u4E00-\u9FA5a-zA-Z0-9_\-]+$/u.test(value)
    },

    /**
     * chs_alpha_num
     * 字段必须为: 汉字、字母和数字
     */
    chs_alpha_num(value) {
        return /^[\u4E00-\u9FA5a-zA-Z0-9]+$/u.test(value)
    },

    /**
     * chs_between:min,max
     * 验证中的字段必须为字符串
     * 中文为 2 位, 英文为 1 位
     * 并且长度必须在给定的 min 和 max 之间。
     */
    chs_between(value, {vals}) {
        if (_isString(value) || isNumeric(value)) {
            const len = size(value)
            return len >= vals[0] && len <= vals[1]
        }
        return false
    },

    /**
     * natural(0,1,2,3, etc.)
     * 字段必须为: 自然数(包含零)
     */
    natural(value) {
        return /^[0-9]+$/.test(value) && value >= 0
    },

    /**
     * natural_no_zero(1,2,3, etc.)
     * 字段必须为: 自然数(不包含零)
     */
    natural_no_zero(value) {
        return /^[0-9]+$/.test(value) && value > 0
    },

    /**
     * mobile
     * 字段必须为: 有效的手机号码
     */
    mobile(value) {
        return /^1[1-9]\d{9}$/.test(typeof value === 'number' ? String(value) : value)
    }

    // /**
    //  * Length
    //  *
    //  * 验证字段长度范围
    //  * rule     {min：6, max：30}
    //  * 中文 2 个字符
    //  * 英文 1 个字符
    //  */
    // length(str, rule = {}) {
    //     const len = utils.getLen(_trim(str))
    //
    //     if (rule.min > 0 && rule.max > 0) {
    //         return len >= rule.min && len <= rule.max
    //     } else if (rule.min > 0 && rule.max == null) {
    //         return len >= rule.min
    //     } else if (rule.max > 0 && rule.min == null) {
    //         return len <= rule.max
    //     }
    //
    //     return false
    // },
    //
    // /**
    //  * max_cn
    //  *
    //  * 验证字段最大长度
    //  * 中文 2 个字符
    //  * 英文 1 个字符
    //  */
    // max(str, val = '') {
    //
    //     let len
    //     if (_isArray(str)) {
    //         len = str.length
    //
    //     } else {
    //         len = utils.getLen(_trim(str))
    //     }
    //
    //     return len <= val
    // },
    //
    // /**
    //  * min_cn
    //  *
    //  * 验证字段最大长度
    //  * 中文 2 个字符
    //  * 英文 1 个字符
    //  */
    // min(str, val = '') {
    //
    //     let len
    //     if (_isArray(str)) {
    //         len = str.length
    //
    //     } else {
    //         len = utils.getLen(_trim(str))
    //     }
    //
    //     return len >= val
    // },
}

const requiredRules = ['required', 'filled', 'required_with', 'required_with_all', 'required_without', 'required_without_all', 'required_if', 'required_unless']
const sizeRules = ['between', 'gt', 'gte', 'lt', 'lte', 'max', 'min', 'size', 'max_if', 'min_if', 'between_if']
const otherRules = ['different', 'in_array', 'required_if', 'required_unless', 'same', 'max_if', 'min_if', 'between_if']
const typeRules = ['numeric', 'integer', 'string', 'array']
const betweenRules = ['between', 'digits_between', 'chs_between']

// 当 values 是字段时的规则
const valueAttributesRules = ['required_with', 'required_with_all', 'required_without', 'required_without_all']

/**
 * 检查类型
 * @param {array} rules
 * @param {array} ruleArray
 * @returns {boolean|string}
 */
function checkInRules(rules, ruleArray) {
    for (let i = 0, len = ruleArray.length; i < len; i++) {
        for (let key in ruleArray[i]) {
            const index = _indexOf(rules, key)
            if (index > -1) {
                return rules[index]
            }
        }
    }
    return false
}

/**
 * 获取属性翻译
 * @param key
 */
function transAttributes(key) {

    const transKey = _toLower(key)

    // 先从 validation.attributes 中找
    const str = _get(langSettings.package, `validation.attributes.${transKey}`, '')

    // 如果没有再从常用字段中找
    return str ? str : _get(langSettings.package, 'g.' + transKey, key)
}

/**
 * 自定义 验证器
 */
function checkRule(data, key, oldValue, ruleKey, ruleValue, valueType, formatMessages, formatAttributes) {

    // 如果为必填字段或值存在, 则继续验证
    if (
        _indexOf(requiredRules, ruleKey) > -1
        || isRequired(oldValue)
    ) {
        // 格式化 number
        const value = toNumberDeep(oldValue)

        // 将规则值转为数组
        const ruleValues = toNumberDeep(_isString(ruleValue) ? _split(ruleValue, ',') : [ruleValue])

        // 替换错误信息的对象
        const replace = {}

        // 如果有 other 值, 则取出 ruleValues 第一个值为 other 值
        const isOther = _indexOf(otherRules, ruleKey) > -1
        let otherKey
        let ohterValue
        if (isOther) {
            otherKey = ruleValues.shift()
            ohterValue = _has(data, otherKey) ? toNumberDeep(data[otherKey]) : null
        }

        // 如果有数据类型 && 如果存在比较条件
        if (valueType && _indexOf(['gt', 'gte', 'lt', 'lte'], ruleKey) > -1) {

            let val = ruleValues[0]

            // 如果值为数字类型
            if (isNumeric(val)) {

            // 否则判断其他字段的值类型
            } else if (
                _isString(val)
                && _has(data, val)
                && data[val] != null
            ) {
                val = data[val]

                // 如果为数字
                if (isNumeric(val)) {
                    val = toNumberDeep(val)

                    // 如果为数组/字符串
                } else if (_isArray(val) || _isString(val)) {
                    val = val.length

                } else {
                    val = 0
                }

            } else {
                val = 0
            }

            ruleValues[0] = val
        }

        // 执行参数
        const params = _assign({
            data,
            key,
            oldValue,
            oldVal: ruleValue,
            type: valueType,
            val: ruleValues[0],
            vals: ruleValues,
        }, replace)

        if (isOther) {
            params.other = ohterValue
            params.otherKey = otherKey
        }

        // 开始验证数据
        const res = ruleMethods[ruleKey](value, params)
        if (!res) {

            // 获取属性值
            let attribute = _get(formatAttributes, key , '')
            if (_isEmpty(attribute)) {
                attribute = transAttributes(key)
            }

            // 获取错误信息
            let message = _get(formatMessages, `${key}.${ruleKey}` , '')
            if (_isEmpty(message)) {

                // 是否是多类型
                const isSizeType = _indexOf(sizeRules, ruleKey) > -1

                message = trans(`validation.${ruleKey}${isSizeType && valueType ? '.' + valueType : ''}`)
            }

            replace.attribute = attribute
            replace.value = _join(ruleValues, ', ')

            // 如果有 other 字段
            if (isOther) {

                let other = _get(formatAttributes, otherKey , '')
                if (_isEmpty(other)) {
                    other = transAttributes(otherKey)
                }
                replace.other = other

                // 如果 other 的值在 values 中
                if (_indexOf(ruleValues, ohterValue) > -1) {
                    replace.value = ohterValue
                }
            }

            // 如果是 value 为字段属性, 则将 values 替换成属性值
            if (_indexOf(valueAttributesRules, ruleKey) > -1) {
                replace.value = _join(_map(ruleValues, function(val) {
                    return transAttributes(val)
                }), ' / ')
            }

            // 如果有 min 和 max 值
            if (_indexOf(betweenRules, ruleKey) > -1) {
                replace.min = ruleValues[0]
                replace.max = ruleValues[1]
            }

            // 替换变量
            for (const key in replace) {
                message = replaceAll(message, ':' + key, replace[key])
            }

            return message
        }
    }
}

// ---------------------------------------------------------------------------------------

/**
 * 规则验证
 */
function onRules(method, value, params) {
    if (!_isFunction(ruleMethods[method])) {
        console.error(`${method} method does not exist`)
        return
    }

    return ruleMethods[method](_isString(value) ? _trim(value) : value, params)
}

/**
 * 验证语言翻译替换
 */
// function transValidation(ruleKey, attribute, replace) {
//     return trans(`validation.${ruleKey}`, Object.assign({
//         attribute: transAttributes(attribute)
//     }, replace))
// }

/**
 * 验证器
 * @param data 验证数据
 * @param {array} rules 验证规则
 * @param {object} messages 自定义错误
 * @param {object} attributes 自定义属性
 */
function validator(data, rules, messages = null, attributes = null) {

    // 格式化自定义错误
    const formatMessages = {}
    if (isFillObject(messages)) {
        for (const key in messages) {
            const keys = _split(key, '.')
            if (keys.length >= 2) {
                if (!_has(formatMessages, keys[0])) {
                    formatMessages[keys[0]] = {}
                }
                formatMessages[keys[0]][keys[1]] = messages[key]
            }
        }
    }

    // 格式化自定义属性
    const formatAttributes = {}
    if (isFillObject(attributes)) {
        for (const key in attributes) {
            formatAttributes[key] = attributes[key]
        }
    }

    if (isFillObject(rules)) {
        for (let key in rules) {

            // 获取单条规则
            let ruleArray = rules[key]

            // 如果为字符串, 则格式化为数组
            if (_isString(ruleArray)) {
                ruleArray = _split(ruleArray, '|')
            }

            // 如果为数组
            if (isFillArray(ruleArray)) {

                const arr = []

                for (const value of ruleArray) {

                    // 如果为字符串
                    if (_isString(value)) {
                        const vals = _split(value, ':')
                        const isLen1 = vals.length === 1
                        if (isLen1 || vals.length === 2) {
                            const obj = {}
                            obj[vals[0]] = isLen1 ? true : vals[1]
                            arr.push(obj)
                        }

                    // 如果为对象
                    } else if (isFillObject(value)) {
                        arr.push(value)
                    }
                }

                if (arr.length) {

                    ruleArray = arr

                    // 克隆一份 data 做为验证数据
                    data = _cloneDeep(data)

                    // 如果有 sizeRules 则需要验证值的 类型, 并且存在 min 或 max
                    let valueType = ''
                    if (checkInRules(sizeRules, ruleArray) !== false) {
                        // 获取值类型
                        valueType = checkInRules(typeRules, ruleArray)
                        if (valueType === false) {
                            valueType = 'string'
                        } else if (valueType === 'integer') {
                            valueType = 'numeric'
                        }
                    }

                    for (let i = 0, len = ruleArray.length; i < len; i++) {

                        // 将单个规则对象转为数组
                        const rule = _toPairs(ruleArray[i])[0]

                        // 是否存在验证方法
                        if (!_has(ruleMethods, rule[0])) {
                            console.error(rule[0] + '验证方法不存在')
                            return
                        }

                        // 判断验证结果
                        const msg = checkRule(
                            data,
                            key,
                            _has(data, key) ? data[key] : null,
                            rule[0],
                            rule[1],
                            valueType,
                            formatMessages,
                            formatAttributes
                        )
                        if (msg) {
                            return {
                                key,
                                msg
                            }
                        }
                    }

                }

            }

        }
    }
}

/**
 * 单个验证器
 * @param {any} value
 * @param {{id: string, token: string}} field
 * @param {string} rule
 * @param {string} message
 * @param {string} attribute
 * @returns {string}
 */
function validate(value, field = '', rule = '', message = '', attribute = null, data = null) {

    if (!isFillObject(data)) {
        data = {}
        data[field] = value
    }

    const rules = {}
    rules[field] = _isEmpty(rule) ? 'required|' + field : rule

    const messages = {}
    if (isFillString(message)) {
        messages[field] = message
    }

    let attributes = {}
    if (isFillString(attribute)) {
        attributes[field] = attribute
    } else if (isFillObject(attribute)) {
        attributes = attribute
    }

    const res = validator(data, rules, messages, attributes)
    if (res) {
        return res.msg
    }

    return ''
}

/**
 * 饿了么 验证器
 */
// utils.ruleValidator = function(params) {
//
//     const para = Object.assign({
//         formData: null,
//         rule: '',
//         message: '',
//         attribute: '',
//         trigger: 'blur',
//         callback: null,
//     }, params)
//
//     return {
//         validator({ field }, value, callback) {
//
//             // 单个验证器
//             const errorMsg = validate(value, field, para.rule, para.message, para.attribute, para.formData)
//             if (errorMsg) {
//                 callback(new Error(errorMsg))
//
//             } else {
//
//                 if (_isFunction(para.callback)) {
//                     const res = para.callback(value, field, callback)
//                     if (res === true) {
//                         callback()
//
//                     } else if (isFillString(res)) {
//                         callback(res)
//                     }
//
//                 } else {
//                     callback()
//                 }
//             }
//         },
//         trigger: para.trigger,
//     }
// }

/**
 * 输入框 change 验证
 */
// utils.inputMethod = {
//
//     /**
//      * 验证数字
//      */
//     number(val, params) {
//         const para = Object.assign({
//             precision: 0,
//         }, params)
//
//         // 原始值
//         const oldVal = _trim(val)
//
//         let newVal = val === undefined ? val : Number(val.replace(/[^-\d.]/g, ''))
//
//         if (newVal !== undefined) {
//
//             const isMin = para.min !== undefined
//             const isMax = para.max !== undefined
//
//             if (isNaN(newVal)) {
//                 if (isMin) {
//                     newVal = para.min
//                 } else {
//                     return ''
//                 }
//             }
//
//             // 格式化小数点
//             newVal = parseFloat(Math.round(newVal * Math.pow(10, para.precision)) / Math.pow(10, para.precision))
//
//             if (!isMin && !isMax && oldVal === '') {
//                 return ''
//             }
//
//             if (isMax && newVal > para.max) {
//                 newVal = para.max
//             }
//
//             if (isMin && newVal < para.min) {
//                 newVal = para.min
//             }
//
//             return newVal.toFixed(para.precision)
//         }
//     },
//
//     /**
//      * 验证日期
//      */
//     date(val, params) {
//         const para = Object.assign({
//             type: 'start',
//             range: 'min'
//         }, params)
//
//         let isStamp = false
//
//         // 如果为数组, 则为时间范围
//         if (Array.isArray(val)) {
//             para.type = 'all'
//
//             if (isNumeric(val[0]) && isNumeric(val[1])) {
//                 isStamp = true
//                 val[0] = _toNumber(val[0])
//                 val[1] = _toNumber(val[1])
//             }
//
//         // 否则为单个时间
//         } else {
//             // 如果为时间戳
//             if (isNumeric(val)) {
//                 isStamp = true
//                 val = _toNumber(val)
//             }
//
//             val = [val, val]
//         }
//
//         const time = _.startEndTime(val, para.range, isStamp)
//
//         if (para.type === 'start') {
//             return isStamp ? time[0] * 1000 : time[0]
//         }
//
//         if (para.type === 'end') {
//             return isStamp ? time[1] * 1000 : time[1]
//         }
//
//         return isStamp ? [time[0] * 1000, time[1] * 1000] : time
//     },
//
//     /**
//      * 数组解构赋值
//      */
//     arrayAssign(val, params) {
//         const para = Object.assign({
//             name: [],
//         }, params)
//
//         if (isFillArray(val) && para.name.length === val.length) {
//             val.forEach((v, index)=>{
//                 this[para.dataName][para.name[index]] = v
//             })
//         }
//     },
// }
//
// utils.inputChange = function(_this, val, params) {
//     const para = Object.assign({
//         dataName: 'formData'
//     }, params)
//
//     if (!para.name) {
//         console.error('inputChange name 没有定义')
//         return
//     }
//
//     if (!para.method) {
//         console.error('inputChange method 没有定义')
//         return
//     }
//
//     if (!_isFunction(utils.inputMethod[para.method])) {
//         console.error(`inputChange ${para.method} 方法不存在`)
//         return
//     }
//
//     const newVal = utils.inputMethod[para.method].call(_this, val, para)
//     if (newVal !== undefined && val != newVal) {
//         if (para.dataName) {
//             _this[para.dataName][para.name] = newVal
//         } else {
//             _this[para.name] = newVal
//         }
//     }
// }

module.exports = {
    rules: onRules,
    validator,
    validate,
}
