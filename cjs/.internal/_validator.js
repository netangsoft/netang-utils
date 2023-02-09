"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rule = rule;
exports.validate = validate;
exports.validator = validator;
var _isArray = _interopRequireDefault(require("lodash/isArray"));
var _isString = _interopRequireDefault(require("lodash/isString"));
var _indexOf = _interopRequireDefault(require("lodash/indexOf"));
var _has = _interopRequireDefault(require("lodash/has"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _startsWith = _interopRequireDefault(require("lodash/startsWith"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _trim = _interopRequireDefault(require("lodash/trim"));
var _toLower = _interopRequireDefault(require("lodash/toLower"));
var _get = _interopRequireDefault(require("lodash/get"));
var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));
var _join = _interopRequireDefault(require("lodash/join"));
var _map = _interopRequireDefault(require("lodash/map"));
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var _toPairs = _interopRequireDefault(require("lodash/toPairs"));
var _split = _interopRequireDefault(require("../split"));
var _isNumeric = _interopRequireDefault(require("../isNumeric"));
var _isValidArray = _interopRequireDefault(require("../isValidArray"));
var _isValidObject = _interopRequireDefault(require("../isValidObject"));
var _isValidString = _interopRequireDefault(require("../isValidString"));
var _isRequired = _interopRequireDefault(require("../isRequired"));
var _size = _interopRequireDefault(require("../size"));
var _numberDeep = _interopRequireDefault(require("../numberDeep"));
var _replaceAll = _interopRequireDefault(require("../replaceAll"));
var _trans = _interopRequireWildcard(require("../trans"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 表单验证
 */

// 全部都不是 required
function allFailingRequired(data, vals) {
  for (let i = 0, len = vals.length; i < len; i++) {
    if ((0, _isRequired.default)(data[vals[i]])) {
      return false;
    }
  }
  return true;
}
function anyFailingRequired(data, vals) {
  for (let i = 0, len = vals.length; i < len; i++) {
    if (!(0, _isRequired.default)(data[vals[i]])) {
      return true;
    }
  }
  return false;
}
function getSize(value, type) {
  // 如果为数字
  if (type === 'numeric') {
    return (0, _isNumeric.default)(value) ? value : false;
  }

  // 如果为数组
  if (type === 'array') {
    return (0, _isArray.default)(value) ? value.length : false;
  }

  // 否则为字符串
  return (0, _isString.default)(value) || (0, _isNumeric.default)(value) ? String(value).length : false;
}

/**
 * gte:field
 * 验证字段必须大于或等于给定的 field 。
 * 字符串、数字、数组和文件都使用 size 进行相同的评估。
 */
function gte(value, {
  type,
  val
}) {
  const size = getSize(value, type);
  if (size === false) {
    return false;
  }
  return size >= val;
}

/**
 * lte:field
 * 验证中的字段必须小于或等于给定的 字段 。
 * 字符串、数值、数组和文件大小的计算方式与 size 方法进行评估。
 */
function lte(value, {
  type,
  val
}) {
  const size = getSize(value, type);
  if (size === false) {
    return false;
  }
  return size <= val;
}

/**
 * in:foo,bar,…
 * 验证字段必须包含在给定的值列表中。
 */
function _in(value, {
  vals
}) {
  if ((0, _isValidArray.default)(value)) {
    for (let i = 0, len = value.length; i < len; i++) {
      if ((0, _indexOf.default)(vals, value[i]) === -1) {
        return false;
      }
    }
    return true;
  }
  if ((0, _isString.default)(value) || (0, _isNumeric.default)(value)) {
    return (0, _indexOf.default)(vals, value) > -1;
  }
  return false;
}
const ruleMethods = {
  /**
   * alpha
   * 待验证字段只能由字母组成。
   */
  alpha(value) {
    return /^[A-Za-z]+$/.test(value);
  },
  /**
   * alpha_dash
   * 待验证字段可能包含字母、数字，短破折号（-）和下划线（_）。
   */
  alpha_dash(value) {
    return /^[A-Za-z0-9\-\_]+$/.test(value);
  },
  /**
   * alpha_num
   * 待验证字段只能由字母和数字组成。
   */
  alpha_num(value) {
    return /^[A-Za-z0-9]+$/.test(value);
  },
  /**
   * array
   * 待验证字段必须是有效的数组。
   */
  array(value) {
    return (0, _isArray.default)(value);
  },
  /**
   * between:min,max
   * 验证字段的大小必须在给定的 min 和 max 之间。
   * 字符串、数字、数组的计算方式都使用 size 方法。
   */
  between(value, {
    vals,
    type
  }) {
    const size = getSize(value, type);
    if (size === false) {
      return false;
    }
    return size >= vals[0] && size <= vals[1];
  },
  /**
   * boolean
   * 验证的字段必须可以转换为 Boolean 类型。 可接受的输入为 true ， false ， 1 ， 0 ， "1" 和 "0" 。
   */
  boolean(value) {
    return value === true || value === false || value === 0 || value === 1 || value === '0' || value === '1';
  },
  /**
   * confirmed
   * 验证字段必须具有匹配字段 foo_confirmation 。
   * 例如，验证字段为 password ，输入中必须存在与之匹配的 password_confirmation 字段。
   */
  confirmed(value, {
    data,
    key
  }) {
    const index = key.length - 13;
    if (key.substring(index) === '_confirmation') {
      const compareKey = key.substr(0, index);
      if ((0, _has.default)(data, compareKey)) {
        return (0, _isEqual.default)(String(data[compareKey]), String(value));
      }
    }
    return false;
  },
  /**
   * different:field
   * 验证的字段值必须与字段 field 的值不同。
   */
  different(value, {
    other
  }) {
    return other != null && value !== other;
  },
  /**
   * digits_between:min,max
   * 验证中的字段必须为 numeric，并且长度必须在给定的 min 和 max 之间。
   */
  digits(value, {
    val
  }) {
    return (0, _isNumeric.default)(value) && String(value).length === val;
  },
  /**
   * digits_between:min,max
   * 验证中的字段必须为 numeric，并且长度必须在给定的 min 和 max 之间。
   */
  digits_between(value, {
    vals
  }) {
    if ((0, _isNumeric.default)(value)) {
      const len = String(value).length;
      return len >= vals[0] && len <= vals[1];
    }
    return false;
  },
  /**
   * email
   * 验证的字段必须符合 e-mail 地址格式。
   */
  email(value) {
    return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(value);
  },
  /**
   * gt:field
   * 验证字段必须大于给定的 _field_。
   * 字符串、数字、数组都使用 size 进行相同的评估。
   */
  gt(value, {
    type,
    val
  }) {
    const size = getSize(value, type);
    if (size === false) {
      return false;
    }
    return size > val;
  },
  /**
   * gte:field
   * 验证字段必须大于或等于给定的 field 。
   * 字符串、数字、数组和文件都使用 size 进行相同的评估。
   */
  gte,
  /**
   * lt:field
   * 验证的字段必须小于给定的字段。
   * 字符串、数值、数组和文件大小的计算方式与 size 方法进行评估。
   */
  lt(value, {
    type,
    val
  }) {
    const size = getSize(value, type);
    if (size === false) {
      return false;
    }
    return size < val;
  },
  /**
   * lte:field
   * 验证中的字段必须小于或等于给定的 字段 。
   * 字符串、数值、数组和文件大小的计算方式与 size 方法进行评估。
   */
  lte,
  /**
   * max:value
   * 验证中的字段必须小于或等于 value。
   * 字符串、数字、数组的计算方式都用 size规则。
   */
  max: lte,
  /**
   * min:value
   * 验证字段必须具有最小值。
   * 字符串，数值，数组的计算方式都与 size 规则一致。
   */
  min: gte,
  /**
   * in:foo,bar,…
   * 验证字段必须包含在给定的值列表中。
   */
  in: _in,
  /**
   * not_in:foo,bar,…
   * 验证字段不能包含在给定的值的列表中。
   */
  not_in(value, res) {
    return !_in(value, res);
  },
  /**
   * integer
   * 验证的字段必须是整数。
   */
  integer(value) {
    return /^[\-+]?[0-9]+$/.test(value);
  },
  /**
   * numeric
   * 验证字段必须为数值。
   */
  numeric(value) {
    return (0, _isNumeric.default)(value);
  },
  /**
   * regex:pattern
   * 验证字段必须与给定的正则表达式匹配。
   * 验证时，这个规则使用 PHP 的 preg_match 函数。
   * 指定的模式应遵循 preg_match 所需的相同格式，也包括有效的分隔符。
   * 例如： 'email' => 'not_regex:/^.+$/i'
   */
  regex(value, {
    oldVal
  }) {
    return oldVal.test(value);
  },
  /**
   * not_regex:pattern
   * 验证字段必须与给定的正则表达式不匹配。
   * 验证时，这个规则使用 PHP 的 preg_match 函数。
   * 指定的模式应遵循 preg_match 所需的相同格式，也包括有效的分隔符。
   * 例如： 'email' => 'not_regex:/^.+$/i'
   */
  not_regex(value, {
    oldVal
  }) {
    return !oldVal.test(value);
  },
  /**
   * required
   * 验证的字段必须存在于输入数据中，而不是空。如果满足以下条件之一，则字段被视为「空」
   * @param value null/空字符串/空对象
   * @returns {boolean}
   */
  required: _isRequired.default,
  /**
   * required_if:anotherfield,value,…
   * 如果其它字段 anotherfield 为任一值(value1 或 value2 或 value3 等, 也可只有一个 value1), 则此验证字段必须存在且不为空
   */
  required_if(value, {
    other,
    vals
  }) {
    return (0, _isRequired.default)(value) || !(0, _isRequired.default)(other) || (0, _indexOf.default)(vals, other) === -1;
  },
  /**
   * required_unless:anotherfield,value,…
   * 如果其它字段 _anotherfield_ 不等于任一值 _value_ ，则此验证字段必须存在且不为空
   */
  required_unless(value, {
    other,
    vals
  }) {
    if ((0, _indexOf.default)(vals, other) === -1) {
      return (0, _isRequired.default)(value);
    }
    return true;
  },
  /**
   * required_with:foo,bar,…
   * 在其他任一指定字段出现时，验证的字段才必须存在且不为空。
   */
  required_with(value, {
    data,
    vals
  }) {
    if (!allFailingRequired(data, vals)) {
      return (0, _isRequired.default)(value);
    }
    return true;
  },
  /**
   * required_with_all:foo,bar,…
   * 只有在其他指定字段全部出现时，验证的字段才必须存在且不为空。
   */
  required_with_all(value, {
    data,
    vals
  }) {
    if (!anyFailingRequired(data, vals)) {
      return (0, _isRequired.default)(value);
    }
    return true;
  },
  /**
   * required_without:foo,bar,…
   * 在其他指定任一字段不出现时，验证的字段才必须存在且不为空。
   */
  required_without(value, {
    data,
    vals
  }) {
    if (anyFailingRequired(data, vals)) {
      return (0, _isRequired.default)(value);
    }
    return true;
  },
  /**
   * required_without_all:foo,bar,…
   * 只有在其他指定字段全部不出现时，验证的字段才必须存在且不为空。
   */
  required_without_all(value, {
    data,
    vals
  }) {
    if (allFailingRequired(data, vals)) {
      return (0, _isRequired.default)(value);
    }
    return true;
  },
  /**
   * same:field
   * 验证字段的值必须与给定字段的值相同。
   */
  same(value, {
    other
  }) {
    return (0, _isEqual.default)(value, other);
  },
  /**
   * size:value
   * 验证字段必须与给定值的大小一致。
   * 对于字符串，value 对应字符数。
   * 对于数字，value 对应给定的整数值（attribute 必须有 numeric 或者 integer 规则）。
   * 对于数组，size 对应数组的 count 值。
   */
  size(value, {
    val,
    type
  }) {
    const size = getSize(value, type);
    if (size === false) {
      return false;
    }
    return size === val;
  },
  /**
   * starts_with:foo,bar,…
   * 验证字段必须以给定值之一开头。
   */
  starts_with(value, {
    vals
  }) {
    if ((0, _isString.default)(value) || (0, _isNumeric.default)(value)) {
      for (let i = 0, len = vals.length; i < len; i++) {
        if ((0, _startsWith.default)(value, vals[i])) {
          return true;
        }
      }
      return false;
    }
  },
  /**
   * string
   * 验证字段必须是一个字符串。
   */
  string(value, {
    oldValue
  }) {
    return (0, _isNumeric.default)(oldValue) || (0, _isString.default)(oldValue);
  },
  /**
   * url
   * 验证的字段必须是有效的 URL。
   */
  url(value) {
    const strRegex = '^((https|http|ftp|rtsp|mms)?://)' + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
    + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
    + '|' // 允许IP和DOMAIN（域名）
    + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
    + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
    + '[a-z]{2,6})' // first level domain- .com or .museum
    + '(:[0-9]{1,4})?' // 端口- :80
    + '((/?)|' // a slash isn't required if there is no file name
    + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
    return new RegExp(strRegex).test(value);
  },
  /**
   * chs
   * 字段必须为: 汉字
   */
  chs(value) {
    return /^[\u4E00-\u9FA5]+$/u.test(value);
  },
  /**
   * chs_alpha
   * 字段必须为: 汉字、字母
   */
  chs_alpha(value) {
    return /^[\u4E00-\u9FA5a-zA-Z]+$/u.test(value);
  },
  /**
   * chs_alpha_dash
   * 字段必须为: 汉字、字母、数字，短破折号（-）和下划线（_）。
   */
  chs_alpha_dash(value) {
    return /^[\u4E00-\u9FA5a-zA-Z0-9_\-]+$/u.test(value);
  },
  /**
   * chs_alpha_num
   * 字段必须为: 汉字、字母和数字
   */
  chs_alpha_num(value) {
    return /^[\u4E00-\u9FA5a-zA-Z0-9]+$/u.test(value);
  },
  /**
   * chs_between:min,max
   * 验证中的字段必须为字符串
   * 中文为 2 位, 英文为 1 位
   * 并且长度必须在给定的 min 和 max 之间。
   */
  chs_between(value, {
    vals
  }) {
    if ((0, _isString.default)(value) || (0, _isNumeric.default)(value)) {
      const len = (0, _size.default)(value);
      return len >= vals[0] && len <= vals[1];
    }
    return false;
  },
  /**
   * natural(0,1,2,3, etc.)
   * 字段必须为: 自然数(包含零)
   */
  natural(value) {
    return /^[0-9]+$/.test(value) && value >= 0;
  },
  /**
   * natural_no_zero(1,2,3, etc.)
   * 字段必须为: 自然数(不包含零)
   */
  natural_no_zero(value) {
    return /^[0-9]+$/.test(value) && value > 0;
  },
  /**
   * mobile
   * 字段必须为: 有效的手机号码
   */
  mobile(value) {
    return /^1[1-9]\d{9}$/.test(typeof value === 'number' ? String(value) : value);
  },
  /**
   * 手机号码/固定电话号码/400电话
   * 字段必须为: 有效的手机号码/固定电话号码/400电话
   *
   * 合法数据⽰例：
   * 13812341234
   *
   * 0553-5801207
   * 05535801207
   *
   * 400-020-9800
   * 400-0588-010
   * 400-0211-0112
   *
   * 4000209800
   * 4000588010
   * 40002110112
   */
  phone(value) {
    return /^1[1-9]\d{9}$|^\d{3,4}-?\d{7,8}$|^400(-?\d{3,4}){2}?$/.test(typeof value === 'number' ? String(value) : value);
  }

  // /**
  //  * Length
  //  *
  //  * 验证字段长度范围
  //  * rule     {min：6, max：30}
  //  * 中文 2 个字符
  //  * 英文 1 个字符
  //  */
  // length(str, rule = {}) {
  //     const len = utils.getLen($n_trim(str))
  //
  //     if (rule.min > 0 && rule.max > 0) {
  //         return len >= rule.min && len <= rule.max
  //     } else if (rule.min > 0 && rule.max == null) {
  //         return len >= rule.min
  //     } else if (rule.max > 0 && rule.min == null) {
  //         return len <= rule.max
  //     }
  //
  //     return false
  // },
  //
  // /**
  //  * max_cn
  //  *
  //  * 验证字段最大长度
  //  * 中文 2 个字符
  //  * 英文 1 个字符
  //  */
  // max(str, val = '') {
  //
  //     let len
  //     if ($n_isArray(str)) {
  //         len = str.length
  //
  //     } else {
  //         len = utils.getLen($n_trim(str))
  //     }
  //
  //     return len <= val
  // },
  //
  // /**
  //  * min_cn
  //  *
  //  * 验证字段最大长度
  //  * 中文 2 个字符
  //  * 英文 1 个字符
  //  */
  // min(str, val = '') {
  //
  //     let len
  //     if ($n_isArray(str)) {
  //         len = str.length
  //
  //     } else {
  //         len = utils.getLen($n_trim(str))
  //     }
  //
  //     return len >= val
  // },
};

const requiredRules = ['required', 'filled', 'required_with', 'required_with_all', 'required_without', 'required_without_all', 'required_if', 'required_unless'];
const sizeRules = ['between', 'gt', 'gte', 'lt', 'lte', 'max', 'min', 'size', 'max_if', 'min_if', 'between_if'];
const otherRules = ['different', 'in_array', 'required_if', 'required_unless', 'same', 'max_if', 'min_if', 'between_if'];
const typeRules = ['numeric', 'integer', 'string', 'array'];
const betweenRules = ['between', 'digits_between', 'chs_between'];

// 当 values 是字段时的规则
const valueAttributesRules = ['required_with', 'required_with_all', 'required_without', 'required_without_all'];

/**
 * 检查类型
 * @param {array} rules
 * @param {array} ruleArray
 * @returns {boolean|string}
 */
function checkInRules(rules, ruleArray) {
  for (let i = 0, len = ruleArray.length; i < len; i++) {
    for (let key in ruleArray[i]) {
      const index = (0, _indexOf.default)(rules, key);
      if (index > -1) {
        return rules[index];
      }
    }
  }
  return false;
}

/**
 * 获取属性翻译
 * @param key
 */
function transAttributes(key) {
  const transKey = (0, _toLower.default)(key);

  // 先从 validation.attributes 中找
  const str = (0, _get.default)(_trans.langSettings.package, `validation.attributes.${transKey}`, '');

  // 如果没有再从常用字段中找
  return str ? str : (0, _get.default)(_trans.langSettings.package, 'g.' + transKey, key);
}

/**
 * 自定义 验证器
 */
function checkRule(data, key, oldValue, ruleKey, ruleValue, valueType, formatMessages, formatAttributes) {
  // 如果为必填字段或值存在, 则继续验证
  if ((0, _indexOf.default)(requiredRules, ruleKey) > -1 || (0, _isRequired.default)(oldValue)) {
    // 格式化 number
    const value = (0, _numberDeep.default)(oldValue);

    // 将规则值转为数组
    const ruleValues = (0, _numberDeep.default)((0, _isString.default)(ruleValue) ? (0, _split.default)(ruleValue, ',') : [ruleValue]);

    // 替换错误信息的对象
    const replace = {};

    // 如果有 other 值, 则取出 ruleValues 第一个值为 other 值
    const isOther = (0, _indexOf.default)(otherRules, ruleKey) > -1;
    let otherKey;
    let ohterValue;
    if (isOther) {
      otherKey = ruleValues.shift();
      ohterValue = (0, _has.default)(data, otherKey) ? (0, _numberDeep.default)(data[otherKey]) : null;
    }

    // 如果有数据类型 && 如果存在比较条件
    if (valueType && (0, _indexOf.default)(['gt', 'gte', 'lt', 'lte'], ruleKey) > -1) {
      let val = ruleValues[0];

      // 如果值为数字类型
      if ((0, _isNumeric.default)(val)) {

        // 否则判断其他字段的值类型
      } else if ((0, _isString.default)(val) && (0, _has.default)(data, val) && data[val] != null) {
        val = data[val];

        // 如果为数字
        if ((0, _isNumeric.default)(val)) {
          val = (0, _numberDeep.default)(val);

          // 如果为数组/字符串
        } else if ((0, _isArray.default)(val) || (0, _isString.default)(val)) {
          val = val.length;
        } else {
          val = 0;
        }
      } else {
        val = 0;
      }
      ruleValues[0] = val;
    }

    // 执行参数
    const params = Object.assign({
      data,
      key,
      oldValue,
      oldVal: ruleValue,
      type: valueType,
      val: ruleValues[0],
      vals: ruleValues
    }, replace);
    if (isOther) {
      params.other = ohterValue;
      params.otherKey = otherKey;
    }

    // 开始验证数据
    const res = ruleMethods[ruleKey](value, params);
    if (!res) {
      // 获取属性值
      let attribute = (0, _get.default)(formatAttributes, key, '');
      if ((0, _isEmpty.default)(attribute)) {
        attribute = transAttributes(key);
      }

      // 获取错误信息
      let message = (0, _get.default)(formatMessages, `${key}.${ruleKey}`, '');
      if ((0, _isEmpty.default)(message)) {
        // 是否是多类型
        const isSizeType = (0, _indexOf.default)(sizeRules, ruleKey) > -1;
        message = (0, _trans.default)(`validation.${ruleKey}${isSizeType && valueType ? '.' + valueType : ''}`);
      }
      replace.attribute = attribute;
      replace.value = (0, _join.default)(ruleValues, ', ');

      // 如果有 other 字段
      if (isOther) {
        let other = (0, _get.default)(formatAttributes, otherKey, '');
        if ((0, _isEmpty.default)(other)) {
          other = transAttributes(otherKey);
        }
        replace.other = other;

        // 如果 other 的值在 values 中
        if ((0, _indexOf.default)(ruleValues, ohterValue) > -1) {
          replace.value = ohterValue;
        }
      }

      // 如果是 value 为字段属性, 则将 values 替换成属性值
      if ((0, _indexOf.default)(valueAttributesRules, ruleKey) > -1) {
        replace.value = (0, _join.default)((0, _map.default)(ruleValues, function (val) {
          return transAttributes(val);
        }), ' / ');
      }

      // 如果有 min 和 max 值
      if ((0, _indexOf.default)(betweenRules, ruleKey) > -1) {
        replace.min = ruleValues[0];
        replace.max = ruleValues[1];
      }

      // 替换变量
      for (const key in replace) {
        message = (0, _replaceAll.default)(message, ':' + key, replace[key]);
      }
      return message;
    }
  }
}

// ---------------------------------------------------------------------------------------

/**
 * 规则验证
 */
function rule(method, value, params) {
  if (!(0, _isFunction.default)(ruleMethods[method])) {
    console.error(`${method} method does not exist`);
    return;
  }
  return ruleMethods[method]((0, _isString.default)(value) ? (0, _trim.default)(value) : value, params);
}

/**
 * 验证语言翻译替换
 */
// function transValidation(ruleKey, attribute, replace) {
//     return trans(`validation.${ruleKey}`, Object.assign({
//         attribute: transAttributes(attribute)
//     }, replace))
// }

/**
 * 验证器
 * @param data 验证数据
 * @param {array} rules 验证规则
 * @param {object} messages 自定义错误
 * @param {object} attributes 自定义属性
 */
function validator(data, rules, messages = null, attributes = null) {
  // 格式化自定义错误
  const formatMessages = {};
  if ((0, _isValidObject.default)(messages)) {
    for (const key in messages) {
      const keys = (0, _split.default)(key, '.');
      if (keys.length >= 2) {
        if (!(0, _has.default)(formatMessages, keys[0])) {
          formatMessages[keys[0]] = {};
        }
        formatMessages[keys[0]][keys[1]] = messages[key];
      }
    }
  }

  // 格式化自定义属性
  const formatAttributes = {};
  if ((0, _isValidObject.default)(attributes)) {
    for (const key in attributes) {
      formatAttributes[key] = attributes[key];
    }
  }
  if ((0, _isValidObject.default)(rules)) {
    for (let key in rules) {
      // 获取单条规则
      let ruleArray = rules[key];

      // 如果为字符串, 则格式化为数组
      if ((0, _isString.default)(ruleArray)) {
        ruleArray = (0, _split.default)(ruleArray, '|');
      }

      // 如果为数组
      if ((0, _isValidArray.default)(ruleArray)) {
        const arr = [];
        for (const value of ruleArray) {
          // 如果为字符串
          if ((0, _isString.default)(value)) {
            const vals = (0, _split.default)(value, ':');
            const isLen1 = vals.length === 1;
            if (isLen1 || vals.length === 2) {
              const obj = {};
              obj[vals[0]] = isLen1 ? true : vals[1];
              arr.push(obj);
            }

            // 如果为对象
          } else if ((0, _isValidObject.default)(value)) {
            arr.push(value);
          }
        }
        if (arr.length) {
          ruleArray = arr;

          // 克隆一份 data 做为验证数据
          data = (0, _cloneDeep.default)(data);

          // 如果有 sizeRules 则需要验证值的 类型, 并且存在 min 或 max
          let valueType = '';
          if (checkInRules(sizeRules, ruleArray) !== false) {
            // 获取值类型
            valueType = checkInRules(typeRules, ruleArray);
            if (valueType === false) {
              valueType = 'string';
            } else if (valueType === 'integer') {
              valueType = 'numeric';
            }
          }
          for (let i = 0, len = ruleArray.length; i < len; i++) {
            // 将单个规则对象转为数组
            const rule = (0, _toPairs.default)(ruleArray[i])[0];

            // 是否存在验证方法
            if (!(0, _has.default)(ruleMethods, rule[0])) {
              console.error(rule[0] + '验证方法不存在');
              return;
            }

            // 判断验证结果
            const msg = checkRule(data, key, (0, _has.default)(data, key) ? data[key] : null, rule[0], rule[1], valueType, formatMessages, formatAttributes);
            if (msg) {
              return {
                key,
                msg
              };
            }
          }
        }
      }
    }
  }
}

/**
 * 单个验证器
 * @param {any} value
 * @param {{id: string, token: string}} field
 * @param {string} rule
 * @param {string} message
 * @param {string} attribute
 * @returns {string}
 */
function validate(value, field = '', rule = '', message = '', attribute = null, data = null) {
  if (!(0, _isValidObject.default)(data)) {
    data = {};
    data[field] = value;
  }
  const rules = {};
  rules[field] = (0, _isEmpty.default)(rule) ? 'required|' + field : rule;
  const messages = {};
  if ((0, _isValidString.default)(message)) {
    messages[field] = message;
  }
  let attributes = {};
  if ((0, _isValidString.default)(attribute)) {
    attributes[field] = attribute;
  } else if ((0, _isValidObject.default)(attribute)) {
    attributes = attribute;
  }
  const res = validator(data, rules, messages, attributes);
  if (res) {
    return res.msg;
  }
  return '';
}