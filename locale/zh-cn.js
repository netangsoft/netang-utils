const valueInvalid = ':attribute不正确'
const formatInvalid = ':attribute格式不正确'
const required = ':attribute不能为空'

module.exports = {

    g: {},

    // Validator
    validation: {

        'alpha': ':attribute只能包含字母',
        'alpha_dash': ':attribute只能包含字母、数字、中划线或下划线',
        'alpha_num': ':attribute只能包含字母和数字',
        'array': ':attribute的格式必须是一个数组',
        'between': {
            'numeric': ':attribute的值必须在 :min 到 :max 之间',
            'string': ':attribute的长度必须在 :min 到 :max 个字符之间',
            'array': ':attribute中必须包括 :min 到 :max 个值',
        },
        'boolean': valueInvalid,
        'confirmed': '两次填写的:attribute不一致',
        'different': ':attribute和:other的值不能相同',
        'digits': ':attribute必须是 :value 位',
        'digits_between': ':attribute必须在 :min 和 :max 位之间',
        'email': formatInvalid,
        'gt': {
            'numeric': ':attribute的值必须大于 :value',
            'string': ':attribute的长度必须大于 :value 个字符',
            'array': ':attribute必须大于 :value 项',
        },
        'gte': {
            'numeric': ':attribute的值必须大于等于 :value',
            'string': ':attribute的长度必须大于等于 :value 个字符',
            'array': ':attribute必须大于等于 :value 项',
        },
        'in': valueInvalid,
        'integer': ':attribute必须是整数',
        'lt': {
            'numeric': ':attribute的值必须小于 :value',
            'string': ':attribute的长度必须小于 :value 个字符',
            'array': ':attribute必须小于 :value 项',
        },
        'lte': {
            'numeric': ':attribute的值必须小于等于 :value',
            'string': ':attribute的长度必须小于等于 :value 个字符',
            'array': ':attribute必须小于等于 :value 项',
        },
        'max': {
            'numeric': ':attribute的最大值为 :value',
            'string': ':attribute的最大长度为 :value 字符',
            'array': ':attribute至多有 :value 项',
        },
        'min': {
            'numeric': ':attribute的最小值为 :value',
            'string': ':attribute的最小长度为 :value 字符',
            'array': ':attribute至少有 :value 项',
        },
        'not_in': valueInvalid,
        'not_regex': formatInvalid,
        'numeric': ':attribute必须是数字',
        'regex': formatInvalid,
        'required': required,
        'required_if': required,
        'required_unless': required,
        'required_with': required,
        'required_with_all': required,
        'required_without': required,
        'required_without_all': required,

        'same': ':attribute和:other的值不相同',
        'size': {
            'numeric': ':attribute的值必须是 :value',
            'string': ':attribute的长度必须是 :value 个字符',
            'array': ':attribute必须包括 :value 项',
        },
        'starts_with': ':attribute必须以 :value 为开头',
        'string': ':attribute必须是字符串',
        'url': formatInvalid,

        // 自定义
        // 'chs': ':attribute只能包含汉字',
        // 'chs_alpha': ':attribute只能包含汉字和字母',
        // 'chs_alpha_dash': ':attribute只能包含汉字、字母、数字、中划线或下划线',
        // 'chs_alpha_num': ':attribute只能包含汉字、字母和数字',
        // 'chs_between': ':attribute的长度必须在 :min 到 :max 个字之间',
        // 'natural': ':attribute必须是自然数',
        // 'natural_no_zero': ':attribute必须大于 0',
        'mobile': formatInvalid,

        // 常用
        'value_invalid': valueInvalid,
        'format_invalid': formatInvalid,

        /*
        |--------------------------------------------------------------------------
        | Custom Validation Attributes
        |--------------------------------------------------------------------------
        |
        | The following language lines are used to swap attribute place-holders
        | with something more reader friendly such as E-Mail Address instead
        | of "email". This simply helps us make messages a little cleaner.
        |
        */
        'attributes': {

        },
    }
}
