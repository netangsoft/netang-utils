const path = require('path')
const fsRename = require('./promisify/fsRename')
const remove = require('./remove')
const copy = require('./copy')

/**
 * 移动
 */
async function move(src, dest, params) {

    // 如果来源路径 === 目标路径
    if (src === dest) {
        // 则无任何操作
        return
    }

    // 来源父级目录
    const srcParentDir = path.dirname(src)

    // 目标父级目录
    const destParentDir = path.dirname(dest)

    // 如果父级目录相同
    if (srcParentDir === destParentDir) {

        // 删除目标目录
        await remove(dest)

        // 修改文件名
        await fsRename(src, dest)

        return
    }

    // 复制来源路径至目标路径
    await copy(src, dest, Object.assign({
        // 是否包含符号链接
        hasSymbolicLink: true,
    }, params))

    // 删除来源目录
    await remove(src)
}

module.exports = move
