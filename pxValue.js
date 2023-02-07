"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = pxValue;
var _isNumeric = _interopRequireDefault(require("./isNumeric"));
var _indexOf = _interopRequireDefault(require("./indexOf"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 获取像素值
 * 89px -> 89
 */
function pxValue(value, defaultValue = 0, sign = 'px') {
  // 如果含有 px
  if ((0, _indexOf.default)(value, sign) > -1) {
    // 去除所有 px 符号
    value = value.replaceAll(sign, '');
  }

  // 如果是数字
  if ((0, _isNumeric.default)(value)) {
    return Number(value);
  }
  return defaultValue;
}