const gulp = require('gulp')
const gulpIgnore = require('gulp-ignore')
const uglify = require('gulp-terser')
const pumps = require('./pumps')

/**
 * 压缩文件
 */
async function uglifyJs(srcPath, destPath, ignoreCondition) {

    const opts = [
        gulp.src(srcPath),
    ]

    if (! Array.isArray(ignoreCondition) || ignoreCondition.length === 0) {
        opts.push(gulpIgnore.exclude(ignoreCondition))
    }

    opts.push(
        // terser 文档
        // https://github.com/terser/terser#format-options
        uglify({
            // 在顶级作用域中删除未引用的函数
            toplevel: true,
            parse: {
                // 支持顶级return语句
                bare_returns: true,
            },
            compress: {
                // 删除 console
                drop_console: true,
                // 删除 debugger
                drop_debugger: true,
                // 优化 if/return 和 if/continue
                if_return: true,
            },
            format: {
                // 去除注释
                comments: false,
            }
        }),

        gulp.dest(destPath),
    )

    await pumps(opts)
}

module.exports = uglifyJs
