const fsRm = require('./promisify/fsRm')
const readdir = require('./readdir')

/**
 * 是否能删除
 */
function isCanRemove(ignorePaths, file) {

    if (file.isFile) {
        return ignorePaths.indexOf(file.filePath) === -1
    }

    for (const item of ignorePaths) {
        if (item.indexOf(file.filePath) > -1) {
            return false
        }
    }

    return true
}

/**
 * 删除文件
 */
async function _fsRm(filePath) {
    await fsRm(filePath, { recursive: true, force: true })
}

/*
 * 删除所有文件
 */
async function remove(filePath, params) {

    const o = Object.assign({
        // 忽略文件路径
        ignorePaths: [],
        // 忽略文件名
        ignoreNames: [],
        // 删除自己
        self: true,
    }, params)

    // 如果删除所有文件
    if (
        o.self
        && ! o.ignorePaths.length
        && ! o.ignoreNames.length
    ) {
        await _fsRm(filePath)
        return
    }

    // 忽略文件路径数组
    const ignorePaths = []

    // 按照 level 倒序获取所有文件
    const files = await readdir(filePath, { self: o.self, order: 'desc' })

    for (const { filePath, fileName } of files) {
        if (
            o.ignoreNames.indexOf(fileName) > -1
            || o.ignorePaths.indexOf(filePath) > -1
        ) {
            ignorePaths.push(filePath)
        }
    }

    // 如果删除所有文件
    if (
        o.self
        && ! ignorePaths.length
    ) {
        await _fsRm(filePath)
        return
    }

    // 遍历删除文件
    for (const file of files) {
        if (isCanRemove(ignorePaths, file)) {
            await _fsRm(file.filePath)
        }
    }
}

module.exports = remove
