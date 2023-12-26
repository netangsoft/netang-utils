/**
 * promise
 */
function promise(cb) {
    return new Promise(function (resolve, reject) {
        cb(resolve, reject)
    })
}

module.exports = promise