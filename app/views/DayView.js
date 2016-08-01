'use strict';

import React, { Component } from 'react';
import {
  Dimensions,
  Text,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

var {width, height} = Dimensions.get('window');

module.exports = React.createClass({
  render: function () {
    return (
        <View style={[styles.day, {backgroundColor: this.props.color}]}>
        <Text>This is a day view</Text>
        </View>
    );
  }
});

const styles = StyleSheet.create({
  day: {
    flex: 1,
    width: width * 0.2,
  }
});
