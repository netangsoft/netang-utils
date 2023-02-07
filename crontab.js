"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = crontab;
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 定时执行
 */
function crontab(func, timeout = 0) {
  if (!(0, _isFunction.default)(func)) {
    throw new TypeError('Expected a function');
  }
  let _timerId = null;
  let _stop = false;
  function stop() {
    _stop = true;
    if (_timerId) {
      clearTimeout(_timerId);
    }
  }
  function start() {
    // 清除定时任务
    if (_timerId) {
      clearTimeout(_timerId);
      _timerId = null;
    }
    if (_stop) {
      return;
    }
    _timerId = setTimeout(function () {
      if (_stop) {
        return;
      }

      // 继续执行定时任务
      func(start, stop);
    }, timeout);
  }
  return {
    start,
    stop
  };
}