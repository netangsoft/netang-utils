const process = require('process')
const hasArgv = require('./hasArgv')

/**
 * 获取环境变量
 */
function getEnv(newEnv) {

    const env = {}

    // 是否为开发模式
    env.IS_DEV = hasArgv('--dev') || process.env.NODE_ENV !== 'production'
    // 是否为生产模式
    env.IS_PRO = ! env.IS_DEV
    // 是否为 test 模式
    env.IS_TEST = hasArgv('--test')
    // 是否前端
    env.IS_WEB = typeof window !== 'undefined'
    // 是否后端
    env.IS_SERVER = ! env.IS_WEB
    // 永远不可到达
    env.IS_NEVER = false

    // 如果是生产模式
    if (hasArgv('--pro')) {
        env.IS_DEV = false
        env.IS_PRO = true
    }

    Object.assign(env, newEnv)

    // 是否调试模式
    env.IS_DEBUG = env.IS_DEV || env.IS_TEST || hasArgv('--debug')

    return env
}

module.exports = getEnv
