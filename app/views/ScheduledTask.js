'use strict';

import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

var DateTime = require('../DateTime');

class ScheduledTask extends Component {
  render () {
    return (
        <View style={[styles.container, {backgroundColor: this.props.color}]}>
        <Text style={styles.text}>{this.props.text}</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  text: {
    color: 'black',
  }
});

module.exports = ScheduledTask;
