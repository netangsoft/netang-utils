const _ = require('lodash')
const isFillArray = require('./isFillArray')

/**
 * 数组转对象
 */

function toObject(lists = [], type = 'all', idKey = 'id', pidKey = 'pid') {

    if (! isFillArray(lists)) {
        return {}
    }

    const all = {}

    for (const item of lists) {
        all[item[idKey]] = item
    }

    if (type === 'all') {
        return all
    }

    if (type === 'group') {

        const group = {}

        for (const item of lists) {
            if (_.has(item, pidKey)) {

                const key = _.has(all, `${pidKey}.${idKey}`) ? all[pidKey][idKey] : item[pidKey]

                if (_.has(group, key)) {
                    group[key].push(item)
                } else {
                    group[key] = [item]
                }
            }
        }

        return group
    }

    return {}
}

module.exports = toObject
