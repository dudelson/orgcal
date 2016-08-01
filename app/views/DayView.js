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

var {width, height} = Dimensions.get('window');

module.exports = React.createClass({
  render: function () {
    return (
        <View style={styles.day}>
            <Text>{DateTime.format(this.props.date, "ddd M/D")}</Text>
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
