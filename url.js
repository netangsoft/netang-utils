"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = url;
var _qs = require("qs");
var _isValidString = _interopRequireDefault(require("./isValidString"));
var _numberDeep = _interopRequireDefault(require("./numberDeep"));
var _isBrowser = _interopRequireDefault(require("./isBrowser"));
var _slash = _interopRequireDefault(require("./slash"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 解构 url 参数
 * 返回数据格式：
 *
 *      href: "http://192.168.1.120:9081/biz/user/index?a=1&b=2&c=3#goto"
 *      hash: "goto"
 *      host: "192.168.1.120:9081"
 *      hostname: "192.168.1.120"
 *      origin: "http://192.168.1.120:9081"
 *      pathname: "biz/user/index"
 *      port: "9081"
 *      protocol: "http:"
 *      query: {a: "1", b: "2", c: "3"}
 *      search: "a=1&b=2&c=3"
 *      url: "http://192.168.1.120:9081/biz/user/index"
 */
function url(href = '') {
  if (!(0, _isValidString.default)(href) && (0, _isBrowser.default)()) {
    href = window.location.href;
  }
  const parts = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/.exec(href) || [];
  if (parts.length) {
    // 是否为 file 模式
    const isFile = parts[1] === 'file:';

    // 是否为 hash 模式(file 模式一定是 hash 模式)
    const isHash = isFile || href.indexOf('/#/') > -1;
    if (!isFile && !parts[2]) {
      throw new Error('hostname is not defined');
    }
    let u;

    // 如果是 file 模式
    if (isFile) {
      const files = href.split('#');
      u = {
        href,
        protocol: parts[1],
        origin: files[0],
        host: files[0],
        hostname: files[0],
        port: ''
      };
    } else {
      u = {
        href,
        origin: parts[0],
        protocol: parts[1],
        hostname: parts[2],
        port: parts[3] || ''
      };
      u.host = `${u.hostname}${u.port ? ':' + u.port : ''}`;
    }

    // 如果为 hash 模式
    if (isHash) {
      // 如果是 file 模式
      if (isFile) {
        href = href.replace('#/', '___HASH___');

        // 否则是 http 模式
      } else {
        href = href.replace('/#/', '___HASH___');
      }
    }

    // 获取 hash
    let hrefs = href.split('#');
    let len = hrefs.length;
    if (len > 1) {
      href = hrefs[0];
      u.hash = hrefs[len - 1];
    } else {
      u.hash = '';
    }

    // 获取 query
    hrefs = href.split('?');
    len = hrefs.length;
    if (len > 1) {
      u.url = hrefs[0];
      u.search = hrefs[len - 1];
      u.query = (0, _numberDeep.default)((0, _qs.parse)(u.search));
    } else {
      u.url = href;
      u.search = '';
      u.query = {};
    }
    u.pathname = (0, _slash.default)(u.url.substring(u.url.lastIndexOf(u.origin) + u.origin.length), 'all', false);

    // 如果为 hash 模式
    if (isHash) {
      u.pathname = u.pathname.replace('___HASH___', '');
      u.url = u.url.replace('___HASH___', isFile ? '#/' : '/#/');
    }
    return u;
  }
  throw new Error('url is error');
}