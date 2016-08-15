'use strict';

import React, { Component } from 'react';
import {
  Dimensions,
  Text,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

var DateTime = require('../DateTime');
var Org = require('../Org');
var ScheduledTask = require('./ScheduledTask');
var Settings = require('../Settings');

var {width, height} = Dimensions.get('window');

module.exports = React.createClass({
  render: function () {
    var tasks = Org.getScheduledTasksForDate(this.props.date);
    return (
        <View style={styles.day}>
            <Text>{DateTime.format(this.props.date, "ddd M/D")}</Text>
            { // dynamically generate scheduled tasks for this date
            tasks.map((task) => {
                      return (<ScheduledTask
                              key={task.id}
                              text={task.heading}
                              timestamp={task.timestamp}
                              location={task.location}
                              color={task.color}
                              />
                              );
          })}
        </View>
    );
  }
});

const styles = StyleSheet.create({
  day: {
    flex: 1,
    // TODO: expose this multiplicative factor as a setting
    width: width * Settings.dayViewWidthScale,
    // this height needs to match the height of the hours component in weekview.js
    height: height * Settings.dayViewHeightScale,
    backgroundColor: 'skyblue',
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
  },
});

