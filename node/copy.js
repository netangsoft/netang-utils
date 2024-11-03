import path from 'path'
import fsCopyFile from './promisify/fsCopyFile.js'
import fsReadlink from './promisify/fsReadlink.js'
import fsSymlink from './promisify/fsSymlink.js'
import fsUnlink from './promisify/fsUnlink.js'
import fileExists from './fileExists.js'
import mkdir from './mkdir.js'
import readdir from './readdir.js'

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
async function copy(src, dest, params) {

    const o = Object.assign({
        // 包含规则
        includes: [],
        // 忽略规则
        ignores: [],
        // 是否包含符号链接
        hasSymbolicLink: false,
        // 是否取消引用符号链接
        // 如果开启, 则获取该符号链接的真正引用地址
        // 如果真正的引用地址并没有引用, 则该复制的符号链接会不存在, 则不会被复制
        dereference: false,
    }, params)

    const dirs = []

    // 创建文件夹
    async function _mkdir(filePath) {
        for (const item of dirs) {
            if (item.indexOf(filePath) > -1) {
                return
            }
        }
        dirs.push(filePath)

        // 创建文件夹
        await mkdir(path.join(dest, filePath.replace(src, '')))
    }

    // 复制链接
    async function _copyLink(srcPath, destPath) {

        let resolvedSrc = await fsReadlink(srcPath)

        // 如果取消引用
        if (o.dereference && resolvedSrc) {
            // 则获取该符号链接的真正引用地址
            // 如果真正的引用地址并没有引用, 则该复制的符号链接会不存在
            resolvedSrc = path.resolve(process.cwd(), resolvedSrc)
        }

        let resolvedDest
        try {
            resolvedDest = await fsReadlink(destPath)
        } catch (e) {

            // dest exists and is a regular file or directory,
            // Windows may throw UNKNOWN error. If dest already exists,
            // fs throws error anyway, so no need to guard against it here.
            if (e.code === 'EINVAL' || e.code === 'UNKNOWN') {
                await fsSymlink(resolvedSrc, destPath)
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
        if (await fileExists(destPath)) {

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

            await fsUnlink(destPath)
        }

        // 生成符号链接
        try {
            await fsSymlink(resolvedSrc, destPath)
        } catch (e) {}
    }

    // 获取所有文件
    const files = await readdir(src, {
        // 包含规则
        includes: o.includes,
        // 忽略规则
        ignores: o.ignores,
        // 是否包含符号链接
        hasSymbolicLink: o.hasSymbolicLink,
        // 包含当前路径
        self: true,
        // 排序
        order: 'desc',
    })

    for (const file of files) {
        // 创建文件夹
        if (file.isDirectory) {
            await _mkdir(file.filePath + '/')
        }
    }

    // 创建目标文件夹
    await mkdir(path.dirname(dest))

    // 遍历复制文件
    for (const file of files) {

        // 如果是文件
        if (file.isFile) {

            // 目标地址
            const destPath = path.join(dest, file.relativePath)

            // 删除已有文件
            try {
                if (await fileExists(destPath)) {
                    await fsUnlink(destPath)
                }
            } catch (e) {}

            // 复制文件
            await fsCopyFile(file.filePath, destPath)

        // 否则判断并复制符号链接
        } else if (
            // 如果包含符号链接
            o.hasSymbolicLink
            // 如果是符号链接
            && file.isSymbolicLink
        ) {
            // 复制链接
            await _copyLink(file.filePath, path.join(dest, file.relativePath))
        }
    }
}

export default copy
