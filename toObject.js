import $n_has from 'lodash/has'
import $n_isValidArray from './isValidArray'

/**
 * 数组转对象
 */
export default function toObject(lists = [], type = 'all', idKey = 'id', pidKey = 'pid') {

    const all = {}

    const isLists = $n_isValidArray(lists)
    if (isLists) {
        for (const item of lists) {
            all[item[idKey]] = item
        }
    }

    if (type === 'all') {
        return all
    }

    if (type === 'group') {

        const group = {}

        if (isLists) {
            for (const item of lists) {

                if ($n_has(item, pidKey)) {

                    const pidValue = item[pidKey]

                    if (! $n_has(group, pidValue)) {
                        group[pidValue] = []
                    }

                    group[pidValue].push(item)
                }
            }
        }

        return group
    }

    return {}
}
