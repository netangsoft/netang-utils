import path from 'path'
import fileUrlToPath from './fileUrlToPath.js'

/**
 * 获取根路径
 */
const rootPath = path.join(fileUrlToPath().__dirname, '../../../../')

export default rootPath
