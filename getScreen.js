"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = getScreen;
var _isBrowser = _interopRequireDefault(require("./isBrowser"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 获取屏幕宽高【即将废弃】
 */
function getScreen() {
  if ((0, _isBrowser.default)()) {
    return {
      width: document.documentElement.clientWidth || document.body.clientWidth,
      height: document.documentElement.clientHeight || document.body.clientHeight
    };
  }
  return {
    width: 0,
    height: 0
  };
}