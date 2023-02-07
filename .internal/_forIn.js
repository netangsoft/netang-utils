"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = forIn;
var _isNumeric = _interopRequireDefault(require("../isNumeric"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * forIn
 * @param data
 * @param func
 */
function forIn(data, func) {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const res = func(data[key], (0, _isNumeric.default)(key) ? Number(key) : key, data);
      if (res !== undefined) {
        return res;
      }
    }
  }
}