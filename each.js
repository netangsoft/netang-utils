"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = each;
var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));
var _forEach2 = _interopRequireDefault(require("./.internal/_forEach"));
var _forIn2 = _interopRequireDefault(require("./.internal/_forIn"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * each
 * @param data
 * @param func
 */
function each(data, func) {
  // 如果是数组
  if (Array.isArray(data)) {
    return (0, _forEach2.default)(data, func);
  }

  // 如果是对象
  if ((0, _isPlainObject.default)(data)) {
    return (0, _forIn2.default)(data, func);
  }
}