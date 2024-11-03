import path from 'path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 获取根路径
 */
const rootPath = path.join(__dirname, '../../../../')

export default rootPath
