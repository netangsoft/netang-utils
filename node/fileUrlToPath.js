import path from 'path'
import { fileURLToPath } from 'node:url'

export default function fileUrlToPath() {
    const __filename = fileURLToPath(import.meta.url)
    return {
        __filename,
        __dirname: path.dirname(__filename),
    }
}
