const crypto = require('crypto')
const fsReadFile = require('./promisify/fsReadFile')

/**
 * 获取文件 hash
 * @param filePath
 * @param algorithm 算法
 * @returns {string}
 */
async function getFileHash(filePath, algorithm = 'md5') {
    return crypto.createHash(algorithm)
        .update(await fsReadFile(filePath))
        .digest('hex')
}

module.exports = getFileHash
