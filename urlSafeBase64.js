/**
 * URL 安全的 Base64编码
 */
export default {

    /**
     * 编码
     * @param value
     * @returns {string}
     */
    encode(value) {
        return value.replace(/\//g, '_')
            .replace(/\+/g, '-')
    },

    /**
     * 解码
     * @param value
     * @returns {string}
     */
    decode(value) {
        return value.replace(/_/g, '/')
            .replace(/-/g, '+');
    },
}
