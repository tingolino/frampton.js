import isFunction from 'frampton-utils/is_function';
import memoize from 'frampton-utils/memoize';

var TAGNAMES = {
  select : 'input',
  change : 'input',
  submit : 'form',
  reset  : 'form',
  error  : 'img',
  load   : 'img',
  abort  : 'img'
};

export default memoize(function event_supported(eventName) {
  var el = document.createElement(TAGNAMES[eventName] || 'div');
  eventName = 'on' + eventName;
  var isSupported = (eventName in el);
  if (!isSupported) {
    el.setAttribute(eventName, 'return;');
    isSupported = isFunction(el[eventName]);
  }
  el = null;
  return isSupported;
});