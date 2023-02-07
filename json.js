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
    parse(value) {
        try {
            return JSON.parse(value)
        } catch (e) {}
        return null
    },
}

export default json
