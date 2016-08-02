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
    width: width * 0.2,
    backgroundColor: 'skyblue',
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
  }
});

