"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = void 0;
var _has = _interopRequireDefault(require("lodash/has"));
var _findIndex = _interopRequireDefault(require("lodash/findIndex"));
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _run = _interopRequireDefault(require("./run"));
var _getThrowMessage = _interopRequireDefault(require("./getThrowMessage"));
var _isJson = _interopRequireDefault(require("./isJson"));
var _numberDeep = _interopRequireDefault(require("./numberDeep"));
var _success = _interopRequireDefault(require("./success"));
var _fail = _interopRequireDefault(require("./fail"));
var _runAsync = _interopRequireDefault(require("./runAsync"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * WebSocket 类
 */
class Socket {
  /**
   * 构造
   */
  constructor() {
    // 角色类型
    this.roleType = 0;

    // 字典常量
    this.dicts = {
      /** 状态码 - 成功 - 200 */
      CODE__SUCCESS: 200,
      /** 状态码 - 错误 - 400 */
      CODE__FAIL: 400,
      /** 状态码 - token 过期需要重新鉴权 - 410 */
      CODE__TOKEN_EXPIRED: 410,
      /** 状态码 - 强制退出 - 411 */
      CODE__LOGOUT: 411,
      /** 消息类型(1:更新鉴权认证) */
      SOCKET_MESSAGE_TYPE__UPDATE_AUTH: 1,
      /** 消息类型(100:参数错误) */
      SOCKET_MESSAGE_TYPE__PARAMS_ERROR: 100
    };

    // socket 实例
    this.socket = null;
    // 发送数据队列
    this.query = [];

    // 计数器
    this._num = 1;
    // 是否连接中
    this._connecting = false;
    // 是否发送中
    this._sending = false;
    // 监听消息事件
    this._onMessage = null;
    // 监听关闭事件
    this._onClose = null;
    // 更新鉴权认证次数
    this._updatedAuthTokenNum = 0;
  }

  /**
   * 请求前执行
   */
  onConnectBefore() {}

  /**
   * 处理业务错误
   */
  onBusinessError() {}

  /**
   * 退出
   */
  logout() {}

  /**
   * 获取鉴权 token
   */
  getAuthToken() {}

  /**
   * 连接
   */
  connect() {
    if (this._connecting) {
      return;
    }
    this._connecting = true;

    // 清空更新鉴权认证次数
    this._updatedAuthTokenNum = 0;
    return new Promise(resolve => {
      // 如果已经连接
      if (this.socket) {
        this._connecting = false;
        resolve(true);
        return;
      }

      // 请求前执行
      if (this.onConnectBefore() === false) {
        this._connecting = false;
        resolve(false);
        return;
      }

      // 是否已完成
      let isCompleted = false;

      // 完成事件
      const _complete = status => {
        if (!status) {
          // 【调试模式】
          /* #if IS_DEBUG */
          console.error('[socket 连接失败]');
          /* #endif */
          this.socket = null;
        }
        isCompleted = true;
        this._connecting = false;
        resolve(status);
      };

      /**
       * 连接 WebSocket
       */
      this.socket = this.$socket.onConnect.call(this,
      // 参数
      {
        // 角色类型
        role_type: this.roleType,
        // 登录鉴权
        token: this.getAuthToken()
      },
      // 失败回调
      function () {
        if (!isCompleted) {
          _complete(false);
        }
      });

      /**
       * 监听错误事件
       */
      this.$socket.onError.call(this, async e => {
        // 【调试模式】
        /* #if IS_DEBUG */
        console.error('[socket 连接失败]');
        /* #endif */

        if (!isCompleted) {
          _complete(false);
          return;
        }
        (0, _run.default)(this._onMessage)({
          status: false,
          msg: (0, _getThrowMessage.default)(e, '操作失败'),
          data: null,
          message_id: '',
          message_type: this.dicts.SOCKET_MESSAGE_TYPE__PARAMS_ERROR
        });
        await this.close();
      });

      /**
       * 监听消息事件
       */
      this.$socket.onMessage.call(this, async ({
        data
      }) => {
        // 返回结果
        const _result = (status, result) => {
          const res = {
            status,
            data: null,
            message_id: '',
            message_type: status ? '' : this.dicts.SOCKET_MESSAGE_TYPE__PARAMS_ERROR
          };

          // 如果成功
          if (status) {
            const {
              data
            } = result;
            return Object.assign(res, result, data);
          }

          // 否则失败
          return Object.assign(res, {
            data: result
          });
        };

        // 错误
        const _error = async data => {
          // 【调试模式】
          /* #if IS_DEBUG */
          console.error('[socket 错误]', data);
          /* #endif */

          if (!isCompleted) {
            _complete(false);
            return;
          }
          const result = _result(false, data);

          // 如果有唯一消息 id
          if ((0, _has.default)(data, 'data.message_id')) {
            // 如果消息中存在该消息 id
            const index = (0, _findIndex.default)(this.query, e => e.data.message_id === data.data.message_id);
            if (index > -1) {
              // 获取该消息数据
              const item = this.query[index];

              // 从队列中删除
              this.query.splice(index, 1);

              // 执行异步 resolve 事件
              if ((0, _has.default)(item, 'resolve')) {
                item.resolve(result);
                return;
              }
            }
          }

          // 否则执行全局错误
          (0, _run.default)(this._onMessage)(result);
        };

        // 如果是 json 格式
        if ((0, _isJson.default)(data)) {
          // 解析 json
          data = JSON.parse(data);

          // 【调试模式】
          // --------------------------------------------------
          // #ifdef IS_DEBUG
          console.log('[socket result]', data);
          // #endif
          // --------------------------------------------------

          if ((0, _has.default)(data, 'code')) {
            // 将请求结果深度转换为数字(如果开头为 0 的数字, 则认为是字符串)
            data = (0, _numberDeep.default)(data, null, true);

            // 退出
            const logout = async () => {
              // 关闭 socket
              await this.close();
              this._connecting = false;
              isCompleted = true;

              // 执行退出
              this.logout(data);
            };

            // 如果业务代码不正确
            if (data.code !== this.dicts.CODE__SUCCESS) {
              // 410: token 过期需要重新鉴权
              if (data.code === this.dicts.CODE__TOKEN_EXPIRED) {
                const {
                  // 更新鉴权认证
                  updateAuthToken
                } = this;

                // 如果更新鉴权认证次数超过上限, 说明需要强制退出 || 没有更新鉴权认证方法
                if (this._updatedAuthTokenNum > 3 || !updateAuthToken) {
                  return await logout();
                }

                // 叠加更新鉴权次数
                this._updatedAuthTokenNum++;

                // 如果更新鉴权认证成功
                if (await updateAuthToken()) {
                  // 【调试模式】
                  // --------------------------------------------------
                  // #ifdef IS_DEBUG
                  console.log(`[重新鉴权成功] updatedAuthTokenNum: ${this._updatedAuthTokenNum}`);
                  // #endif
                  // --------------------------------------------------

                  // 如果发送鉴权 token
                  if (!(await this._send({
                    // 消息id
                    message_id: this.getMessageId(),
                    // 聊天消息类型(1:更新鉴权认证)
                    message_type: this.dicts.SOCKET_MESSAGE_TYPE__UPDATE_AUTH,
                    // 消息数据
                    data: {
                      // 角色类型
                      role_type: this.roleType,
                      // 登录鉴权
                      token: this.getAuthToken()
                    }
                  }))) {
                    return await logout();
                  }
                  return;

                  // 否则鉴权失败
                } else {
                  return await logout();
                }

                // 411: 强制退出(当前用户账号在另一台设备上登录)
              } else if (data.code === this.dicts.CODE__LOGOUT) {
                return await logout();
              }

              // 处理业务错误
              const resBusinessError = await (0, _runAsync.default)(this.onBusinessError, this)({
                data,
                onError: _error
              });
              if (!(0, _isNil.default)(resBusinessError)) {
                return resBusinessError;
              }
              return await _error(data);
            }

            // 返回成功
            // ------------------------------

            // 如果没有完成
            if (!isCompleted) {
              // 【调试模式】
              /* #if IS_DEBUG */
              console.info('[socket 开启成功]');
              /* #endif */

              _complete(true);
              return;
            }

            // 聊天消息类型(1:更新鉴权认证)
            if ((0, _has.default)(data, 'data.message_type') && data.data.message_type === this.dicts.SOCKET_MESSAGE_TYPE__UPDATE_AUTH) {
              // 此时继续发送队列中的数据
              if (this.query.length) {
                const newQuery = [];
                for (const item of this.query) {
                  newQuery.push(item);
                }
                for (const item of newQuery) {
                  if (!(await this._send(item.data))) {
                    this.deleteQuery(item.data.message_id);
                    if ((0, _has.default)(item, 'resolve')) {
                      item.resolve(_result(false, {
                        code: this.dicts.CODE__FAIL,
                        msg: '发送失败',
                        data: item.data
                      }));
                    }
                  }
                }
              }
              return;
            }

            // 获取返回的消息 id
            if ((0, _has.default)(data, 'data.message_id')) {
              // 如果有消息 id
              if (data.data.message_id) {
                // 如果消息队列中存在该 id
                const index = (0, _findIndex.default)(this.query, e => e.data.message_id === data.data.message_id);
                if (index > -1) {
                  const item = this.query[index];
                  this.query.splice(index, 1);
                  if ((0, _has.default)(item, 'resolve')) {
                    item.resolve(_result(true, {
                      data: data.data
                    }));
                    return;
                  }
                }
              }
              (0, _run.default)(this._onMessage)(_result(true, {
                data: data.data
              }));
            }
            return;
          }
        }

        // 【调试模式】
        // --------------------------------------------------
        // #ifdef IS_DEBUG
        console.log('[socket result]', data);
        // #endif
        // --------------------------------------------------

        await _error({
          // 错误码
          code: this.dicts.CODE__FAIL,
          // 错误信息
          msg: 'Data error',
          data: {
            message_type: this.dicts.SOCKET_MESSAGE_TYPE__PARAMS_ERROR
          }
        });
      });

      /**
       * 监听关闭事件
       */
      this.$socket.onClose.call(this, () => {
        // 【调试模式】
        /* #if IS_DEBUG */
        console.info('[socket 关闭]');
        /* #endif */

        this.socket = null;
        (0, _run.default)(this._onClose)();
      });
    });
  }

  /**
   * 重新连接
   */
  async reconnect() {
    await this.close();
    return await this.connect();
  }

  /**
   * 监听消息事件
   */
  onMessage(_onMessage) {
    this._onMessage = _onMessage;
  }

  /**
   * 监听关闭事件
   */
  onClose(_onClose) {
    this._onClose = _onClose;
  }

  /**
   * 删除队列
   */
  deleteQuery(messageId) {
    const index = (0, _findIndex.default)(this.query, e => e.data.message_id === messageId);
    if (index > -1) {
      this.query.splice(index, 1);
    }
  }

  /**
   * 获取消息 id
   */
  getMessageId() {
    return `${this.roleType}-${this._num++}-${Date.now()}`;
  }

  /**
   * 发送消息
   */
  send(params) {
    if (this._sending) {
      return;
    }
    this._sending = true;
    return new Promise(async resolve => {
      const {
        message_id,
        message_type,
        data
      } = Object.assign({
        // 消息 id
        message_id: '',
        // 消息类型
        message_type: 0,
        // 消息数据
        data: {}
      }, params);

      // 发送数据
      const messageData = {
        // 消息唯一 id
        message_id: message_id ? message_id : this.getMessageId(),
        // 消息类型
        message_type,
        // 消息数据
        data
      };

      // 添加至消息队列
      const query = {
        // 消息数据
        data: messageData
      };
      if (message_id) {
        // promise 提交事件
        query.resolve = resolve;
      }
      this.query.push(query);

      // 失败事件
      const _error = () => {
        this._sending = false;
        this.deleteQuery(messageData.message_id);
        resolve((0, _fail.default)('发送失败'));
      };

      // 如果连接失败
      if (!(await this.connect())) {
        return _error();
      }

      // 清空更新鉴权认证次数
      this._updatedAuthTokenNum = 0;

      // 如果发送失败
      if (!(await this._send(messageData))) {
        // 如果重新连接又失败
        if (!(await this.reconnect())) {
          return _error();
        }

        // 清空更新鉴权认证次数
        this._updatedAuthTokenNum = 0;

        // 如果重新发送又失败
        if (!(await this._send(messageData))) {
          return _error();
        }
      }
      this._sending = false;
      if (!message_id) {
        resolve((0, _success.default)());
      }
    });
  }

  /**
   * 关闭连接
   */
  close() {
    return new Promise(resolve => {
      if (this.socket) {
        this.$socket.close.call(this, () => {
          this.socket = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * ==============================【私有函数】==============================
   */

  /**
   * 发送消息
   */
  _send(data) {
    return new Promise(resolve => {
      if (this.socket) {
        this.$socket.send.call(this, JSON.stringify(data), resolve);
      } else {
        resolve(false);
      }
    });
  }
}
exports.default = Socket;