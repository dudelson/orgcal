'use strict';

var RNFS = require('react-native-fs');
var Util = require('./Util');

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

function getOrgFileList() {
  RNFS.readDir(RNFS.ExternalDirectoryPath)
    .then((result) => {
      // only keep org files
      return result.filter((element, index, array) => {
        return element.isFile() && element.name.endsWith('.org');
      });
    })
    .catch((err) => {
      Util.logErr(err);
    });
}

function extractScheduledTasksFromFile(fileContents) {
    var lines = fileContents.split('\n');
    // line number of the most recently seen heading
    var prevHeadingIndex = -1;
    // whether the most recently seen heading is a scheduled task
    var prevHeadingIsScheduled = false;
    // TODO: this is rather gross
    // the timestamp associated with the last seen scheduled task
    var prevTaskTimestamp = null;
    // the array of scheduled task objects
    var scheduledTasks = [];
    for (var i=0; i < lines.length; i++) {
        if(lines[i].match(/^\s*\*/)) {
            // this is a heading
            if(prevHeadingIndex !== -1 && prevHeadingIsScheduled) {
                // TODO: content field is not accurate if this heading contains sub-headings
                // need to count the number of stars in order to determine if this is a subheading,
                // which should be included in the content
                scheduledTasks.push(new ScheduledTask(
                    lines.slice(prevHeadingIndex, i),
                    prevTaskTimestamp));
            }
            prevHeadingIndex = i;
            prevHeadingIsScheduled = false;
        } else if(lines[i].match(/^\s*SCHEDULED:/)) {
            if(prevHeadingIndex === -1) {
                Util.logErrMessage('Found a scheduled item without a previous heading on line ' + i);
            } else {
                prevHeadingIsScheduled = true;
                prevTaskTimestamp = lines[i].match(/<(.*)>/)[1];
            }
        }
    }

    for(var i=0; i<scheduledTasks.length; i++) {
        console.log(scheduledTasks[i]);
    }
}

function extractScheduledTasks() {
  // get list of org files in data directory
  getOrgFileList().then((orgFileList) => {
    var tasks = [];
    // read the files one at a time and extract their scheduled tasks
    for(var i=0; i<orgFileList.length; i++) {
      RNFS.readFile(orgFileList[i]).then((contents) => {
        tasks.push(extractScheduledTasksFromFile(orgFileList[i]));
      })
      .catch((err) => {
        Util.logErr(err);
      });
    }
    return tasks;
  });
}

module.exports.ScheduledTask = ScheduledTask;
module.exports.extractScheduledTasks = extractScheduledTasks;
