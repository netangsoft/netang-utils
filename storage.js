"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _has = _interopRequireDefault(require("lodash/has"));
var _isValidObject = _interopRequireDefault(require("./isValidObject"));
var _isValidString = _interopRequireDefault(require("./isValidString"));
var _numberDeep = _interopRequireDefault(require("./numberDeep"));
var _forIn = _interopRequireDefault(require("./forIn"));
var _json = _interopRequireDefault(require("./json"));
var _storageHandler = require("./storageHandler");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 获取 storage 前缀
 */
function getStoragePrefix(key) {
  return _storageHandler.storageOptions.prefix + key;
}

/**
 * 获取所有缓存 keys
 * @returns {object}
 */
function getStorageKeys() {
  let info = _storageHandler.storageOptions.get(getStoragePrefix('keys'));
  if (!(0, _isNil.default)(info)) {
    info = _json.default.parse(info);

    // 将已过期的缓存删除
    if ((0, _isValidObject.default)(info)) {
      // 删除次数
      let delNum = 0;

      // 当前时间戳(微秒)
      const nowTime = Date.now();

      // 批量删除过期的缓存
      (0, _forIn.default)(info, function (val, key) {
        if (val > 0 && val <= nowTime) {
          delNum++;
          delete info[key];
          _storageHandler.storageOptions.delete(key);
        }
      });

      // 更新 keys
      if (delNum > 0) {
        setStorageKeys(info);
      }
      return info;
    }
  }
  return {};
}

/**
 * 保存所有缓存 keys
 * @param info
 */
function setStorageKeys(info) {
  _storageHandler.storageOptions.set(getStoragePrefix('keys'), _json.default.stringify(info));
}

/**
 * 从所有缓存 keys 中删除单独 key
 * @param info
 * @param {string} key
 */
function deleteStorageKeys(info, key) {
  if ((0, _has.default)(info, key)) {
    delete info[key];
    setStorageKeys(info);
  }
}

/**
 * 保存缓存
 * @param {string} key 键名
 * @param {any} value 值
 * @param {number} expires 过期时间
 */
function setStorage(key, value, expires) {
  if (!(0, _isValidString.default)(key) || (0, _isNil.default)(value)) {
    return;
  }

  // 获取 key
  key = getStoragePrefix(key);

  // 先获取所有缓存的 keys 信息
  const info = getStorageKeys();

  // 获取过期时间
  if ((0, _isNil.default)(expires)) {
    expires = _storageHandler.storageOptions.expires;
  }
  expires = expires > 0 ? Date.now() + expires : 0;
  if (!(0, _has.default)(info, key) || info[key] !== expires) {
    info[key] = expires;
    setStorageKeys(info);
  }

  // 更新缓存数据
  _storageHandler.storageOptions.set(key, _json.default.stringify(value));
}

/**
 * 获取缓存
 * @param {string} key 键名
 * @param {any} defaultValue 默认值
 * @returns {any}
 */
function getStorage(key = '', defaultValue = null) {
  if (!(0, _isValidString.default)(key)) {
    // 返回 null
    return defaultValue;
  }

  // 获取 key
  key = getStoragePrefix(key);

  // 先获取所有缓存的 keys 信息
  const info = getStorageKeys();
  if ((0, _has.default)(info, key)) {
    // 获取当前缓存
    let res = _storageHandler.storageOptions.get(key);
    if (!(0, _isNil.default)(res)) {
      // 解析 json 数据
      res = _json.default.parse(res);
      if (res !== null) {
        // 返回解析好的数据
        return (0, _numberDeep.default)(res, defaultValue);
      }
    }

    // 否则数据不存在, 则删除当前缓存 key
    deleteStorageKeys(info, key);
  }

  // 返回 null
  return defaultValue;
}

/**
 * 删除缓存
 * @param {string} key 键名
 */
function deleteStorage(key) {
  if ((0, _isValidString.default)(key)) {
    // 获取 key
    key = getStoragePrefix(key);

    // 删除当前缓存
    _storageHandler.storageOptions.delete(key);

    // 删除缓存 key
    deleteStorageKeys(getStorageKeys(), key);
  }
}

/**
 * 删除所有缓存
 */
function flushStorage() {
  // 先获取所有缓存的 keys 信息
  const info = getStorageKeys();

  // 遍历并删除
  (0, _forIn.default)(info, function (value, key) {
    _storageHandler.storageOptions.delete(key);
  });

  // 删除 keys 缓存
  _storageHandler.storageOptions.delete(getStoragePrefix('keys'));
}

/**
 * 仅更新缓存值(仅当缓存存在时有效)
 * @param {string} key 键名
 * @param {any} value 值
 */
function updateValueStorage(key, value) {
  const expires = getStorageTtl(key);
  if (expires > 0) {
    setStorage(key, value, expires);
  }
}

/**
 * 获取缓存剩余时间(秒)
 * @param {string} key 键名
 */
function getStorageTtl(key = '') {
  if ((0, _isValidString.default)(key)) {
    // 获取 key
    key = getStoragePrefix(key);

    // 先获取所有缓存的 keys 信息
    const info = getStorageKeys();
    if ((0, _has.default)(info, key) && info[key] > 0) {
      const expires = info[key] - Date.now(); // 当前时间戳(微秒)
      if (expires > 0) {
        return expires;
      }
    }
  }
  return 0;
}

/**
 * storage
 */
const storage = {
  // 保存缓存
  set: setStorage,
  // 获取缓存
  get: getStorage,
  // 删除缓存
  delete: deleteStorage,
  // 删除所有缓存
  flush: flushStorage,
  // 仅更新缓存值(仅当缓存存在时有效)
  updateValue: updateValueStorage,
  // 获取缓存剩余时间(秒)
  getTtl: getStorageTtl
};
var _default = storage;
exports.default = _default;