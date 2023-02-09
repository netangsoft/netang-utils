"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = isDate;
var _isString = _interopRequireDefault(require("lodash/isString"));
var _isNumeric = _interopRequireDefault(require("./isNumeric"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 判断是否为合法日期格式
 */
function isDate(val) {
  if (!val || Array.isArray(val)) {
    return false;
  }

  // 如果为数字
  if ((0, _isNumeric.default)(val)) {
    // 获取数字长度
    const {
      length
    } = (0, _isString.default)(val) ? val : String(val);

    // 如果为毫秒时间戳 || 普通时间戳
    return length === 13 || length === 10;
  }
  return !isNaN(new Date((0, _isString.default)(val) ? val.replace(/-/g, '/') : val).getTime());
}