let DateTime = require('./datetime');
let RNFS = require('react-native-fs');
let Util = require('./util');

/**
 * The format for storing and retrieving tasks
 */
let FORMAT = 'YYYY-MM-DD';

/**
 * The unique id of the scheduled task
 */
let id = 0;

/**
 * The object which stores the scheduled tasks.
 * Keys are ids, and values are scheduled task objects. There should be a 1 to 1
 * correspondence between ids and objects
 */
let scheduledTasks = {};

/**
 * A mapping from moment objects (representing dates) to arrays of scheduled task
 * object ids.
 */
let scheduledTasksByDate = {
    getDefault(key) {
        if (!this[key]) {
            this[key] = [];
        }
        return this[key];
    },
};

/**
 * Parses a string from an org file representing a timestamp into a pair of moment
 * objects representing the start and end datetimes of the task.
 * @param {String} orgDate The date to parse
 * @returns {Array} Array of moment objects
 */
function parseOrgDate(orgDate) {
    let parts = orgDate.split(' ');
    var startMoment, endMoment;

    if (parts.length === 2) {
        startMoment = DateTime.parse(parts[0]);
        DateTime.setTime(startMoment, '00:00:00');
        endMoment = DateTime.clone(startMoment);
        DateTime.setTime(endMoment, '23:59:00');
    } else if (parts.length === 3) {
        let [startTime, endTime] = parts[2].split('-')
            .map((val) => `${val}:00`);
        startMoment = DateTime.parse(parts[0]);
        DateTime.setTime(startMoment, startTime);
        endMoment = DateTime.clone(startMoment);
        DateTime.setTime(endMoment, endTime);
    } else {
        Util.logErrMessage(`Unknown org date format: ${orgDate}`);
        startMoment = DateTime.parse('4/20/2016 04:20:00');
        endMoment = DateTime.parse('4/20/2016 04:20:00');
    }

    return [startMoment, endMoment];
}

/**
 * Collects a list of org files present in the app's data directory, and parses
 * the scheduled tasks out of each one, populating the scheduledTasks and
 * scheduledTasksByDate objects.
 */
function extractScheduledTasks() {
    /* parses and org heading into an object with the following properties:
     *     heading: the text of the heading
     *     content: the top-level contents of this heading (before any subheadings)
     *     subheadings: an array of strings where each string is an unprocessed
     *                  subheading and its contents
     */
    function parseOrgHeading(n, content) {
        let ret = {
            heading: n === 1 ? null : content[0], // content of the top-level heading
            content: [], // content below the top-level heading that isn't part of any sub-headings
            subheadings: [],
        };
        // look for subheadings with n stars
        let subheadingRegex = new RegExp(`^\\s*\\*{${n}} `);
        let i = 0;
        if (n > 1) {
            i = 1; // we know content[0] is the top-level heading itself
            while (i < content.length && !content[i].match(subheadingRegex)) {
                ret.content.push(content[i]);
                i++;
            }
        }
        let currentSubheading = [];
        for (let j = i; j < content.length; j++) {
            if (content[j].match(subheadingRegex) && j !== i) {
                ret.subheadings.push(currentSubheading.slice(0));
                currentSubheading = [];
            }
            currentSubheading.push(content[j]);
        }

        return ret;
    }

    /* recursively walks the org file structure, obtaining the content of each
     * heading through a call to parseOrgHeading(). Forms ScheduledTask objects
     * which populate the scheduledTask object as it finds them.
     */
    function extractTasksRecursive(n, content) {
        let statefulObject = parseOrgHeading(n, content);
        // If we find a SCHEDLUED tag, parse the content into a ScheduledTask obj
        let headingContent = statefulObject.content.join('\n');
        let matches = headingContent.match(/^\s*SCHEDULED:\s*<(.*)>/m);
        if (matches != null) {
            let location = headingContent.match(/^\s*LOCATION:\s*(.*)/m);
            let color = headingContent.match(/^\s*COLOR:\s*(.*)/m);
            /* TODO: need to figure out a better way to create ScheduledTask objects */
            let [startTimestamp, endTimestamp] = parseOrgDate(matches[1]);
            let task = {
                id: id++,
                heading: statefulObject.heading,
                startTimestamp,
                endTimestamp,
                location: location ? location[1] : 'Unknown',
                color: color ? color[1] : '#ffffff',
            };
            scheduledTasks[task.id] = task;
            // TODO: should I push the task onto the array for all of the days that the task occurs on?
            scheduledTasksByDate.getDefault(DateTime.format(task.startTimestamp,
                    FORMAT))
                .push(task.id);
        }

        statefulObject.subheadings.forEach((subheading, i, arr) => {
            extractTasksRecursive(n + 1, subheading);
        });
    }

    // get list of org files in data directory
    return RNFS.readDir(RNFS.ExternalDirectoryPath)
        .then((result) => result.filter((element) =>
                                        // only keep org files
                                        element.isFile() && element.name.endsWith('.org')))
        .then((orgFileList) => {
            // read the files one at a time and extract their scheduled tasks
            orgFileList.forEach((file) => {
                RNFS.readFile(file.path, 'utf8')
                    .then((contents) => {
                        let fileLines = contents.split('\n');
                        extractTasksRecursive(1, fileLines);
                    })
                    .catch((err) => {
                        Util.logErr(err);
                    });
            });
        })
        .catch((err) => {
            Util.logErr(err);
        });
}

/**
 * Returns the scheduled task object associated with the input id, or undefined
 * if no such object exists
 * @param {Number} key
 * @returns {Object}
 */
function getScheduledTask(key) {
    return scheduledTasks[key];
}

/**
 * Returns an array of ScheduledTask objects representing the list of tasks
 * scheduled for <date>. <date> should be a moment object.
 * @param {Object} date
 * @returns {Array}
 */
function getScheduledTasksForDate(date) {
    return scheduledTasksByDate.getDefault(DateTime.format(date, FORMAT));
}

module.exports = {
    extractScheduledTasks,
    getScheduledTask,
    getScheduledTasksForDate,
};
