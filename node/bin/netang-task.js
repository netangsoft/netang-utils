#!/usr/bin/env node

const path = require('path')

const $n_startsWith = require('lodash/startsWith')
const $n_has = require('lodash/has')
const $n_runAsync = require('../../cjs/runAsync')
const $n_isValidObject = require('../../cjs/isValidObject')

const rootPath = require('../rootPath')
const dirExists = require('../dirExists')
const fileExists = require('../fileExists')
const readdir = require('../readdir')

// 任务路径
const taskPath = path.join(rootPath, 'task')

/**
 * 运行任务
 */
async function task(cb) {
    try {
        await cb()
    } catch (e) {
        console.log('[error]', e)
    }
}

task(async function() {

    if (! await dirExists(taskPath)) {
        console.log('[task folder does not exist]')
        return
    }

    const tasks = {}
    const files = await readdir(taskPath, { deep: false, self: false })
    for (const { filePath, fileName, isDirectory } of files) {
        if (
            // 如果是文件夹
            isDirectory
            // 如果以 task- 开头
            && $n_startsWith(fileName, 'task-')
        ) {
            const indexPath = path.join(filePath, 'index.js')
            if (! await fileExists(indexPath)) {
                console.log(`index.js in task folder [${fileName}] does not exist` + indexPath)
                continue
            }
            tasks[fileName] = indexPath
        }
    }

    if (! $n_isValidObject(tasks)) {
        console.log('[task folder does not exist]')
        return
    }

    for (const key of process.argv) {
        const taskKey = `task${key}`
        if ($n_has(tasks, taskKey)) {
            await $n_runAsync(require(tasks[taskKey]))()
        }
    }
}).finally()
