const { exec } = require('child_process')
const iconv = require('iconv-lite')

/**
 * 执行命令
 */
function runExec(cmd) {
    return new Promise(function(resolve, reject) {
        exec(cmd, { encoding: 'binary' }, function(err, stdout, stderr) {

            if (stdout) {
                stdout = iconv.decode(new Buffer(stdout, 'binary'), 'cp936')
                if (stdout) {
                    console.log('\n[stdout]')
                    console.log(stdout)
                }
            }

            if (stderr) {
                stderr = iconv.decode(new Buffer(stderr, 'binary'), 'cp936')
                if (stderr) {
                    console.log('\n[stderr]')
                    console.log(stderr)
                }
            }

            if (err) {
                console.log('\n[error]')
                console.log(err)
                process.exit(1)
                reject(err)
                return
            }

            resolve(true)
        })
    })
}

module.exports = runExec
