import getFileHashSync from './getFileHashSync.js'

/**
 * 获取文件 hash 名称
 */
function getFileHashNameSync(filePath, length = 8) {
    return getFileHashSync(filePath).slice(0, length)
}

export default getFileHashNameSync
