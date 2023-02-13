const path = require('path')
const fs = require('fs')
const fileExistsSync = require('./fileExistsSync')
const mkdirSync = require('./mkdirSync')
const readdirSync = require('./readdirSync')

// prevent copy if src is a subdir of dest since unlinking
// dest in this case would result in removing src contents
// and therefore a broken symlink would be created.
function isSrcSubdir(src, dest) {
    const srcArr = path.resolve(src).split(path.sep).filter(i => i)
    const destArr = path.resolve(dest).split(path.sep).filter(i => i)
    return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true)
}

/**
 * 复制
 */
function copySync(src, dest, params) {

    const o = Object.assign({
        // 忽略文件路径
        ignorePaths: [],
        // 忽略文件名
        ignoreNames: [],
        // 是否包含符号链接
        hasSymbolicLink: false,
        // 是否取消引用符号链接
        // 如果开启, 则获取该符号链接的真正引用地址
        // 如果真正的引用地址并没有引用, 则该复制的符号链接会不存在
        dereference: false,
    }, params)

    const dirs = []

    // 创建文件夹
    function _mkdir(filePath) {
        for (const item of dirs) {
            if (item.indexOf(filePath) > -1) {
                return
            }
        }
        dirs.push(filePath)

        // 创建文件夹
        mkdirSync(path.join(dest, filePath.replace(src, '')))
    }

    // 复制链接
    function _copyLink(srcPath, destPath) {

        let resolvedSrc = fs.readlinkSync(srcPath)

        // 如果取消引用
        if (o.dereference && resolvedSrc) {
            // 则获取该符号链接的真正引用地址
            // 如果真正的引用地址并没有引用, 则该复制的符号链接会不存在
            resolvedSrc = path.resolve(process.cwd(), resolvedSrc)
        }

        let resolvedDest
        try {
            resolvedDest = fs.readlinkSync(destPath)
        } catch (e) {

            // dest exists and is a regular file or directory,
            // Windows may throw UNKNOWN error. If dest already exists,
            // fs throws error anyway, so no need to guard against it here.
            if (e.code === 'EINVAL' || e.code === 'UNKNOWN') {
                fs.symlinkSync(resolvedSrc, destPath)
                return
            }
        }

        // 如果取消引用
        if (o.dereference && resolvedDest) {
            // 则获取该符号链接的真正引用地址
            // 如果真正的引用地址并没有引用, 则该复制的符号链接会不存在
            resolvedDest = path.resolve(process.cwd(), resolvedDest)
        }

        // 删除已有目标符号链接
        if (fileExistsSync(destPath)) {

            if (
                resolvedSrc
                && resolvedDest
                && (
                    isSrcSubdir(resolvedSrc, resolvedDest)
                    || isSrcSubdir(resolvedDest, resolvedSrc)
                )
            ) {
                return
            }

            fs.unlinkSync(destPath)
        }

        // 生成符号链接
        try {
            fs.symlinkSync(resolvedSrc, destPath)
        } catch (e) {}
    }

    // 获取所有文件
    const files = readdirSync(src, {
        // 是否包含当前路径
        self: true,
        // 忽略文件路径
        ignorePaths: o.ignorePaths,
        // 忽略文件名
        ignoreNames: o.ignoreNames,
        // 排序
        order: 'desc',
        // 是否包含符号链接
        hasSymbolicLink: o.hasSymbolicLink,
    })

    for (const file of files) {
        // 创建文件夹
        if (file.isDirectory) {
            _mkdir(file.filePath + '/')
        }
    }

    // 遍历复制文件
    for (const file of files) {

        // 如果是文件
        if (file.isFile) {

            // 目标地址
            const destPath = path.join(dest, file.relativePath)

            // 删除已有文件
            try {
                if (fileExistsSync(destPath)) {
                    fs.unlinkSync(destPath)
                }
            } catch (e) {}

            // 复制文件
            fs.copyFileSync(file.filePath, destPath)

        // 否则判断并复制符号链接
        } else if (
            // 如果包含符号链接
            o.hasSymbolicLink
            // 如果是符号链接
            && file.isSymbolicLink
        ) {
            // 复制链接
            _copyLink(file.filePath, path.join(dest, file.relativePath))
        }
    }
}

module.exports = copySync
