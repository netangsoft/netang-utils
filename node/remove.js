const readdir = require('./readdir')
const fsUnlink = require('./promisify/fsUnlink')
const fsRmdir = require('./promisify/fsRmdir')

/*
 * 删除所有文件
 */
async function remove(filePath, params) {

    // 按照 level 倒序获取所有文件
    const files = await readdir(filePath, Object.assign(
        {
            // 包含规则
            includes: [],
            // 忽略规则
            ignores: [],
            // 是否包含当前路径
            self: true,
            // 包含系统文件
            // 获取所有文件包含(块设备 / 字符设备 / 符号链接 / FIFO / UNIX 套接字)
            hasSystemFiles: true,
        },
        params,
        {
            // 排序
            order: 'desc',
        }
    ))

    for (const { isDirectory, filePath } of files) {

        // 如果是文件夹
        if (isDirectory) {

            // 删除文件夹
            await fsRmdir(filePath)

        // 否则是文件
        } else {

            // 删除文件
            await fsUnlink(filePath)
        }
    }
}

module.exports = remove
