"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = jump;
var _isBrowser = _interopRequireDefault(require("./isBrowser"));
var _isValidString = _interopRequireDefault(require("./isValidString"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 跳转
 * @param {string} url
 * @param {boolean} replace
 */
function jump(url, replace = false) {
  if (
  // 如果不在浏览器中
  !(0, _isBrowser.default)()
  // 如果 url 为非有效值
  || !(0, _isValidString.default)(url)) {
    return;
  }

  // 刷新当前页
  if (url === 'reload') {
    window.location.reload();
    return;
  }
  if (replace === true) {
    window.location.replace(url);
  } else {
    window.location.href = url;
  }
}