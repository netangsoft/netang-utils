/**
 * json
 */

const json = {
    stringify(...argv) {
        try {
            return JSON.stringify(...argv)
        } catch (e) {}
        return null
    },
    parse(value, defaultValue = null) {
        try {
            return JSON.parse(value)
        } catch (e) {}
        return defaultValue
    },
}



module.exports = json