const pump = require('pump')

/**
 * 【node】pumps
 */
function pumps(...args) {
    return new Promise(function(resolve, reject) {
        pump(...args, function(error) {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        })
    })
}

module.exports = pumps
