import getFileHash from './getFileHash.js'

/**
 * 获取文件 hash 名称
 */
async function getFileHashName(filePath, length = 8) {
    return (await getFileHash(filePath)).slice(0, length)
}

export default getFileHashName
