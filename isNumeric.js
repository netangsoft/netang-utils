"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNumeric;
var _isString = _interopRequireDefault(require("lodash/isString"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 检查是否为数字(包括字符串数字)
 * @param {number|string} value
 * @returns {boolean}
 */
function isNumeric(value) {
  if ((0, _isString.default)(value)) {
    return value - parseFloat(value) + 1 >= 0;
  }
  return Number.isFinite(value);
}