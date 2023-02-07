"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = callback;
var _run = _interopRequireDefault(require("./run"));
var _isRequired = _interopRequireDefault(require("./isRequired"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * callback
 * 回调
 * @param data
 * @param {function} callback
 * @returns {any}
 */
function callback(data, callback) {
  return (0, _run.default)(callback)(data, (0, _isRequired.default)(data));
}