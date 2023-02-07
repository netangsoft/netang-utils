"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storageHandler = storageHandler;
exports.storageOptions = void 0;
// 默认配置
const storageOptions = {
  // 缓存前缀
  prefix: 'netang:',
  // 过期时间(7天)
  expires: 604800,
  set() {},
  get() {},
  delete() {}
};

/**
 * storage 处理者
 */
exports.storageOptions = storageOptions;
function storageHandler(options) {
  Object.assign(storageOptions, options);
}