import { exec } from 'node:child_process'
import iconv from 'iconv-lite'

/**
 * 执行命令
 */
function runExec(cmd, showConsoleLog = true) {
    return new Promise(function(resolve, reject) {
        exec(cmd, { encoding: 'binary' }, function(err, stdout, stderr) {

            if (stdout) {
                stdout = iconv.decode(new Buffer(stdout, 'binary'), 'cp936')
                if (stdout && showConsoleLog) {
                    console.log('\n[stdout]')
                    console.log(stdout)
                }
            }

            if (stderr) {
                stderr = iconv.decode(new Buffer(stderr, 'binary'), 'cp936')
                if (stderr && showConsoleLog) {
                    console.log('\n[stderr]')
                    console.log(stderr)
                }
            }

            if (err) {
                if (showConsoleLog) {
                    console.log('\n[error]')
                    console.log(err)
                }
                process.exit(1)
                reject(err)
                return
            }

            resolve(true)
        })
    })
}

export default runExec
