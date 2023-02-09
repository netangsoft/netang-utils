"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = forIn;
var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));
var _forIn2 = _interopRequireDefault(require("./.internal/_forIn"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * forIn
 * @param data
 * @param func
 */
function forIn(data, func) {
  // 如果是对象
  if ((0, _isPlainObject.default)(data)) {
    return (0, _forIn2.default)(data, func);
  }
}