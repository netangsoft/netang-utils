import { ref } from 'vue'

// 【ssr && 前端】
// ------------------------------
/* #if IS_SSR && IS_WEB */
// ssr 渲染数据
export const stateSsrAsyncData = ref({
    // 初始数据
    data: window.__INIT_DATA__ ? window.__INIT_DATA__ : null,
})
/* #endif */

// 【ssr && 后端】
// ------------------------------
/* #if IS_SSR && IS_SERVER */
// ssr 渲染数据
export const stateSsrAsyncData = ref({
    // 是否开启 ssr
    ssr: false,
    // 标题
    title: '',
    // 关键词
    keywords: '',
    // 描述
    description: '',
    // 初始数据
    data: null,
})
/* #endif */
