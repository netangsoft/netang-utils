"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = cb;
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 回调
 * @param data
 * @param {function} cb
 */
function cb(data, cb) {
  if ((0, _isFunction.default)(cb)) {
    return cb.call(this, data);
  }
}