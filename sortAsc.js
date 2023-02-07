"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sortAsc;
var _sort = _interopRequireDefault(require("./.internal/_sort"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 从小到大正序排序【废弃】
 * @param {array} data 含有数字的数组
 * @param {string} field 排序字段
 * @returns {array}
 */
function sortAsc(data, field = '') {
  return (0, _sort.default)(data, field, 1);
}