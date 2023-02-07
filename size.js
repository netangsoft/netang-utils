"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = size;
var _trim = _interopRequireDefault(require("lodash/trim"));
var _size = _interopRequireDefault(require("lodash/size"));
var _isNumeric = _interopRequireDefault(require("./isNumeric"));
var _isValidString = _interopRequireDefault(require("./isValidString"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 返回值的长度, 如果值是类数组或字符串, 返回其 length(汉字:长度为 2，英文/数字: 长度为 1); 如果值是对象, 返回其可枚举属性的个数
 */
function size(value) {
  // 如果是数字/字符串
  const isNum = (0, _isNumeric.default)(value);
  if (isNum || (0, _isValidString.default)(value)) {
    value = (0, _trim.default)(isNum ? String(value) : value);
    const count = value.length;
    if (!count) {
      return 0;
    }
    if (isNum) {
      return count;
    }
    let num = 0;
    for (let i = 0; i < count; i++) {
      if (encodeURI(value.charAt(i)).length > 2) {
        num += 2;
      } else {
        num += 1;
      }
    }
    return num;
  }

  // 否则执行 lodash size
  return (0, _size.default)(value);
}