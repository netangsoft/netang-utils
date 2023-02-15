const valueInvalid = 'The :attribute field is invalid.'
const formatInvalid = 'The :attribute format is invalid.'
const required = 'The :attribute field is required.'

const en = {

    g: {},

    // Validator
    validation: {

        'alpha': 'The :attribute may only contain letters.',
        'alpha_dash': 'The :attribute may only contain letters, numbers, and dashes.',
        'alpha_num': 'The :attribute may only contain letters and numbers.',
        'array': 'The :attribute must be an array.',
        'between': {
            'numeric': 'The :attribute must be between :min and :max.',
            'string': 'The :attribute must be between :min and :max characters.',
            'array': 'The :attribute must have between :min and :max items.',
        },
        'boolean': valueInvalid,
        'confirmed': 'The :attribute confirmation does not match.',
        'different': 'The :attribute and :other must be different.',
        'digits': 'The :attribute must be :digits digits.',
        'digits_between': 'The :attribute must be between :min and :max digits.',
        'email': formatInvalid,
        'gt': {
            'numeric': 'The :attribute must be greater than :value',
            'string': 'The :attribute must be greater than :value characters',
            'array': 'The :attribute must be greater than :value items',
        },
        'gte': {
            'numeric': 'The :attribute must be great than or equal to :value',
            'string': 'The :attribute must be great than or equal to :value characters',
            'array': 'The :attribute must be great than or equal to :value items',
        },
        'in': valueInvalid,
        'integer': 'The :attribute must be an integer.',
        'lt': {
            'numeric': 'The :attribute must be less than :value',
            'string': 'The :attribute must be less than :value characters',
            'array': 'The :attribute must be less than :value items',
        },
        'lte': {
            'numeric': 'The :attribute must be less than or equal to :value',
            'string': 'The :attribute must be less than or equal to :value characters',
            'array': 'The :attribute must be less than or equal to :value items',
        },
        'max': {
            'numeric': 'The :attribute may not be greater than :value.',
            'string': 'The :attribute may not be greater than :value characters.',
            'array': 'The :attribute may not have more than :value items.',
        },
        'min': {
            'numeric': 'The :attribute must be at least :value.',
            'string': 'The :attribute must be at least :value characters.',
            'array': 'The :attribute must have at least :value items.',
        },
        'not_in': valueInvalid,
        'not_regex': formatInvalid,
        'numeric': 'The :attribute must be a number.',
        'regex': formatInvalid,
        'required': required,
        'required_if': required,
        'required_unless': required,
        'required_with': required,
        'required_with_all': required,
        'required_without': required,
        'required_without_all': required,

        'same': 'The :attribute and :other must match.',
        'size': {
            'numeric': 'The :attribute must be :value.',
            'string': 'The :attribute must be :value characters.',
            'array': 'The :attribute must contain :value items.',
        },
        'starts_with': 'The :attribute must be start with :value ',
        'string': 'The :attribute must be a string.',
        'url': formatInvalid,

        // customize
        'chs': 'The :attribute may only contain chinese, letters.',
        'chs_alpha': 'The :attribute may only contain chinese, letters.',
        'chs_alpha_dash': 'The :attribute may only contain chinese, letters, numbers, and dashes.',
        'chs_alpha_num': 'The :attribute may only contain chinese, letters and numbers.',
        'chs_between': 'The :attribute must be between :min and :max characters.',
        'natural': valueInvalid, // 'The :attribute must be a natural number.'
        'natural_no_zero': valueInvalid, // 'The :attribute must be a positive integer.'
        'mobile': formatInvalid,

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

module.exports = en