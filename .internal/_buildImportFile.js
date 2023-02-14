const path = require('path')
const readdir = require('../node/readdir')
const writeFile = require('../node/writeFile')

// lodash 所有方法
const lodashKeys = [
    'add',
    'after',
    'ary',
    'assign',
    'assignIn',
    'assignInWith',
    'assignWith',
    'at',
    'attempt',
    'before',
    'bind',
    'bindAll',
    'bindKey',
    'camelCase',
    'capitalize',
    'castArray',
    'ceil',
    'chain',
    'chunk',
    'clamp',
    'clone',
    'cloneDeep',
    'cloneDeepWith',
    'cloneWith',
    'commit',
    'compact',
    'concat',
    'cond',
    'conforms',
    'conformsTo',
    'constant',
    'countBy',
    'create',
    'curry',
    'curryRight',
    'debounce',
    'deburr',
    'defaults',
    'defaultsDeep',
    'defaultTo',
    'defer',
    'delay',
    'difference',
    'differenceBy',
    'differenceWith',
    'divide',
    'drop',
    'dropRight',
    'dropRightWhile',
    'dropWhile',
    'each',
    'eachRight',
    'endsWith',
    'entries',
    'entriesIn',
    'eq',
    'escape',
    'escapeRegExp',
    'every',
    'extend',
    'extendWith',
    'fill',
    'filter',
    'find',
    'findIndex',
    'findKey',
    'findLast',
    'findLastIndex',
    'findLastKey',
    'first',
    'flatMap',
    'flatMapDeep',
    'flatMapDepth',
    'flatten',
    'flattenDeep',
    'flattenDepth',
    'flip',
    'floor',
    'flow',
    'flowRight',
    'forEach',
    'forEachRight',
    'forIn',
    'forInRight',
    'forOwn',
    'forOwnRight',
    'fp',
    'fromPairs',
    'functions',
    'functionsIn',
    'get',
    'groupBy',
    'gt',
    'gte',
    'has',
    'hasIn',
    'head',
    'identity',
    'includes',
    'indexOf',
    'initial',
    'inRange',
    'intersection',
    'intersectionBy',
    'intersectionWith',
    'invert',
    'invertBy',
    'invoke',
    'invokeMap',
    'isArguments',
    'isArray',
    'isArrayBuffer',
    'isArrayLike',
    'isArrayLikeObject',
    'isBoolean',
    'isBuffer',
    'isDate',
    'isElement',
    'isEmpty',
    'isEqual',
    'isEqualWith',
    'isError',
    'isFinite',
    'isFunction',
    'isInteger',
    'isLength',
    'isMap',
    'isMatch',
    'isMatchWith',
    'isNaN',
    'isNative',
    'isNil',
    'isNull',
    'isNumber',
    'isObject',
    'isObjectLike',
    'isPlainObject',
    'isRegExp',
    'isSafeInteger',
    'isSet',
    'isString',
    'isSymbol',
    'isTypedArray',
    'isUndefined',
    'isWeakMap',
    'isWeakSet',
    'iteratee',
    'join',
    'kebabCase',
    'keyBy',
    'keys',
    'keysIn',
    'lang',
    'last',
    'lastIndexOf',
    'lowerCase',
    'lowerFirst',
    'lt',
    'lte',
    'map',
    'mapKeys',
    'mapValues',
    'matches',
    'matchesProperty',
    'math',
    'max',
    'maxBy',
    'mean',
    'meanBy',
    'memoize',
    'merge',
    'mergeWith',
    'method',
    'methodOf',
    'min',
    'minBy',
    'mixin',
    'multiply',
    'negate',
    'next',
    'noop',
    'now',
    'nth',
    'nthArg',
    'omit',
    'omitBy',
    'once',
    'orderBy',
    'over',
    'overArgs',
    'overEvery',
    'overSome',
    'pad',
    'padEnd',
    'padStart',
    'parseInt',
    'partial',
    'partialRight',
    'partition',
    'pick',
    'pickBy',
    'plant',
    'property',
    'propertyOf',
    'pull',
    'pullAll',
    'pullAllBy',
    'pullAllWith',
    'pullAt',
    'random',
    'range',
    'rangeRight',
    'rearg',
    'reduce',
    'reduceRight',
    'reject',
    'remove',
    'repeat',
    'replace',
    'rest',
    'result',
    'reverse',
    'round',
    'sample',
    'sampleSize',
    'seq',
    'set',
    'setWith',
    'shuffle',
    'size',
    'slice',
    'snakeCase',
    'some',
    'sortBy',
    'sortedIndex',
    'sortedIndexBy',
    'sortedIndexOf',
    'sortedLastIndex',
    'sortedLastIndexBy',
    'sortedLastIndexOf',
    'sortedUniq',
    'sortedUniqBy',
    'split',
    'spread',
    'startCase',
    'startsWith',
    'stubArray',
    'stubFalse',
    'stubObject',
    'stubString',
    'stubTrue',
    'subtract',
    'sum',
    'sumBy',
    'tail',
    'take',
    'takeRight',
    'takeRightWhile',
    'takeWhile',
    'tap',
    'template',
    'templateSettings',
    'throttle',
    'thru',
    'times',
    'toArray',
    'toFinite',
    'toInteger',
    'toIterator',
    'toJSON',
    'toLength',
    'toLower',
    'toNumber',
    'toPairs',
    'toPairsIn',
    'toPath',
    'toPlainObject',
    'toSafeInteger',
    'toString',
    'toUpper',
    'transform',
    'trim',
    'trimEnd',
    'trimStart',
    'truncate',
    'unary',
    'unescape',
    'union',
    'unionBy',
    'unionWith',
    'uniq',
    'uniqBy',
    'uniqueId',
    'uniqWith',
    'unset',
    'unzip',
    'unzipWith',
    'update',
    'updateWith',
    'upperCase',
    'upperFirst',
    'value',
    'valueOf',
    'values',
    'valuesIn',
    'without',
    'words',
    'wrap',
    'wrapperAt',
    'wrapperChain',
    'wrapperLodash',
    'wrapperReverse',
    'wrapperValue',
    'xor',
    'xorBy',
    'xorWith',
    'zip',
    'zipObject',
    'zipObjectDeep',
    'zipWith',
]

/**
 * 生成引入配置文件
 */
module.exports = async function (params) {

    const o = Object.assign({
        // utils 包含文件列表
        utils: [],
        // vue 包含文件列表
        vue: [],
        // lodash 包含文件列表
        lodash: [],
        // 生成文件地址
        outputPath: '',
    }, params)

    // 判断生成文件地址是否存在
    if (! o.outputPath) {
        console.log('The parameter [outputPath] cannot be empty')
        return
    }

    // netang 方法列表
    const utilsMethods = []
    const utilsHeaders = []
    const utilsContents = []

    // lodash 方法列表
    const lodashHeaders = []
    const lodashContents = []

    // vue 方法列表
    const vueHeaders = []
    const vueContents = []

    // 遍历 utils
    let files = await readdir(path.join(__dirname, '../'), {
        // 包含规则
        includes: [
            '*.js',
        ],
        // 不包含当前路径
        self: false,
        // 禁止深度遍历
        deep: false,
    })
    for (const { fileName, isFile } of files) {
        if (isFile) {

            // 方法名
            const methodName = fileName.replace('.js', '')

            if (
                // 如果该方法在 utils 包含文件列表中
                o.utils.indexOf(methodName) > -1
                // 如果该方法在 lodash 包含文件列表
                || o.lodash.indexOf(methodName) > -1
            ) {
                // 添加至 utils 方法列表中
                utilsMethods.push(methodName)
                utilsHeaders.push(`import ${methodName} from '@netang/utils/${methodName}'`)
                utilsContents.push(`    ${methodName},`)
            }
        }
    }

    for (const methodName of o.lodash) {
        if (
            // 如果 lodash 方法不在已定义的 utils 方法列表中
            utilsMethods.indexOf(methodName) === -1
            // 如果 lodash 方法是合法的 lodash 方法
            && lodashKeys.indexOf(methodName) > -1
        ) {
            // 添加至 lodash 方法列表中
            lodashHeaders.push(`import ${methodName} from 'lodash/${methodName}'`)
            lodashContents.push(`    ${methodName},`)
        }
    }

    // 遍历 vue 工具
    files = await readdir(path.join(__dirname, '../vue'), {
        // 包含规则
        includes: [
            '*.js',
        ],
        // 忽略规则
        ignores: [
            'store.js',
        ],
        // 不包含当前路径
        self: false,
        // 不深度遍历
        deep: false,
    })
    for (const { fileName, isFile } of files) {
        if (isFile) {

            // 方法名
            const methodName = fileName.replace('.js', '')

            // 如果该方法在 vue 包含文件列表中
            if (o.vue.indexOf(methodName) > -1) {
                // 添加至 netang 方法列表中
                vueHeaders.push(`import ${methodName} from '@netang/utils/vue/${methodName}'`)
                vueContents.push(`    ${methodName},`)
            }
        }
    }

    // 生成文件
    await writeFile(o.outputPath, `// @netang/utils
${utilsHeaders.join('\n')}

// lodash
${lodashHeaders.join('\n')}

// @netang/utils/vue
${vueHeaders.join('\n')}

/**
 * 公共方法
 * 注意: 不要修改, 该文件是由配置生成的
 */
export default {

    // @netang/utils
${utilsContents.join('\n')}

    // lodash
${lodashContents.join('\n')}

    // @netang/utils/vue
${vueContents.join('\n')}
}`)
}
