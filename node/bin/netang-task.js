#!/usr/bin/env node

import path from 'path'
import { createRequire } from 'node:module'

import $n_startsWith from 'lodash/startsWith.js'
import $n_has from 'lodash/has.js'

import $n_runAsync from '../../runAsync.js'
import $n_isValidObject from '../../isValidObject.js'

import rootPath from '../rootPath.js'
import dirExists from '../dirExists.js'
import fileExists from '../fileExists.js'
import readdir from '../readdir.js'

// 任务路径
const taskPath = path.join(rootPath, 'task')

// require
const _require = createRequire(import.meta.url)

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
            const res = await import('file:///' + tasks[taskKey])
            await $n_runAsync(res.default ? res.default : res)()
        }
    }
}).finally()
