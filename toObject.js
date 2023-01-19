const _has = require('lodash/has')
const isValidArray = require('./isValidArray')

/**
 * 数组转对象
 */

function toObject(lists = [], type = 'all', idKey = 'id', pidKey = 'pid') {

    const all = {}

    const isLists = isValidArray(lists)
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

                if (_has(item, pidKey)) {

                    const pidValue = item[pidKey]

                    if (! _has(group, pidValue)) {
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

module.exports = toObject
