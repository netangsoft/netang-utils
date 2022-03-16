const fs = require('fs')
const minimatch = require('minimatch')
const _concat = require('lodash/concat')
const _has = require('lodash/has')
const traverseFiles = require('../traverseFiles')
const isFillObject = require('../isFillObject')
const delFile = require('../delFile')

function checkMath(filePath, fileName, conditions) {
    for (const condition of conditions) {
        if (filePath === condition || minimatch(fileName, condition)) {
            return true
        }
    }
    return false
}

/**
 * 【node】nodeModulesClean 清理
 */
function nodeModulesClean(nodeModulesPath, delFiles = [], delDirs = []) {

    // 需清理的文件
    delFiles = _concat([
        'Makefile',
        'README',
        'README.md',
        'CHANGELOG',
        'CHANGELOG.md',
        '.editorconfig',
        '.gitmodules',
        '.gitattributes',
        'robot.html',
        '.lint',
        'Gulpfile.js',
        'Gruntfile.js',
        '.tern-project',
        '.editorconfig',
        '.eslintrc',
        '.jshintrc',
        '.npmignore',
        '.flowconfig',
        '.documentup.json',
        '.yarn-metadata.json',
        '.travis.yml',
        'thumbs.db',
        '.tern-port',
        '.ds_store',
        'desktop.ini',
        'npm-debug.log',
        '.npmrc',
        'LICENSE.txt',
        'LICENSE.md',
        'LICENSE-MIT',
        'LICENSE-MIT.txt',
        'LICENSE.BSD',
        'LICENSE-BSD',
        'LICENSE-jsbn',
        'LICENSE',
        'AUTHORS',
        'CONTRIBUTORS',
        '.yarn-integrity',
        'builderror.log',
        '*.md',
        '*.sln',
        '*.obj',
        '*.gypi',
        '*.vcxproj',
        '*.vcxproj.filters',
        '*.ts',
        '*.jst',
        '*.coffee',
        '*.map',
        '*.MIT',
        '*.lock',
        '*.mjs',
        '*.markdown',
        '*.bnf',
        '*.yml',
        '*.APACHE2',
        '*.nix',
        '*.patch',
        'example.js',
        'tsconfig.json',
        'tslint.json',
        'package-support.json',
        'README.txt',
        'MIT-LICENSE.txt',
        'CopyrightNotice.txt',
        'gulpfile.js',
    ], delFiles)

    // 需清理的文件夹
    delDirs = _concat([
        '__tests__',
        'test',
        'tests',
        'powered-test',
        'docs',
        'doc',
        'website',
        'images',
        'assets',
        'example',
        'examples',
        'coverage',
        'node-gyp',
        'node-pre-gyp',
        'gyp',
        '.nyc_output',
    ], delDirs)

    // 遍历文件
    const lists = traverseFiles(nodeModulesPath)
    for (const item of lists) {

        const {
            filePath,
            fileName,
            isFile,
        } = item

        // 如果是文件
        if (isFile) {

            // 是否删除文件
            if (checkMath(filePath, fileName, delFiles)) {
                delFile(filePath)

            // 精简 package.json
            } else if (fileName === 'package.json') {

                const packageJson = require(filePath)

                const newJson = {}

                if (_has(packageJson, 'version')) {
                    newJson.version = packageJson.version
                }

                if (_has(packageJson, 'main')) {
                    newJson.main = packageJson.main
                }

                if (isFillObject(newJson)) {
                    fs.writeFileSync(filePath, JSON.stringify(newJson))
                } else {
                    fs.unlinkSync(filePath)
                }
            }

        // 否则是文件夹
        } else if (checkMath(filePath, fileName, delDirs)) {
            delFile(filePath)
        }
    }
}

module.exports = nodeModulesClean
