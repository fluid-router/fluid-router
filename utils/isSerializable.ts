// https://stackoverflow.com/questions/30579940/reliable-way-to-check-if-objects-is-serializable-in-javascript/30712764

import isUndefined from 'lodash/isUndefined'
import isBoolean from 'lodash/isBoolean'
import isNumber from 'lodash/isNumber'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
import isArray from 'lodash/isArray'
import isNull from 'lodash/isNull'

export default function isSerializable(obj) {
    if (isUndefined(obj) || isNull(obj) || isBoolean(obj) || isNumber(obj) || isString(obj)) {
        return true
    }

    if (!isPlainObject(obj) && !isArray(obj)) {
        return false
    }

    for (var key in obj) {
        if (!isSerializable(obj[key])) {
            return false
        }
    }

    return true
}
