"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.http = http;
exports.settings = settings;
var _qs = require("qs");
var _utils = require("qs/lib/utils");
var _get = _interopRequireDefault(require("lodash/get"));
var _merge = _interopRequireDefault(require("lodash/merge"));
var _toUpper = _interopRequireDefault(require("lodash/toUpper"));
var _forEach = _interopRequireDefault(require("lodash/forEach"));
var _has = _interopRequireDefault(require("lodash/has"));
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _isArray = _interopRequireDefault(require("lodash/isArray"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _isValidString = _interopRequireDefault(require("./isValidString"));
var _isNumeric = _interopRequireDefault(require("./isNumeric"));
var _isValidObject = _interopRequireDefault(require("./isValidObject"));
var _sleep = _interopRequireDefault(require("./sleep"));
var _numberDeep = _interopRequireDefault(require("./numberDeep"));
var _run = _interopRequireDefault(require("./run"));
var _getUrl = _interopRequireDefault(require("./getUrl"));
var _getThrowMessage = _interopRequireDefault(require("./getThrowMessage"));
var _runAsync = _interopRequireDefault(require("./runAsync"));
var _json = _interopRequireDefault(require("./json"));
var _storage = _interopRequireDefault(require("./storage"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// http 初始设置
const httpSettings = {
  // 请求类型
  method: 'post',
  // 基础 url
  baseUrl: '',
  // 请求的 url
  url: '',
  // 请求数据
  data: {},
  // 请求返回数据类型
  responseType: 'json',
  // 是否将数据格式化为 json
  responseJson: true,
  // 是否开启错误提醒(true:普通方式/false:不开启/alert:对话框方式)
  warn: false,
  // 检查结果的 code 是否正确(前提数据类型必须为 json)
  checkCode: false,
  // 是否开启上传
  upload: false,
  // 自定义上传表单数据
  uploadFormData: false,
  // 头部数据
  headers: {},
  // 是否开启 loading
  loading: false,
  // loading 类型
  //     null: 同步 loading
  //     before: 请求之前提前开启 loading 并延迟结束, 让用户有 loading 的感觉
  //     after: 请求之后延迟开启 loading, 可保证如果请求速度快, 则 loading 不会出现, 让用户没有 loading 的感觉
  loadingType: 'after',
  // loading 延迟时间(毫秒)
  loadingTime: null,
  // 是否缓存数据
  cache: false,
  // 缓存名
  cacheName(options, para, data) {
    return `${options.method}:${(0, _utils.encode)((0, _toUpper.default)(options.url))}:${data}`;
  },
  // 保存缓存前执行
  setCacheBefore: null,
  // 缓存时间(5分钟)
  cacheTime: 300000,
  // 是否开启防抖(防止重复请求)
  debounce: false,
  // 是否错误重连
  reConnect: false,
  // 重连次数
  reConnectNum: 3,
  // 是否将请求结果深度转换为数字(如果开头为 0 的数字, 则认为是字符串)
  numberDeep: true,
  // axios 配置
  settings: {},
  // code 字典
  dicts: {
    /** 状态码 - 成功 - 200 */
    CODE__SUCCESS: 200,
    /** 状态码 - 错误 - 400 */
    CODE__FAIL: 400,
    /** 状态码 - 没有找到页面 - 404 */
    CODE__PAGE_NOT_FOUND: 404,
    /** 状态码 - 服务器未知错误 - 500 */
    CODE__SERVER_ERROR: 500
  },
  // 设置参数
  onOptions: null,
  // 取消请求调用函数(需要自己在 onOptions 方法中实现)
  onCancel: null,
  // 获取上传进度调用函数(需要自己在 onOptions 方法中实现)
  onUploadProgress: null,
  // 请求前执行
  onRequestBefore: null,
  // 请求成功执行
  onRequestSuccess: null,
  // 判断是否错误重连
  onCheckReConnect: null,
  // 处理请求
  onRequest: null,
  // 处理业务错误
  onBusinessError: null,
  // 处理错误
  onError: null
};

// 默认配置
const httpOptions = {};

// loading 句柄对象
const loadingHandles = {};

/**
 * httpAsync
 */
async function httpAsync(params) {
  // 默认参数
  const para = (0, _merge.default)({}, httpSettings, httpOptions, params);

  // 获取字典
  const {
    dicts
  } = para;

  // 重连次数
  let reConnectedNum = 0;

  /**
   * 返回错误数据
   *
   * code 类型
   *
   * 200:       请求成功
   * 400:       参数错误
   * 404:       页面请求失败
   * 410:       token 过期需要重新鉴权
   * 411:       强制退出(当前用户账号在另一台设备上登录)
   * 412:       当前用户账号被禁用，需要退出并重新跳转至登录页面
   * 413:       当前用户不是会员, 需要跳转至升级vip页面
   * 415:       没有权限访问当前页面
   * 420 ~ 430: 业务自定义错误
   * 500:       服务器未知错误
   */
  function onError(data, r) {
    // 如果没有错误提示
    if (!data.msg) {
      data.msg = data.code === dicts.CODE__PAGE_NOT_FOUND ? 'No data' : 'System error';
    }

    // 执行错误执行
    if ((0, _isFunction.default)(para.onError)) {
      const res = para.onError({
        data,
        r,
        para
      });
      if (!(0, _isNil.default)(res)) {
        if (res === false) {
          return;
        }
        data = res;
      }
    }
    return {
      status: false,
      data,
      response: r
    };
  }

  /**
   * 返回成功数据
   */
  function onSuccess(data, r) {
    // 请求成功执行
    if ((0, _isFunction.default)(para.onRequestSuccess)) {
      const res = para.onRequestSuccess({
        data,
        r,
        para
      });
      if (!(0, _isNil.default)(res)) {
        if (res === false) {
          return;
        }
        data = res;
      }
    }
    return {
      status: true,
      data,
      response: r
    };
  }
  try {
    // 【请求设置】=================================================================================================

    const options = Object.assign({
      method: (0, _toUpper.default)(para.method),
      url: (0, _getUrl.default)(para.url, para.baseUrl),
      headers: para.headers
    }, para.settings);

    // 【请求数据】===================================================================================================

    // 设置参数
    if ((0, _isFunction.default)(para.onOptions)) {
      para.onOptions({
        options,
        para
      });
    }

    // 如果开启上传
    let data = '';
    if (para.upload === true) {
      // 如果开启上传, 则不可开启缓存
      para.cache = false;

      // 如果自定义上传表单数据
      if (para.uploadFormData) {
        options.data = para.data;

        // 否则获取上传文件数据
      } else if ((0, _isValidObject.default)(para.data)) {
        const fileData = new FormData();
        (0, _forEach.default)(para.data, function (value, key) {
          fileData.append(key, value);
        });
        options.data = fileData;
      }

      // 否则为请求数据
    } else {
      if (!(0, _has.default)(options.headers, 'Content-Type')) {
        options.headers['Content-Type'] = `application/${para.responseJson ? 'json' : 'x-www-form-urlencoded'};charset=utf-8`;
      }

      // 传参配置(post: data, get: 合并参数至 url 中)
      if ((0, _isValidObject.default)(para.data)) {
        if (options.method === 'GET') {
          // 如果 url 中包含参数
          if (options.url.indexOf('?') > -1) {
            const arr = options.url.split('?');
            options.url = `${arr[0]}?${(0, _qs.stringify)(Object.assign({}, (0, _qs.parse)(arr[1]), para.data))}`;
          } else {
            options.url += `?${(0, _qs.stringify)(para.data)}`;
          }
        } else {
          data = para.responseJson ? _json.default.stringify(para.data) : (0, _qs.stringify)(para.data);
          options.data = data;
        }
      } else if ((0, _isValidString.default)(para.data) || (0, _isNumeric.default)(para.data)) {
        options.data = para.data;
      }
    }

    // 【缓存】=======================================================================================================

    // 获取缓存名称
    const cacheName = 'http:' + ((0, _isValidString.default)(para.cache) ? para.cache : await (0, _runAsync.default)(para.cacheName)(options, para, data));

    // 是否开启缓存
    const isCache = para.cache !== false;

    // 如果有缓存, 则直接返回成功的缓存数据
    if (isCache) {
      const cacheData = await (0, _runAsync.default)(_storage.default.get)(cacheName);
      if (!(0, _isNil.default)(cacheData)) {
        return onSuccess(cacheData, {});
      }
    }

    // 【防止重复请求】================================================================================================

    // 如果当前请求为 loading 则停止往下执行(防止重复请求)
    if (para.debounce) {
      if ((0, _get.default)(loadingHandles, cacheName) === true) {
        return;
      }
      loadingHandles[cacheName] = true;
    }

    // 【判断 loading 状态】==========================================================================================

    // 创建防抖睡眠方法
    const sleep = (0, _sleep.default)();

    /**
     * loading 状态
     */
    function onLoading(status) {
      // 如果为 ref 值
      if (isLoadingRef) {
        // 设置 ref loading 值
        para.loading.value = status;

        // 判断是是否为方法
      } else if ((0, _isFunction.default)(para.loading)) {
        para.loading(status);
      }
    }

    // 是否开启 loading
    let isLoading = false;
    // 是否 loading ref 变量
    let isLoadingRef = false;
    if (para.loading === true || (0, _isFunction.default)(para.loading)) {
      isLoading = true;

      // 如果是 vue ref 格式
    } else if ((0, _get.default)(para.loading, '__v_isRef') === true) {
      isLoading = true;
      isLoadingRef = true;
    }

    // 如果开启 loading
    if (isLoading) {
      // 如果开启请求之后延迟开启 loading, 可保证如果请求速度快, 则 loading 不会出现, 让用户没有 loading 的感觉
      if (para.loadingType === 'after') {
        sleep((0, _isNil.default)(para.loadingTime) ? 1000 : para.loadingTime).then(function () {
          // 开启 loading
          onLoading(true);
        });

        // 否则立即开启 loading
      } else {
        // 开启 loading
        onLoading(true);

        // 如果开启请求之前提前开启 loading 并延迟结束, 让用户有 loading 的感觉
        // 否则就是正常的 loading
        if (para.loadingType === 'before') {
          await sleep((0, _isNil.default)(para.loadingTime) ? 1000 : para.loadingTime);
        }
      }
    }

    /**
     * 请求数据
     */
    async function onHttp() {
      // 请求成功
      try {
        // 请求前执行
        if ((await (0, _runAsync.default)(para.onRequestBefore)({
          para,
          options,
          onError
        })) === false) {
          return;
        }

        // 下一步
        async function next(r) {
          // 是否将请求结果深度转换为数字(如果开头为 0 的数字, 则认为是字符串)
          let data = para.numberDeep ? (0, _numberDeep.default)(r.data, null, true) : r.data;

          // 判断是否业务出错
          if (para.responseType === 'json' && para.checkCode) {
            // 如果数据格式不正确
            if (!(0, _isValidObject.default)(data) || !(0, _has.default)(data, 'code')) {
              return onError({
                // 错误码
                code: dicts.CODE__FAIL,
                // 错误信息
                msg: 'Data error'
              }, r);
            }

            // 如果业务代码不正确
            if (data.code !== dicts.CODE__SUCCESS) {
              // 处理业务错误
              const resBusinessError = await (0, _runAsync.default)(para.onBusinessError)({
                data,
                r,
                options,
                para,
                onError,
                onHttp
              });
              if (!(0, _isNil.default)(resBusinessError)) {
                return resBusinessError;
              }

              // 返回失败数据
              return onError(data, r);
            }
            data = data.data;
          }

          // 如果开启保存缓存
          if (isCache
          // 保存缓存前执行
          && (!(0, _isFunction.default)(para.setCacheBefore) || para.setCacheBefore({
            data,
            r,
            cacheName,
            options,
            para
          }) !== false)) {
            // 保存缓存
            await (0, _runAsync.default)(_storage.default.set)(cacheName, data, para.cacheTime);
          }

          // 返回成功数据
          return onSuccess(data, r);
        }

        // 发起请求
        return await para.onRequest({
          para,
          options,
          onError,
          next
        });

        // 请求失败
      } catch (e) {
        // 错误消息
        const msg = (0, _getThrowMessage.default)(e, '');

        // 如果开启重连, 则进行重新连接
        if (para.reConnect && (0, _run.default)(para.onCheckReConnect)(e, msg) === true
        // 如果已重连次数 >= 最大重连次数, 则继续重连
        && reConnectedNum <= para.reConnectNum) {
          // 重连次数 + 1
          reConnectedNum++;

          // 开发模式
          if (process.env.NODE_ENV !== 'production') {
            console.log(`http reconnect - ${reConnectedNum}`, e);
          }

          // 延迟执行
          await sleep(300);

          // 进行下一轮请求
          return await onHttp();
        }

        // 返回失败数据
        return onError({
          code: dicts.CODE__SERVER_ERROR,
          msg
        }, e);
      }
    }

    // 执行请求
    const resHttp = await onHttp();

    // 关闭 loading
    if (isLoading) {
      sleep.cancel();
      onLoading(false);
    }

    // 清空连接次数
    reConnectedNum = 0;

    // 删除 loading 句柄
    if (para.debounce) {
      delete loadingHandles[cacheName];
    }
    return resHttp;
  } catch (e) {
    return onError({
      code: dicts.CODE__SERVER_ERROR,
      msg: (0, _getThrowMessage.default)(e)
    }, e);
  }
}
function httpSingle(params) {
  return new Promise(function (resolve) {
    httpAsync(params).then(function (res) {
      if (!(0, _isNil.default)(res)) {
        resolve(res);
      }
    });
  });
}

/**
 * http 设置
 */
function settings(options) {
  Object.assign(httpOptions, options);
}

/**
 * http 请求
 */
function http(params) {
  if ((0, _isArray.default)(params)) {
    const arr = [];
    for (let item of params) {
      arr.push(httpSingle(item));
    }
    return Promise.all(arr);
  }
  return httpSingle(params);
}