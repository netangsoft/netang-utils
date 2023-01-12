const _has = require('lodash/has')
const _get = require('lodash/get')
const _uniq = require('lodash/uniq')
const _toLower = require('lodash/toLower')
const _isNil = require('lodash/isNil')
const _cloneDeep = require('lodash/cloneDeep')
const _isPlainObject = require('lodash/isPlainObject')
const _isFunction = require('lodash/isFunction')
const _orderBy = require('lodash/orderBy')
const _concat = require('lodash/concat')

const BigNumber = require('bignumber.js')

const numberDeep = require('./numberDeep')
const trimString = require('./trimString')
const forEach = require('./forEach')
const forEachRight = require('./forEachRight')
const forIn = require('./forIn')
const isValidValue = require('./isValidValue')
const isFillString = require('./isFillString')
const isFillArray = require('./isFillArray')
const isFillObject = require('./isFillObject')
const indexOf = require('./indexOf')
const isRequired = require('./isRequired')
const toTree = require('./toTree')

/**
 * 检查数据中是否有 key
 */
function itemHasKey(item, key) {
    // 如果数据中没有 key 字段
    if (! _has(item, key)) {
        throw new Error(`Undefined array key "${key}"`)
    }
    return true
}

/**
 * 获取单个数据
 */
function getItemData(item) {

    // 如果数据是集合类型
    if (typeof item === 'object' && _get(item, 'constructor.name') === 'Collection') {
        return item.toArray()
    }

    // 否则为普通数据
    return item
}

/**
 * where 运算
 */
function operatorForWhere(operator, retrieved, value) {

    operator = _toLower(trimString(operator))

    switch (operator) {
        default:
        case '=':
        case '==':
            return retrieved == value
        case '!=':
        case '<>':
            return retrieved != value
        case '<':
            return retrieved < value
        case '>':
            return retrieved > value
        case '<=':
            return retrieved <= value
        case '>=':
            return retrieved >= value
        case '===':
            return retrieved === value
        case '!==':
            return retrieved !== value
        case 'like':
            return indexOf(retrieved, value) > -1
        case 'not like':
            return indexOf(retrieved, value) === -1
    }
}

/**
 * 获取值数组
 */
function getNums(key) {

    const nums = []

    // 如果有值
    if (this.isNotEmpty()) {

        // 如果为普通数组
        if (this._isTypeofArray() && ! this._isObjectInArray) {
            for (const val of this.data) {
                // 如果为有效数字
                if (Number.isFinite(val)) {
                    nums.push(val)
                }
            }

        } else {

            // 如果没有查询字段
            if (! isFillString(key)) {
                throw new Error('key cannot be empty')
            }

            this._each(function (item) {
                if (
                    // 如果存在查询字段
                    itemHasKey(item, key)
                    // 如果为有效数字
                    && Number.isFinite(item[key])
                ) {
                    nums.push(item[key])
                }
            })
        }
    }

    return nums
}

/**
 * 集合
 * 参考文档: https://learnku.com/docs/laravel/9.x/collections/12225
 */
class Collection {

    /**
     * 构造
     */
    constructor(data) {

        // 设置集合底层数据
        this.set(data)

        // 如果为非空
        if (this.isNotEmpty()) {
            // 设置集合底层数据
            this.set(_cloneDeep(this.data))
        }
    }

    /**
     * 如果集合不为空
     */
    isNotEmpty() {

        // 如果类型是数组
        if (this._isTypeofArray()) {
            return this.data.length > 0
        }

        // 否则如果类型为对象
        if (_isPlainObject(this.data)) {
            return isFillObject(this.data)
        }

        // 否则将值设为空数组
        // 设置集合底层数据
        this.set([])

        return false
    }

    /**
     * 如果集合为空
     */
    isEmpty() {
        return ! this.isNotEmpty()
    }

    /**
     * 返回集合底层数据
     */
    all() {
        return this.data
    }

    /**
     * 设置集合底层数据
     */
    set(value) {
        this.data = value
    }

    /**
     * 转换底层数据为 数组 / 对象
     */
    toArray() {

        // 如果数据格式是数组
        if (Array.isArray(this.data)) {
            const arr = []
            for (const item of this.data) {
                // 获取单个数据
                arr.push(getItemData(item))
            }
            return arr
        }

        // 如果数据格式是对象
        if (_isPlainObject(this.data)) {
            const obj = {}
            for (const key in this.data) {
                // 获取单个数据
                obj[key] = getItemData(this.data[key])
            }
            return obj
        }

        // 否则返回数据
        return this.data
    }

    /**
     * 遍历集合中的项目并将每个项目传递给闭包
     * @private
     */
    each(callback) {
        return this._init(function() {

            if (_isFunction(callback)) {
                this._each((item)=> {
                    const res = callback(item)
                    if (res === false) {
                        return true
                    }
                })
            }

            // 返回
            return this
        })
    }

    /**
     * 查询条件
     * @param {string} key 查询字段
     * @param operator 运算符 / 查询值
     * @param value 查询值
     */
    where(key, operator = null, value = null) {
        return this._init(function() {

            // 如果没有查询字段
            if (! isFillString(key)) {
                throw new Error('where key cannot be empty')
            }

            // 创建原始数据
            const raw = this._createRaw()

            if (
                // 如果集合不为空
                this.isNotEmpty()
                // 如果有查询运算符
                && isValidValue(operator, true)
            ) {
                // 如果没有设值, 则说明查询运算符就是值, 则查询运算符为 =
                if (_isNil(value)) {
                    value = operator
                    operator = '='
                }

                this._each((item, index) => {
                    if (
                        // 如果存在查询字段
                        itemHasKey(item, key)
                        // where 运算
                        && operatorForWhere(operator, item[key], value)
                    ) {
                        this._setRaw(raw, item, index)
                    }
                })
            }

            // 设置集合底层数据
            this.set(raw)

            // 返回
            return this
        })
    }

    /**
     * 查询 in 条件
     * @param {string} key 查询字段
     * @param values 查询数组
     */
    whereIn(key, values) {
        return this._init(function() {

            // 如果没有查询字段
            if (! isFillString(key)) {
                throw new Error('whereIn key cannot be empty')
            }

            // 如果没有查询字段
            if (! isFillArray(values)) {
                throw new Error('whereIn values cannot be empty')
            }

            // 创建原始数据
            const raw = this._createRaw()

            // 如果集合不为空
            if (this.isNotEmpty()) {
                this._each((item, index) => {
                    if (
                        // 如果存在查询字段
                        itemHasKey(item, key)
                        // 值在查询数组中
                        && indexOf(values, item[key]) > -1
                    ) {
                        this._setRaw(raw, item, index)
                    }
                })
            }

            // 设置集合底层数据
            this.set(raw)

            // 返回
            return this
        })
    }

    /**
     * 查询 not in 条件
     * @param {string} key 查询字段
     * @param values 查询数组
     */
    whereNotIn(key, values) {
        return this._init(function() {

            // 如果没有查询字段
            if (! isFillString(key)) {
                throw new Error('whereNotIn key cannot be empty')
            }

            // 如果没有查询字段
            if (! isFillArray(values)) {
                throw new Error('whereNotIn values cannot be empty')
            }

            // 创建原始数据
            const raw = this._createRaw()

            // 如果集合不为空
            if (this.isNotEmpty()) {
                this._each((item, index) => {
                    if (
                        // 如果存在查询字段
                        itemHasKey(item, key)
                        // 如果值不在查询数组中
                        && indexOf(values, item[key]) === -1
                    ) {
                        this._setRaw(raw, item, index)
                    }
                })
            }

            // 设置集合底层数据
            this.set(raw)

            // 返回
            return this
        })
    }

    /**
     * 筛选字段
     * @param {Array} keys 查询字段数组
     */
    select(keys) {
        return this._init(function() {

            // 如果有查询字段
            if (! isFillArray(keys)) {
                throw new Error('select keys cannot be empty')
            }

            // 创建原始数据
            const raw = this._createRaw()

            // 如果集合不为空
            if (this.isNotEmpty()) {

                // 别名
                const alias = {}
                forEach(keys, function(key) {
                    key = trimString(key)
                    if (key) {
                        key = _toLower(key)
                        if (indexOf(key, ' as ') > -1) {
                            const arr = key.split(' as ')
                            if (arr.length === 2) {
                                const k = trimString(arr[0])
                                const v = trimString(arr[1])
                                if (k && v) {
                                    alias[k] = v
                                }
                            }
                        } else {
                            alias[key] = key
                        }
                    }
                })

                if (! isFillObject(alias)) {
                    throw new Error('select keys cannot be empty')
                }

                // 如果为普通数组
                if (this._isTypeofArray() && ! this._isObjectInArray()) {

                    // 获取键值数组
                    const keys = numberDeep(Object.keys(alias))

                    forEach(this.data, (item, index) => {
                        if (indexOf(keys, item) > -1) {
                            this._setRaw(raw, item, index)
                        }
                    })

                // 否则为其他
                } else {
                    this._each((item, index) => {

                        const newItem = {}

                        forIn(alias, function (to, from) {
                            // 如果存在查询字段
                            if (itemHasKey(item, from)) {
                                newItem[to] = item[from]
                            }
                        })

                        this._setRaw(raw, newItem, index)
                    })
                }
            }

            // 设置集合底层数据
            this.set(raw)

            // 返回
            return this
        })
    }

    /**
     * 排序
     */
    orderBy(key, direction) {
        return this._init(function() {

            if (
                // 如果集合不为空
                this.isNotEmpty()
                // 数据类型为数组
                && this._isTypeofArray()
            ) {
                // 是否对象数组
                const isObjInArr = this._isObjectInArray()

                // 如果是对象数组
                if (isObjInArr) {
                    // 如果没有排序字段
                    if (! isFillString(key)) {
                        throw new Error('orderBy key cannot be empty')
                    }

                // 否则为普通数组, 则第一个参数就是排序方式
                } else {
                    direction = key
                }

                // 将排序方式转小写
                direction = _toLower(trimString(direction))

                // 如果没有排序方式
                if (indexOf(['desc', 'asc'], direction) === -1) {
                    throw new Error('orderBy direction must be asc or desc')
                }

                // 如果是对象数组
                if (isObjInArr) {
                    // 设置集合底层数据
                    this.set(_orderBy(this.data, [key], [direction]))

                // 否则为普通数组
                } else {
                    const i = direction === 'desc' ? -1 : 1
                    // 设置集合底层数据
                    this.set(this.data.sort(function(a,b) {
                        return a > b ? i : -i
                    }))
                }
            }

            // 返回
            return this
        })
    }

    /**
     * 通过设置键值将数组转对象
     * @param {string} key 字段
     */
    keyBy(key) {
        return this._init(function() {

            // 如果没有查询字段
            if (! isFillString(key)) {
                throw new Error('keyBy key cannot be empty')
            }

            // 创建原始数据
            const raw = {}

            // 如果集合不为空
            if (this.isNotEmpty()) {
                this._each((item) => {
                    // 如果存在查询字段
                    if (itemHasKey(item, key)) {
                        raw[item[key]] = item
                    }
                })
            }

            // 设置集合底层数据
            this.set(raw)

            // 返回
            return this
        })
    }

    /**
     * 反转集合项的顺序
     */
    reverse() {
        return this._init(function() {
            if (
                // 如果集合不为空
                this.isNotEmpty()
                // 数据类型为数组
                && this._isTypeofArray()
            ) {
                // 设置集合底层数据
                // 反转数组数据
                this.set(this.data.reverse())
            }

            // 返回
            return this
        })
    }

    /**
     * 转数组
     */
    values() {
        return this._init(function() {

            // 创建原始数据
            const raw = []

            // 如果集合不为空
            if (this.isNotEmpty()) {

                // 如果类型不是数组, 只有对象才能转数组
                if (! this._isTypeofArray()) {
                    forIn(this.data, function (item) {
                        raw.push(item)
                    })

                    // 设置集合底层数据
                    this.set(raw)
                }

                // 返回
                return this
            }

            // 设置集合底层数据
            this.set(raw)

            // 返回
            return this
        })
    }

    /**
     * 获取集合中指定键对应的所有值
     */
    pluck(key) {
        return this._init(function() {

            // 如果没有查询字段
            if (! isFillString(key)) {
                throw new Error('pluck key cannot be empty')
            }

            const raw = []

            // 如果集合不为空
            if (this.isNotEmpty()) {

                // 如果为普通数组
                if (this._isTypeofArray() && ! this._isObjectInArray()) {

                    // 因为普通数组没有 key 值, 所以不需要转换, 直接返回
                    // 返回
                    return this
                }

                this._each((item) => {
                    // 如果存在查询字段
                    if (itemHasKey(item, key)) {
                        raw.push(item[key])
                    }
                })
            }

            // 设置集合底层数据
            this.set(raw)

            // 返回
            return this
        })
    }

    /**
     * 返回所有唯一项
     * @param {string} key 字段
     */
    unique(key = '') {
        return this._init(function() {

            // 创建原始数据
            const raw = this._createRaw()

            // 如果集合不为空
            if (this.isNotEmpty()) {

                // 如果为普通数组
                if (this._isTypeofArray() && ! this._isObjectInArray()) {

                    // 设置集合底层数据
                    // 普通数组去重
                    this.set(_uniq(this.data))

                // 否则为其他
                } else {

                    // 如果没有查询字段
                    if (! isFillString(key)) {
                        throw new Error('unique key cannot be empty')
                    }

                    // 已存在的值数组
                    const existed = []

                    this._each((item, index) => {
                        if (
                            // 如果存在查询字段
                            itemHasKey(item, key)
                            // 如果值不在已存在值数组中
                            && indexOf(existed, item[key]) === -1
                        ) {
                            existed.push(item[key])
                            this._setRaw(raw, item, index)
                        }
                    })
                }
            }

            // 设置集合底层数据
            this.set(raw)

            // 返回
            return this
        })
    }

    /**
     * 返回一个具有指定数量项目的新集合
     * @param {number} limit 数量
     */
    take(limit) {
        return this._init(function() {

            // 如果没有数量字段
            if (! Number.isFinite(limit) || limit <= 0) {
                throw new Error('take limit cannot be empty')
            }

            // 创建原始数据
            const raw = this._createRaw()

            // 如果集合不为空
            if (this.isNotEmpty()) {

                let num = 0

                this._each((item, index) => {
                    if (num < limit) {
                        num++
                        this._setRaw(raw, item, index)
                    } else {
                        return true
                    }
                })
            }

            // 设置集合底层数据
            this.set(raw)

            // 返回
            return this
        })
    }

    /**
     * 第一个参数传入为 true 时，将执行给定的回调函数
     */
    when(value, callback) {
        return this._init(function() {
            if (value && _isFunction(callback)) {
                return callback(this, value)
            }
            // 返回
            return this
        })
    }

    /**
     * 将一个项目附加到集合的末尾
     */
    push(...value) {
        return this._init(function() {

            // 不是有效值
            if (! isRequired(value)) {
                throw new Error('push value cannot be empty')
            }

            // 数据类型不为数组
            if (! this._isTypeofArray()) {
                throw new Error('data type is not an array')
            }

            // 添加数据
            this.data.push(...value)

            // 返回
            return this
        })
    }

    /**
     * 将一个项目添加到集合的开头
     */
    prepend(...value) {
        return this._init(function() {

            // 不是有效值
            if (! isRequired(value)) {
                throw new Error('prepend value cannot be empty')
            }

            // 数据类型不为数组
            if (! this._isTypeofArray()) {
                throw new Error('data type is not an array')
            }

            // 添加数据
            this.data.unshift(...value)

            // 返回
            return this
        })
    }

    /**
     * 方法将给定的 array 或集合的值附加到另一个集合的末尾
     */
    concat(value) {
        return this._init(function() {

            // 不是有效值
            if (! isRequired(value)) {
                throw new Error('concat value cannot be empty')
            }

            // 数据类型不为数组
            if (! this._isTypeofArray()) {
                throw new Error('data type is not an array')
            }

            // 设置集合底层数据
            // 合并数据
            this.set(_concat(this.data, value))

            // 返回
            return this
        })
    }

    /**
     * 根据指定键对集合项进行分组
     */
    groupBy(key) {
        return this._init(function() {

            // 不是有效值
            if (! isValidValue(key)) {
                throw new Error('groupBy key cannot be empty')
            }

            // 数据类型不为数组
            if (! this._isTypeofArray() || ! this._isObjectInArray) {
                throw new Error('data type is not an object array')
            }

            const group = {}

            for (const item of this.data) {
                // 如果存在查询字段
                if (itemHasKey(item, key)) {
                    if (_has(group, item[key])) {
                        group[item[key]].push(item)
                    } else {
                        group[item[key]] = [item]
                    }
                }
            }

            forIn(group, function (item, key) {
                group[key] = collection(item)
            })

            // 设置集合底层数据
            this.set(group)

            // 返回
            return this
        })
    }

    /**
     * 遍历集合并将每一个值传入给定的回调函数
     */
    map(callback) {
        return this._init(function() {

            // 数据类型不为方法
            if (! _isFunction(callback)) {
                throw new Error('map callback is not function')
            }

            if (
                // 如果集合不为空
                this.isNotEmpty()
                // 数据类型为数组
                && this._isTypeofArray()
            ) {
                // 设置集合底层数据
                this.set(this.data.map(callback))
            }

            // 返回
            return this
        })
    }

    /**
     * ==========【操作源数据并返回结果】====================================================================================
     */

    /**
     * 集合中的项目总数
     */
    count() {
        // 如果集合不为空
        if (this.isNotEmpty()) {

            // 如果是数组
            if (this._isTypeofArray()) {
                return this.data.length
            }

            let num = 0
            forIn(this.data, function() {
                num++
            })
            return num
        }

        return 0
    }

    /**
     * 返回给定键的平均值
     */
    avg(key, callback) {

        // 获取值数组
        const nums = getNums.call(this, key)

        // 值数量
        const length = nums.length
        if (length) {

            // 合计
            let num = BigNumber.sum(...nums)

            // 平均值 = 总值 / 数量
            num = num.dividedBy(length)

            if (_isFunction(callback)) {
                return callback(num, BigNumber)
            }

            return num.toNumber()
        }

        return 0
    }

    /**
     * 返回集合中所有项目的总和
     */
    sum(key, callback) {

        // 获取值
        const nums = getNums.call(this, key)

        if (nums.length) {

            // 合计
            const num = BigNumber.sum(...nums)

            if (_isFunction(callback)) {
                return callback(num, BigNumber)
            }

            return num.toNumber()
        }

        return 0
    }

    /**
     * 返回给定键的最大值
     */
    max(key) {
        // 获取值
        const nums = getNums.call(this, key)
        return nums.length ? BigNumber.maximum(...nums).toNumber() : 0
    }

    /**
     * 返回给定键的最小值
     */
    min(key) {
        // 获取值
        const nums = getNums.call(this, key)
        return nums.length ? BigNumber.minimum(...nums).toNumber() : 0
    }

    /**
     * 方法确定集合中是否存在给定键
     */
    has(key) {

        // 如果没有查询字段
        if (! isValidValue(key)) {
            throw new Error('has key cannot be empty')
        }

        return _has(this.data, key)
    }

    /**
     * 返回指定键的集合项, 如果该键在集合中不存在, 则返回 null
     */
    get(key, defaultValue = null, callback) {

        // 如果没有查询字段
        if (! isValidValue(key)) {
            throw new Error('get key cannot be empty')
        }

        if (_isFunction(defaultValue)) {
            callback = defaultValue
            defaultValue = null
        }

        const res = _get(this.data, key, defaultValue)

        if (_isFunction(callback)) {
            return callback(res)
        }

        return res
    }

    /**
     * 方法连接集合中的项目
     */
    implode(key, separator) {

        // 如果集合不为空
        if (this.isNotEmpty()) {

            // 如果为普通数组
            if (this._isTypeofArray() && ! this._isObjectInArray()) {

                // 如果没有查询字段
                if (! isFillString(key)) {
                    throw new Error('implode separator cannot be empty')
                }

                return this.data.join(key)
            }

            // 如果没有查询字段
            if (! isFillString(key)) {
                throw new Error('implode key cannot be empty')
            }

            // 如果没有 separator 字段
            if (! isFillString(separator)) {
                throw new Error('implode separator cannot be empty')
            }

            const values = []

            this._each(function (item) {
                // 如果存在查询字段
                if (itemHasKey(item, key)) {
                    values.push(item[key])
                }
            })

            return values.join(separator)
        }

        return ''
    }

    /**
     * 返回集合中通过给定真值测试的第一个元素
     */
    first(callback) {
        // 如果集合不为空
        if (this.isNotEmpty()) {
            if (_isFunction(callback)) {
                return this._each(function (value, key) {
                    if (callback(value, key)) {
                        return value
                    }
                })
            }
            return this._each(function (value) {
                return value
            })
        }
        return null
    }

    /**
     * 返回集合中通过给定真值测试的最后一个元素
     */
    last(callback) {
        // 如果集合不为空
        if (this.isNotEmpty()) {

            // 如果数据类型是否为数组
            if (this._isTypeofArray()) {
                if (_isFunction(callback)) {
                    return forEachRight(this.data,function(value, key) {
                        if (callback(value, key)) {
                            return value
                        }
                    })
                }
                return forEachRight(this.data,function(value) {
                    return value
                })
            }

            // 否则为对象, 对象是无序的, 取第一个即可
            return forIn(this.data, function (item) {
                return item
            })
        }
        return null
    }

    /**
     * 返回集合的所有键
     */
    keys() {
        // 如果集合不为空
        if (this.isNotEmpty()) {

            // 如果数据类型是否为数组
            if (this._isTypeofArray()) {
                const keys = []
                forEach(this.data, function (val, key) {
                    keys.push(key)
                })
                return keys
            }

            // 否则为对象
            return numberDeep(Object.keys(this.data), [])
        }

        return []
    }

    /**
     * 删除并返回集合中的最后一项
     */
    pop() {
        // 如果集合不为空
        if (this.isNotEmpty()) {

            // 如果数据类型是否为数组
            if (this._isTypeofArray()) {
                return this.data.pop()
            }

            // 否则为对象, 对象是无序的, 取第一个即可
            const key = forIn(this.data, function (item, key) {
                return key
            })
            if (_has(this.data, key)) {
                const item = this.data[key]
                delete this.data[key]
                return item
            }
        }

        return null
    }

    /**
     * 树数据
     */
    toTree(params) {
        // 如果集合不为空
        if (this.isNotEmpty()) {

            let data = []

            // 如果数据类型为数组
            if (this._isTypeofArray()) {
                data = this.data

            // 否则为对象
            } else {
                forIn(this.data, function(item) {
                    data.push(item)
                })
            }

            return toTree(Object.assign({
                data,
            }, params))
        }
    }

    /**
     * ==========【私有方法】=============================================================================================
     */

    /**
     * 初始化
     * @private
     */
    _init(callback) {
        const ctx = collection(this.data)
        return callback.call(ctx)
    }

    /**
     * 是否类型为数组
     * @private
     */
    _isTypeofArray() {
        return Array.isArray(this.data)
    }

    /**
     * 是否为对象数组
     * @private
     */
    _isObjectInArray() {
        return this._isTypeofArray()
            && this.data.length > 0
            && _isPlainObject(this.data[0])
    }

    /**
     * 创建原始数据
     * @private
     */
    _createRaw() {
        return this._isTypeofArray() ? [] : {}
    }

    /**
     * 添加原始数据
     * @private
     */
    _setRaw(data, value, key) {

        // 如果类型为数组
        if (this._isTypeofArray()) {
            data.push(value)

            // 否则类型为对象
        } else {
            data[key] = value
        }
    }

    /**
     * 遍历数据
     * @private
     */
    _each(cb) {
        return this._isTypeofArray() ? forEach(this.data, cb) : forIn(this.data, cb)
    }
}

/**
 * 集合
 */
function collection(data) {
    return new Collection(data)
}

module.exports = collection