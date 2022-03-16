const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const getFileType = require('./getFileType')
const dirExists = require('./dirExists')
const fileExists = require('./fileExists')
const ROOT_PATH = require('./_rootPath')

const TASK_PATH = path.join(ROOT_PATH, 'task')

/**
 * 【node】批量运行任务
 */
async function _task(fn) {
    try {
        console.log('----------[task start]----------')
        await fn()
        console.log('----------[task completed]----------')
    } catch (e) {
        console.log('----------[Error]----------')
        console.log(e)
        console.log('----------[Error]----------')
    }
}
function runTasks() {
    _task(async function() {

        if (! dirExists(TASK_PATH)) {
            console.log('   [task folder does not exist]')
            return
        }

        const tasks = {}
        const files = fs.readdirSync(TASK_PATH)
        for (let file of files) {
            if (_.startsWith(file, 'task-')) {
                const childPath = path.join(TASK_PATH, file)
                const childType = getFileType(childPath)
                if (childType === 'dir') {
                    const indexPath = path.join(childPath, 'index.js')
                    if (! fileExists(indexPath)) {
                        console.log('   [任务文件夹中的 index.js 不存在]' + indexPath)
                        continue
                    }
                    tasks[file] = require(indexPath)
                }
            }
        }

        for (let key of process.argv) {
            const taskKey = `task${key}`
            if (_.has(tasks, taskKey)) {
                await tasks[taskKey]()
            }
        }
    }).finally()
}

module.exports = runTasks
