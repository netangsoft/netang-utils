"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toDate;
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _isString = _interopRequireDefault(require("lodash/isString"));
var _isNumeric = _interopRequireDefault(require("./isNumeric"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 转换日期格式
 */
function toDate(val) {
  if (!(0, _isNil.default)(val) && !Array.isArray(val)) {
    // 如果为数字
    if ((0, _isNumeric.default)(val)) {
      let length;
      if ((0, _isString.default)(val)) {
        length = val.length;
        val = Number(val);
      } else {
        length = String(val).length;
      }

      // 如果为毫秒时间戳
      if (length === 13) {
        return new Date(val);
      }

      // 如果为普通时间戳
      if (length === 10) {
        return new Date(val * 1000);
      }
    } else {
      val = new Date((0, _isString.default)(val) ? val.replace(/-/g, '/') : val);
      if (!isNaN(val.getTime())) {
        return val;
      }
    }
  }

  // 否则为当前时间
  return new Date();
}