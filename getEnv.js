const process = require('process')
const _assign = require('lodash/assign')
const hasArgv = require('./hasArgv')

/**
 * 【node】获取环境变量
 */
function getEnv(newEnv) {

    const env = {}

    // 是否为 win 模式
    env.IS_WIN = hasArgv('--win')
    // 是否为 mac 模式
    env.IS_MAC = hasArgv('--mac')
    // 是否为 linux 模式
    env.IS_LINUX = hasArgv('--linux')
    // 是否为开发模式
    env.IS_DEV = hasArgv('--dev') || process.env.NODE_ENV !== 'production'
    // 是否为生产模式
    env.IS_PRO = ! env.IS_DEV
    // 是否为 test 模式
    env.IS_TEST = hasArgv('--test') ? true : env.IS_DEV
    // 是否打包模式
    env.IS_PACK = hasArgv('--pack')
    // 是否 32 位(否则 64 位)
    env.IS_ARCH32 = env.IS_WIN && hasArgv('--ia32')
    // 是否开启开发者工具(仅非测试模式有效)
    env.IS_DTOOLS = hasArgv('--dtools')
    // 永远不可到达
    env.IS_NEVER = false

    // 如果是生产模式
    if (hasArgv('--pro')) {
        env.IS_DEV = false
        env.IS_PRO = true
        env.IS_TEST = false
    }

    _assign(env, newEnv)

    return env
}

module.exports = getEnv
