const crypto = require('crypto')
const fsReadFile = require('./promisify/fsReadFile')

/**
 * 获取文件 hash 名称
 */
async function getFileHashName(filePath, length = 8, algorithm = 'md4') {
    return crypto
        .createHash(algorithm)
        .update(await fsReadFile(filePath))
        .digest('hex')
        .slice(0, length)
}

module.exports = getFileHashName
