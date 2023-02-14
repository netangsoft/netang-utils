"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = void 0;
/**
 * URL 安全的 Base64编码
 */
const urlSafeBase64 = {
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
var _default = urlSafeBase64;
exports.default = _default;