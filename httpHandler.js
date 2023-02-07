"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.httpHandler = httpHandler;
exports.httpOptions = void 0;
// 默认配置
const httpOptions = {};

/**
 * http 处理者
 */
exports.httpOptions = httpOptions;
function httpHandler(options) {
  Object.assign(httpOptions, options);
}