/**
 * json 解析 BigInt 数字为字符串
 * 参考： https://github.com/sidorares/json-bigint
 */

const suspectProtoRx = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/
const suspectConstructorRx = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/

const json_parse = function () {

    // The dashboard of the current character
    let at

    // The current character
    let ch

    let text

    const escapee = {
        '"': '"',
        '\\': '\\',
        '/': '/',
        b: '\b',
        f: '\f',
        n: '\n',
        r: '\r',
        t: '\t',
    }

    // Call error when something is wrong.
    function error(message) {
        throw {
            name: 'SyntaxError',
            message,
            at,
            text,
        }
    }

    // If a c parameter is provided, verify that it matches the current character.
    function next(c) {

        if (c && c !== ch) {
            error("Expected '" + c + "' instead of '" + ch + "'")
        }

        // Get the next character. When there are no more characters,
        // return the empty string.

        ch = text.charAt(at)
        at += 1
        return ch
    }

    // Parse a number value.
    function number() {

        let number,
            string = ''

        if (ch === '-') {
            string = '-'
            next('-')
        }

        while (ch >= '0' && ch <= '9') {
            string += ch
            next()
        }

        if (ch === '.') {
            string += '.'
            while (next() && ch >= '0' && ch <= '9') {
                string += ch
            }
        }

        if (ch === 'e' || ch === 'E') {
            string += ch
            next()
            if (ch === '-' || ch === '+') {
                string += ch
                next()
            }
            while (ch >= '0' && ch <= '9') {
                string += ch
                next()
            }
        }

        number = +string

        if (!isFinite(number)) {
            error('Bad number')

        } else {
            if (string.length > 15) {
                return string
            }
            return number
        }
    }

    // Parse a string value.
    function string() {

        let hex,
            i,
            string = '',
            uffff

        // When parsing for string values, we must look for " and \ characters.

        if (ch === '"') {
            let startAt = at
            while (next()) {
                if (ch === '"') {
                    if (at - 1 > startAt) string += text.substring(startAt, at - 1)
                    next()
                    return string
                }
                if (ch === '\\') {
                    if (at - 1 > startAt) string += text.substring(startAt, at - 1)
                    next()
                    if (ch === 'u') {
                        uffff = 0
                        for (i = 0; i < 4; i += 1) {
                            hex = parseInt(next(), 16)
                            if (!isFinite(hex)) {
                                break
                            }
                            uffff = uffff * 16 + hex
                        }
                        string += String.fromCharCode(uffff)
                    } else if (typeof escapee[ch] === 'string') {
                        string += escapee[ch]
                    } else {
                        break
                    }
                    startAt = at
                }
            }
        }
        error('Bad string')
    }

    // Skip whitespace.
    function white() {

        while (ch && ch <= ' ') {
            next()
        }
    }

    // true, false, or null.
    function word() {

        switch (ch) {
            case 't':
                next('t')
                next('r')
                next('u')
                next('e')
                return true
            case 'f':
                next('f')
                next('a')
                next('l')
                next('s')
                next('e')
                return false
            case 'n':
                next('n')
                next('u')
                next('l')
                next('l')
                return null
        }
        error("Unexpected '" + ch + "'")
    }

    // Parse an array value.
    function array() {

        const array = []

        if (ch === '[') {
            next('[')
            white()
            if (ch === ']') {
                next(']')
                return array // empty array
            }
            while (ch) {
                array.push(value())
                white()
                if (ch === ']') {
                    next(']')
                    return array
                }
                next(',')
                white()
            }
        }
        error('Bad array')
    }

    // Parse an object value.
    function object() {

        let key
        const object = Object.create(null)

        if (ch === '{') {
            next('{')
            white()

            if (ch === '}') {
                next('}')
                return object // empty object
            }

            while (ch) {
                key = string()
                white()
                next(':')

                if (Object.hasOwnProperty.call(object, key)) {
                    error('Duplicate key "' + key + '"')
                }

                if (suspectProtoRx.test(key) === true) {
                    // if (_options.protoAction === 'error') {
                        error('Object contains forbidden prototype property')
                    // } else if (_options.protoAction === 'ignore') {
                    //     value()
                    // } else {
                    //     object[key] = value()
                    // }
                } else if (suspectConstructorRx.test(key) === true) {
                    // if (_options.constructorAction === 'error') {
                        error('Object contains forbidden constructor property')
                    // } else if (_options.constructorAction === 'ignore') {
                    //     value()
                    // } else {
                    //     object[key] = value()
                    // }
                } else {
                    object[key] = value()
                }

                white()
                if (ch === '}') {
                    next('}')
                    return object
                }
                next(',')
                white()
            }
        }
        error('Bad object')
    }

    // Parse a JSON value. It could be an object, an array, a string, a number,
    // or a word.
    function value() {

        white()
        switch (ch) {
            case '{':
                return object()
            case '[':
                return array()
            case '"':
                return string()
            case '-':
                return number()
            default:
                return ch >= '0' && ch <= '9' ? number() : word()
        }
    }

    // Return the json_parse function. It will have access to all of the above
    // functions and variables.

    return function (source, reviver) {

        text = source + ''
        at = 0
        ch = ' '
        const result = value()
        white()
        if (ch) {
            error('Syntax error')
        }
        return result
    }
}

const json = {
    stringify(...value) {
        try {
            return JSON.stringify(...value)
        } catch (e) {}
        return null
    },
    parse(value) {
        try {
            return json_parse()(value)
        } catch (e) {}
        return null
    },
}

module.exports = json
