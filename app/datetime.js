/** utilities to handle dates and times */

const Moment = require('moment');

/**
 * Returns a moment object representing the current day
 * @returns {Moment} the current day
 */
function today() {
    return new Moment();
}

/**
 * Returns an array of two elements. The first element is a moment object
 * representing the beginning of the current week (Sunday), and the second
 * element is a moment object representing the end of the current week (Saturday).
 * @returns {Array}
 */
function thisWeek() {
    return [new Moment().startOf('week'),
            new Moment().endOf('week')];
}

/**
 * Returns an array of two elements representing the week <n> weeks before/after
 * <currentWeek>. If <n> is negative, the week -<n> weeks ago is returned; if
 * <n> is positive, the week <n> weeks in the future is returned; and if <n> is
 * 0, <currentWeek> is returned. The first element of the returned array is a
 * moment object representing the first day of the new week (Sunday), and the
 * second element is a moment object representing the last day of the new week
 * (Saturday).
 * @param {Object} currentWeek the week to use as a reference point
 * @param {Number} n the number of weeks offset from <currentWeek>
 */
function weekRelative(currentWeek, n) {
    return [new Moment(currentWeek[0].add(n, 'weeks')),
            new Moment(currentWeek[1].add(n, 'weeks'))];
}

/**
 * Returns a moment object representing <day> of <week>. <week> should be an
 * array of the format returned by thisWeek() or weekRelative(). For example,
 * if <week> represents the week from 7/31/16 to 8/6/16, and <day> is "Wednesday",
 * the return value will be a moment object representing 8/3/16.
 * @param {Array} week the week to use as a reference point
 * @param {String} day the name of the day of the week to retrieve
 * @returns {Moment} the given day of the given week
 */
function dateForDayOfWeek(week, day) {
    return new Moment(week[0]).day(day);
}

/**
 * Returns a string representing the current day in the format specified.
 * Formats follow the Moment format string spec.
 * @param {String} format the Moment format to use
 * @returns {String} string representing today in the given format
 */
function todayString(format) {
    return today().format(format);
}

/**
 * Returns a string representing the range of <week>.
 * It is of the format "<format> - <format>". The same format must be used for
 * both dates. <week> should be an array of the format returned by thisWeek() or
 * weekRelative().
 * @param {Array} week the week to format
 * @param {String} format the moment format string
 * @returns {String} string representing the given week in the given format
 */
function weekRangeString(week, format) {
    return `${week[0].format(format)} - ${week[1].format(format)}`;
}

/**
 * returns the time component of the input represented as a decimal according to the
 * following schema: the hour component is converted to military time,
 * and the minute component is converted to a decimal. For example, a
 * task which is scheduled to start at 1:45PM would become 13.75.
 * @param {Moment} moment the moment object to convert
 * @returns {Number} the converted moment
 */
function getDecimalTime(moment) {
    return moment.hour() + (moment.minute() / 60);
}

/**
 * Returns the duration between the start and end moments in the units specified.
 * <unit> should be one of 'years', 'months', 'weeks', 'days', 'hours', 'minutes',
 * or 'seconds'.
 * @param {Moment} start the moment start point
 * @param {Object} end the moment end point
 * @param {String} unit the units for the result
 * @returns {Number} the duration between start and end in the units specified
 */
function getDuration(start, end, unit) {
    return end.diff(start, unit);
}

/**
 * Given a moment and a string representing a time, sets the moment object to
 * have the given time. Times must be expressed in military time in the form
 * 'HH:MM:SS'.
 * @param {Moment} moment the object to set the time of
 * @param {String} timeStr the time to set
 */
function setTime(moment, timeStr) {
    let [h, m, s] = timeStr.split(':').map((val) => parseInt(val, 10));
    moment.hour(h);
    moment.minute(m);
    moment.second(s);
}

/**
 * Parse a string into a moment object
 * @param {String} dateString the string to parse
 * @returns {Moment}
 */
function parse(dateString) {
    return new Moment(dateString);
}

/**
 * Format a moment object and return the formatted string
 * @param {Moment} moment the moment object to format
 * @param {String} formatString the format to use
 * @returns {String} the formatted moment
 */
function format(moment, formatString) {
    return moment.format(formatString);
}

/**
 * Clones the input moment and returns the clone
 * @param {Moment} moment
 * @returns {Moment} a clone of the input
 */
function clone(moment) {
    return new Moment(moment);
}

module.exports = {
    today,
    thisWeek,
    weekRelative,
    dateForDayOfWeek,
    todayString,
    weekRangeString,
    getDuration,
    getDecimalTime,
    setTime,
    parse,
    format,
    clone,
};
