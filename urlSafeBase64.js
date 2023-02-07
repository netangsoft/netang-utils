"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * URL 安全的 Base64编码
 */
var _default = {
  /**
   * 编码
   * @param value
   * @returns {string}
   */
  encode(value) {
    return value.replace(/\//g, '_').replace(/\+/g, '-');
  },
  /**
   * 解码
   * @param value
   * @returns {string}
   */
  decode(value) {
    return value.replace(/_/g, '/').replace(/-/g, '+');
  }
};
exports.default = _default;