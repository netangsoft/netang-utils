"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = run;
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 运行函数
 * @param {Function} func
 * @param thisArg
 * @returns {Function}
 */
function run(func, thisArg = null) {
  return (0, _isFunction.default)(func) ? function (...args) {
    return func.call(thisArg, ...args);
  } : function () {};
}