const path = require('path')
const readdirSync = require('../node/readdirSync')
const readdir = require('../node/readdir')

async function fn() {

    const files = await readdir(path.join(__dirname, '../'), {
        // 包含规则
        includes: [
            '.internal/**/*.*',
            'locale/**/*.*',
            '*.js',
        ],
        // 忽略规则
        ignores: [
            '.internal/_buildImportFile.js',
        ],
    })

// const src = [
//     '!node',
//     '!cjs',
//     '!build',
//     '!node_modules'
// ]

    console.log('------------------------------------------------------------')
    for (const { fileName, relativePath, filePath } of files) {
        // const res = minimatch(relativePath, '!node/**/*.text')
        // const res = minimatch(relativePath, '**/3*.text')
        // if (res) {
        console.log(relativePath)
        // }
    }
    console.log('------------------------------------------------------------')
}

fn()

