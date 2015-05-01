var utils = module.exports = {};

/**
 * Lifted from underscore.js
 * http://underscorejs.org/docs/underscore.html#section-15
 */
utils.each = function(obj, iterator, context) {
  if (obj == null) return obj;
  if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, length = obj.length; i < length; i++) {
      iterator.call(context, obj[i], i, obj);
    }
  } else {
    var keys = utils.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      iterator.call(context, obj[keys[i]], keys[i], obj);
    }
  }
  return obj;
};