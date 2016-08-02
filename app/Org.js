'use strict';

var DateTime = require('./DateTime');
var RNFS = require('react-native-fs');
var Util = require('./Util');

/**
 * The format for storing and retrieving tasks
 */
var FORMAT = "YYYY-MM-DD";

/**
 * The unique id of the scheduled task
 */
var id = 0;

/**
 * The object which stores the scheduled tasks.
 * Keys are moment objects representing dates, and values are arrays of
 * ScheduledTask objects.
 */
var scheduledTasksByDate = {
  getDefault: function (key) {
    if(!this[key]) {this[key] = [];}
    return this[key];
  }
};


/*
class ScheduledTask {
  constructor(contentLines, timestamp) {
    // constructs an object from an array of strings. Each string in the
    // array is a line of the input file. The timestamp is a string representing
    // the date and time this task is scheduled for.
    this.heading = contentLines[0];
    this.content = contentLines.slice(1);
    this.timestamp_string = timestamp;
    // TODO: unfortunately, parsing org-mode timestamps isn't going to
    // be as simple as this (returns NaN)
    //this.timestamp = Date.parse(this.timestamp_string);
  }
}
 */

function getOrgFileList() {
  return RNFS.readDir(RNFS.ExternalDirectoryPath)
    .then((result) => {
      // only keep org files
      return result.filter((element, index, array) => {
        return element.isFile() && element.name.endsWith('.org');
      });
    })
    .catch(function getOrgFileList_readDirError(err) {
      Util.logErr(err);
    });
}

/* returns an object with 'content' prop and 'subheadings' prop. 'subheadings' is
 * an array. Each elemetn of the array is an array of strings representing the
 * contents of a subheading. Also contains a 'heading' prop., which is the contents
 * of the top-level heading.
 */
function statefulFunction(n, content) {
  var ret = {
    heading: n === 1 ? null : content[0], // content of the top-level heading
    content: [], // content below the top-level heading that isn't part of any sub-headings
    subheadings: [],
  };
  // look for subheadings with n stars
  var subheadingRegex = new RegExp("^\\s*\\*{" + n + "} ");
  var i = 0;
  if(n > 1) {
    i = 1; // we know content[0] is the top-level heading itself
    while(i < content.length && !content[i].match(subheadingRegex)) {
        ret.content.push(content[i]);
        i++;
    }
  }
  var currentSubheading = [];
  for(var j=i; j<content.length; j++) {
    if(content[j].match(subheadingRegex) && j !== i) {
      ret.subheadings.push(currentSubheading.slice(0));
      currentSubheading = [];
    }
    currentSubheading.push(content[j]);
  }

  return ret;
}

function recursiveFunction(n, content) {
  var statefulObject = statefulFunction(n, content);
  // If we find a SCHEDLUED tag, parse the content into a ScheduledTask obj
  var headingContent = statefulObject.content.join('\n');
  var matches = headingContent.match(/^\s*SCHEDULED:\s*<(.*)>/m);
  if(matches != null) {
    var location = headingContent.match(/^\s*LOCATION:\s*(.*)/m);
    var color = headingContent.match(/^\s*COLOR:\s*(.*)/m);
    /* TODO: need to figure out a better way to create ScheduledTask objects */
    var task = {
      id: id++,
      heading: statefulObject.heading,
      timestamp: parseOrgDate(matches[1]),
      location: location ? location[1] : "Unknown",
      color: color ? color[1] : "#ffffff",
    };
    scheduledTasksByDate.getDefault(DateTime.format(task.timestamp, FORMAT)).push(task);
  }

  statefulObject.subheadings.forEach(function(subheading) {
    recursiveFunction(n+1, subheading);
  });
}

function wrapper(fileContents) {
  var fileLines = fileContents.split('\n');
  recursiveFunction(1, fileLines);
}

/**
 * Given the contents of an org file, extracts the scheduled tasks and parses
 * them into ScheduledTask objects. These objects are used to populate the
 * scheduledTasksByDate object.
 * @param {String} fileContents
 */
// function extractScheduledTasksFromFile(fileContents) {
//   // for now just take the heading and and special tags (like SCHEDULED, COLOR,
//   // LOCATION, etc.)
//     var lines = fileContents.split('\n');

//     for (var i=0; i < lines.length; i++) {
//         if(lines[i].match(/^\s*\*/)) {
//             // this is a heading
//             if(mostRecentHeading.index && mostRecentHeading.isScheduled) {
//                 // TODO: content field is not accurate if this heading contains sub-headings
//                 // need to count the number of stars in order to determine if this is a subheading,
//                 // which should be included in the content
//                 scheduledTasks.push(new ScheduledTask(
//                     lines.slice(prevHeadingIndex, i),
//                     prevTaskTimestamp));
//             }
//             prevHeadingIndex = i;
//             prevHeadingIsScheduled = false;
//         } else if(lines[i].match()) {
//             if(prevHeadingIndex === -1) {
//                 Util.logErrMessage('Found a scheduled item without a previous heading on line ' + i);
//             } else {
//                 prevHeadingIsScheduled = true;
//                 prevTaskTimestamp = lines[i].match(/<(.*)>/)[1];
//             }
//         }
//     }
// }

/**
 * Collects a list of org files present in the app's data directory, and parses
 * the scheduled tasks out of each one by calling extractScheduledTasksFromFile().
 */
function extractScheduledTasks() {
  // get list of org files in data directory
  getOrgFileList().then((orgFileList) => {
    // read the files one at a time and extract their scheduled tasks
    for(var i=0; i<orgFileList.length; i++) {
      RNFS.readFile(orgFileList[i].path, 'utf8').then((contents) => {
        wrapper(contents);
      })
      .catch(function extractScheduledTasks_readFileError(err) {
        Util.logErr(err);
      });
    }
  })
  .catch(function extractScheduledTasks_orgFileListError(err) {
      Util.logErr(err);
  });
}

/**
 * Parses a string from an org file representing a timestamp into a moment
 * object which reprents the same date and time.
 * @param {String} orgDate
 */
function parseOrgDate(orgDate) {
  var date = orgDate.split(' ')[0];
  return DateTime.parse(date);
}

/**
 * Returns an array of ScheduledTask objects representing the list of tasks
 * scheduled for <date>. <date> should be a moment object.
 * @param {Object} date
 */
function getScheduledTasksForDate(date) {
  return scheduledTasksByDate.getDefault(DateTime.format(date, FORMAT));
}

module.exports = {
  //ScheduledTask: ScheduledTask,
  extractScheduledTasks: extractScheduledTasks,
  getScheduledTasksForDate: getScheduledTasksForDate,
};
