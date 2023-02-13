import $n_cloneDeep from 'lodash/cloneDeep'
import $n_get from 'lodash/get'
import $n_isValidObject from '../../cjs/isValidObject'

import { stateSsrAsyncData } from '../store'

/**
 * ssr 获取初始数据
 */
export default function() {

    // 获取异步状态数据
    if ($n_isValidObject($n_get(stateSsrAsyncData.value, 'data'))) {
        return $n_cloneDeep(stateSsrAsyncData.value.data)
    }

    return false
}
