"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = runAsync;
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _isPromise = _interopRequireDefault(require("./isPromise"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 运行函数
 * @param {Function} func
 * @param thisArg
 * @returns {Function}
 */
function runAsync(func, thisArg = null) {
  return (0, _isFunction.default)(func) ? function (...args) {
    return new Promise(function (resolve, reject) {
      const res = func.call(thisArg, ...args);
      if ((0, _isPromise.default)(res)) {
        res.then(resolve).catch(reject);
      } else {
        resolve(res);
      }
    });
  } : async function () {};
}