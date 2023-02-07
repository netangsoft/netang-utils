"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = sort;
var _isArray = _interopRequireDefault(require("lodash/isArray"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 排序
 * @param {array} data
 * @param {string} field 排序字段
 * @param {int} value 1 正序 -1 倒序
 * @returns {array}
 */
function sort(data, field = '', value) {
  if ((0, _isArray.default)(data)) {
    data.sort(function (item1, item2) {
      let a;
      let b;
      if (field) {
        a = item1[field];
        b = item2[field];
      } else {
        a = item1;
        b = item2;
      }
      if (a < b) {
        return 0 - value;
      }
      if (a > b) {
        return value;
      }
      return 0;
    });
  }
  return data;
}