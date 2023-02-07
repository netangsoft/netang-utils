"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _toNumber = _interopRequireDefault(require("lodash/toNumber"));
var _has = _interopRequireDefault(require("lodash/has"));
var _isValidString = _interopRequireDefault(require("./isValidString"));
var _isNumeric = _interopRequireDefault(require("./isNumeric"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 保存 cookie
 * @param {string} key
 * @param {any} value
 * @param {number|object} options
 */
function setCookie(key, value, options = {}) {
  if (!(0, _isValidString.default)(key)) {
    return;
  }

  // 如果为数字, 则为过期时间
  if ((0, _isNumeric.default)(options)) {
    options = {
      // 过期时间
      expires: (0, _toNumber.default)(options)
    };
  }

  // 获取参数
  const opt = Object.assign({
    path: '/',
    domain: '',
    expires: 0,
    secure: false,
    raw: false,
    json: true
  }, options);

  // 更新内容
  let content = `${encodeURIComponent(key)}=netang:${encodeURIComponent(JSON.stringify(value))};path=${opt.path}`;

  // 域名
  if (opt.domain) {
    content += `;domain=${opt.domain}`;
  }

  // 过期时间
  if (opt.expires) {
    const date = new Date();
    date.setTime(date.getTime() + opt.expires * 1000);
    content += `;expires=${date.toUTCString()}`;
  }

  // secure
  if (opt.secure) {
    content += `;secure`;
  }
  document.cookie = content;
}

/**
 * 获取 cookie
 * @param {string} key
 * @returns {any}
 */
function getCookie(key = '') {
  if (!(0, _isValidString.default)(key)) {
    return;
  }

  // 获取所有 cookies 并转为数组
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  const res = {};
  for (let i = 0, len = cookies.length; i < len; i++) {
    const parts = cookies[i].split('=');
    let value = parts.slice(1).join('=');
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    try {
      // 判断 cookie 前缀
      if (value.substr(0, 7) !== 'netang:') {
        continue;
      }
      res[parts[0]] = JSON.parse(decodeURIComponent(value.substr(7)));
      if (key === parts[0]) {
        break;
      }
    } catch (e) {}
  }
  return (0, _isValidString.default)(key) ? (0, _has.default)(res, key) ? res[key] : null : res;
}

/**
 * 删除 cookie
 * @param {string} key
 * @param {object} options
 */
function deleteCookie(key, options = {}) {
  setCookie(key, '', Object.assign({}, options, {
    expires: -1
  }));
}
const cookie = {
  set: setCookie,
  get: getCookie,
  delete: deleteCookie
};
var _default = cookie;
exports.default = _default;