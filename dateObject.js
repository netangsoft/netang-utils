"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = dateObject;
var _padStart = _interopRequireDefault(require("lodash/padStart"));
var _toDate = _interopRequireDefault(require("./toDate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 时间日期对象
 */
function dateObject(date) {
  // 转换日期格式
  date = (0, _toDate.default)(date);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();
  const i = date.getMinutes();
  const s = date.getSeconds();
  return {
    y,
    // 年
    m,
    // 月
    d,
    // 日
    h,
    // 时
    i,
    // 分
    s,
    // 秒
    // 补零字符串
    mm: (0, _padStart.default)(m, 2, '0'),
    dd: (0, _padStart.default)(d, 2, '0'),
    hh: (0, _padStart.default)(h, 2, '0'),
    ii: (0, _padStart.default)(i, 2, '0'),
    ss: (0, _padStart.default)(s, 2, '0')
  };
}