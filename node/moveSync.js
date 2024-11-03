import path from 'path'
import fs from 'fs'
import removeSync from './removeSync.js'
import copySync from './copySync.js'

/**
 * 移动
 */
function moveSync(src, dest, params) {

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
        removeSync(dest)

        // 修改文件名
        fs.renameSync(src, dest)

        return
    }

    // 复制来源路径至目标路径
    copySync(src, dest, Object.assign({
        // 是否包含符号链接
        hasSymbolicLink: true,
    }, params))

    // 删除来源目录
    removeSync(src)
}

export default moveSync
