import Frampton from 'frampton/namespace';
import always from 'frampton-utils/always';
import apply from 'frampton-utils/apply';
import assert from 'frampton-utils/assert';
import compose from 'frampton-utils/compose';
import curry from 'frampton-utils/curry';
import curryN from 'frampton-utils/curry_n';
import equal from 'frampton-utils/equal';
import error from 'frampton-utils/error';
import extend from 'frampton-utils/extend';
import get from 'frampton-utils/get';
import hasLength from 'frampton-utils/has_length';
import hasProp from 'frampton-utils/has_prop';
import identity from 'frampton-utils/identity';
import immediate from 'frampton-utils/immediate';
import isArray from 'frampton-utils/is_array';
import isBoolean from 'frampton-utils/is_boolean';
import isDefined from 'frampton-utils/is_defined';
import isEmpty from 'frampton-utils/is_empty';
import isEqual from 'frampton-utils/is_equal';
import isFalse from 'frampton-utils/is_false';
import isFunction from 'frampton-utils/is_function';
import isNode from 'frampton-utils/is_node';
import isNothing from 'frampton-utils/is_nothing';
import isNull from 'frampton-utils/is_null';
import isNumber from 'frampton-utils/is_number';
import isNumeric from 'frampton-utils/is_numeric';
import isObject from 'frampton-utils/is_object';
import isPrimitive from 'frampton-utils/is_primitive';
import isPromise from 'frampton-utils/is_promise';
import isSomething from 'frampton-utils/is_something';
import isString from 'frampton-utils/is_string';
import isTrue from 'frampton-utils/is_true';
import isUndefined from 'frampton-utils/is_undefined';
import isValue from 'frampton-utils/is_value';
import log from 'frampton-utils/log';
import lazy from 'frampton-utils/lazy';
import memoize from 'frampton-utils/memoize';
import noop from 'frampton-utils/noop';
import not from 'frampton-utils/not';
import ofValue from 'frampton-utils/of_value';
import once from 'frampton-utils/once';
import warn from 'frampton-utils/warn';

/**
 * @name Utils
 * @namespace
 * @memberof Frampton
 */
Frampton.Utils = {};
Frampton.Utils.always = always;
Frampton.Utils.apply = apply;
Frampton.Utils.assert = assert;
Frampton.Utils.compose = compose;
Frampton.Utils.curry = curry;
Frampton.Utils.curryN = curryN;
Frampton.Utils.equal = equal;
Frampton.Utils.error = error;
Frampton.Utils.extend = extend;
Frampton.Utils.get = get;
Frampton.Utils.hasLength = hasLength;
Frampton.Utils.hasProp = hasProp;
Frampton.Utils.identity = identity;
Frampton.Utils.immediate = immediate;
Frampton.Utils.isArray = isArray;
Frampton.Utils.isBoolean = isBoolean;
Frampton.Utils.isDefined = isDefined;
Frampton.Utils.isEmpty = isEmpty;
Frampton.Utils.isEqual = isEqual;
Frampton.Utils.isFalse = isFalse;
Frampton.Utils.isFunction = isFunction;
Frampton.Utils.isNode = isNode;
Frampton.Utils.isNothing = isNothing;
Frampton.Utils.isNull = isNull;
Frampton.Utils.isNumber = isNumber;
Frampton.Utils.isNumeric = isNumeric;
Frampton.Utils.isObject = isObject;
Frampton.Utils.isPrimitive = isPrimitive;
Frampton.Utils.isPromise = isPromise;
Frampton.Utils.isSomething = isSomething;
Frampton.Utils.isString = isString;
Frampton.Utils.isTrue = isTrue;
Frampton.Utils.isUndefined = isUndefined;
Frampton.Utils.isValue = isValue;
Frampton.Utils.log = log;
Frampton.Utils.lazy = lazy;
Frampton.Utils.memoize = memoize;
Frampton.Utils.noop = noop;
Frampton.Utils.not = not;
Frampton.Utils.ofValue = ofValue;
Frampton.Utils.once = once;
Frampton.Utils.warn = warn;
