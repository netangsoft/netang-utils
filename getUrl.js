"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getUrl;
var _isValidString = _interopRequireDefault(require("./isValidString"));
var _slash = _interopRequireDefault(require("./slash"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 获取当前 url
 * @param {string} url
 * @param {string} origin
 * @returns {string}
 */
function getUrl(url, origin = '/') {
  if (!(0, _isValidString.default)(url)) {
    url = '';
  }
  if (!/^(http|https|file):/i.test(url) && !/javascript/.test(url) && (0, _isValidString.default)(origin)) {
    url = (0, _slash.default)(origin, 'end', true) + (0, _slash.default)(url.replace(/^\//, ''), 'start', false);
  }
  return url;
}