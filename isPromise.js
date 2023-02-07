"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isPromise;
var _isObject = _interopRequireDefault(require("lodash/isObject"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 检查是否为 Promise
 * @param value
 * @returns {boolean}
 */
function isPromise(value) {
  return (0, _isObject.default)(value) && (0, _isFunction.default)(value.then) && (0, _isFunction.default)(value.catch);
}