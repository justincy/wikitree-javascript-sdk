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

/**
 * Convert a raw date string from the API into a human readable string
 */
var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
utils.getDateDisplayString = function(raw){
  
  if(!raw || !(/\d{4}-\d{2}-\d{2}/.test(raw)) ||  raw === '0000-00-00'){
    return '';
  }
  
  // At this point we know that the year is not empty so we just have to
  // check the month and the day
  var parts = raw.split('-'),
      year = parts[0],
      month = parts[1],
      day = parts[2],
      monthInt = parseInt(month, 10);
  
  if(month === '00'){
    return year;
  }
  
  if(day === '00'){
    return months[monthInt - 1] + ' ' + year;
  }
  
  return months[monthInt - 1] + ' ' + parseInt(day, 10) + ', ' + year;
};