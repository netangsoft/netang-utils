const run = require('./run')
const isRequired = require('./isRequired')

/**
 * callback
 * 回调
 * @param data
 * @param {function} callback
 * @returns {any}
 */
function callback(data, callback) {
    return run(callback)(data, isRequired(data))
}

module.exports = callback
