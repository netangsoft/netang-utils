"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _padStart = _interopRequireDefault(require("lodash/padStart"));
var _dayjs = _interopRequireDefault(require("dayjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 扩展 toObject
 */
_dayjs.default.extend(function (o, {
  prototype
}) {
  /**
   * toObject
   */
  prototype.toObject = function () {
    const YYYY = this.$y;
    const M = this.$M + 1;
    const D = this.$D;
    const H = this.$H;
    const m = this.$m;
    const s = this.$s;
    return {
      // 数字
      YYYY,
      // 年
      M,
      // 月
      D,
      // 日
      H,
      // 时
      m,
      // 分
      s,
      // 秒
      // 字符串
      YY: String(YYYY).substring(2, 4),
      MM: (0, _padStart.default)(M, 2, '0'),
      DD: (0, _padStart.default)(D, 2, '0'),
      HH: (0, _padStart.default)(H, 2, '0'),
      mm: (0, _padStart.default)(m, 2, '0'),
      ss: (0, _padStart.default)(s, 2, '0'),
      SSS: (0, _padStart.default)(this.$ms, 3, '0')
    };
  };

  /**
   * 覆盖 isValid
   */
  const oldIsValid = prototype.isValid;
  prototype.isValid = function (args) {
    return oldIsValid.bind(this)(args);
  };
});
var _default = _dayjs.default;
exports.default = _default;