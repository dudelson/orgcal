'use strict';

import React, {Component} from 'react';
import {
  Dimensions,
  Text,
  StyleSheet,
  View,
} from 'react-native';

var DateTime = require('../DateTime');
var Settings = require('../Settings');

class ScheduledTask extends Component {
    /**
     * For each task scheduled today, computes the number of other tasks it will
     * be concurrent with. Returns an array of these values.
     */
    computeOverlaps(){}

    /**
     * returns a 4 tuple (left, top, width, height) that specify this component's
     * absolute position (relative to its parent)
     */
    computeDimensions () {
        //TODO: task_duration, decimalStartTime, this.nOverlaps
        var {window_width, window_height} = Dimensions.get('window');
        // on-screen vertical space between consecutive hour markers, in px
        var hour_height = Math.round(window_height * Settings.dayViewHeightScale / 24);
        // duration of this task, in hours
        var task_duration; 
        // time that this task starts represented as a decimal according to the
        // following schema: the hour component is converted to military time,
        // and the minute component is converted to a decimal. For example, a
        // task which is scheduled to start at 1:45PM would become 13.75.
        var decimalStartTime;

        var left = 0; // TODO: need to figure out how to order tasks
        var top = hour_height * decimalStartTime;
        var width = Math.round(window_width * Settings.dayViewWidthScale / this.nOverlaps);
        var height = hour_height * task_duration;

        return [left, top, width, height];
    }
  render () {
      var position = this.computeDimensions();
    return (
            <View style={[styles.container, {backgroundColor: this.props.color,
                                             left: position[0],
                                             top: position[1],
                                             width: position[2],
                                             height: position[3]}]}>
        <Text style={styles.text}>{this.props.text}</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
      position: 'absolute',
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  text: {
    color: 'black',
  }
});

module.exports = ScheduledTask;
