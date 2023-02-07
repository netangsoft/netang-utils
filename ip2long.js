"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ip2long;
var _split = _interopRequireDefault(require("./split"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ip 转数字
 * @param {string} value
 * @returns {number}
 */
function ip2long(value) {
  const arr = (0, _split.default)(value, '.');
  return arr.length === 4 ? Number(arr[0]) * 256 * 256 * 256 + Number(arr[1]) * 256 * 256 + Number(arr[2]) * 256 + Number(arr[3]) >>> 0 : 0;
}