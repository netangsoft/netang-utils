const TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

module.exports = {

    /**
     * 编码
     * @param input
     * @returns {string}
     */
    encode(input) {
        input = String(input)
        if (/[^\0-\xFF]/.test(input)) {
            throw new TypeError('Malformed base64');
        }
        let padding = input.length % 3
        let output = ''
        let position = -1
        let a
        let b
        let c
        let buffer
        let length = input.length - padding

        while (++position < length) {
            a = input.charCodeAt(position) << 16
            b = input.charCodeAt(++position) << 8
            c = input.charCodeAt(++position)
            buffer = a + b + c
            output += (
                TABLE.charAt(buffer >> 18 & 0x3F) +
                TABLE.charAt(buffer >> 12 & 0x3F) +
                TABLE.charAt(buffer >> 6 & 0x3F) +
                TABLE.charAt(buffer & 0x3F)
            )
        }

        if (padding === 2) {
            a = input.charCodeAt(position) << 8
            b = input.charCodeAt(++position)
            buffer = a + b
            output += (
                TABLE.charAt(buffer >> 10) +
                TABLE.charAt((buffer >> 4) & 0x3F) +
                TABLE.charAt((buffer << 2) & 0x3F) +
                '='
            );
        } else if (padding === 1) {
            buffer = input.charCodeAt(position)
            output += (
                TABLE.charAt(buffer >> 2) +
                TABLE.charAt((buffer << 4) & 0x3F) +
                '=='
            )
        }

        return output
    },

    /**
     * 解码
     * @param input
     * @returns {string}
     */
    decode(input) {
        input = String(input).replace(/[\t\n\f\r ]/g, '')

        let length = input.length

        if (length % 4 === 0) {
            input = input.replace(/==?$/, '')
            length = input.length
        }

        if (
            length % 4 === 1
            || /[^+a-zA-Z0-9/]/.test(input)
        ) {
            throw new TypeError('Invalid character')
        }

        let bitCounter = 0
        let bitStorage
        let buffer
        let output = ''
        let position = -1
        while (++position < length) {
            buffer = TABLE.indexOf(input.charAt(position));
            bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer
            if (bitCounter++ % 4) {
                output += String.fromCharCode(
                    0xFF & bitStorage >> (-2 * bitCounter & 6)
                )
            }
        }
        return output
    },
}
