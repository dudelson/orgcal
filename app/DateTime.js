/* utilities to handle dates and times */

var Moment = require('moment');

/**
 * Returns a moment object representing the current day
 */
function today() {
  return Moment();
}

/**
 * Returns an array of two elements. The first element is a moment object
 * representing the beginning of the current week (Sunday), and the second
 * element is a moment object representing the end of the current week (Saturday).
 */
function thisWeek() {
  return [Moment().startOf('week'), Moment().endOf('week')];
}

/**
 * Returns an array of two elements representing the week <n> weeks before/after
 * <currentWeek>. If <n> is negative, the week -<n> weeks ago is returned; if
 * <n> is positive, the week <n> weeks in the future is returned; and if <n> is
 * 0, <currentWeek> is returned. The first element of the returned array is a
 * moment object representing the first day of the new week (Sunday), and the
 * second element is a moment object representing the last day of the new week
 * (Saturday).
 * @param {Object} currentWeek
 * @param {Number} n
 */
function weekRelative(currentWeek, n) {
  return [Moment(currentWeek[0].add(n, 'weeks')),
          Moment(currentWeek[1].add(n, 'weeks'))];
}

/**
 * Returns a moment object representing <day> of <week>. <week> should be an
 * array of the format returned by thisWeek() or weekRelative(). For example,
 * if <week> represents the week from 7/31/16 to 8/6/16, and <day> is "Wednesday",
 * the return value will be a moment object representing 8/3/16.
 */
function dateForDayOfWeek(week, day) {
  // create a new moment object identical to the beginning of the week
  var m = Moment(week[0]);
  return m.day(day);
}

/**
 * Returns a string representing the current day in the format specified.
 * Formats follow the Moment format string spec.
 * @param {String} format
 */
function todayString(format) {
  return today().format(format);
}

/**
 * Returns a string representing the range of <week>.
 * It is of the format "{format} - {format}". The same format must be used for
 * both dates. <week> should be an array of the format returned by thisWeek() or
 * weekRelative().
 * @param {Object} week
 * @param {String} format 
 */
function weekRangeString(week, format) {
  var beginFormatted = week[0].format(format);
  var endFormatted = week[1].format(format);
  return beginFormatted + ' - ' + endFormatted;
}

/**
 * Format a moment object and return the formatted string
 * @param {Object} moment
 * @param {String} formatString
 */
function format(moment, formatString) {
  return moment.format(formatString);
}

module.exports = {
  today: today,
  thisWeek: thisWeek,
  weekRelative: weekRelative,
  dateForDayOfWeek: dateForDayOfWeek,
  todayString: todayString,
  weekRangeString: weekRangeString,
  format: format,
}
