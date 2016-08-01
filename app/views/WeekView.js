'use strict';

import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import Button from 'react-native-button';

var DayView = require('./DayView');

module.exports = React.createClass({
  _handlePress: function () {
    console.log("Button pressed!");
  },
  render: function () {
    return (
        <View style={styles.container}>
            <View style={styles.navigator}>
                <Button style={styles.btn} onPress={this._handlePress}> Back </Button>
                <Text style={styles.navigatorText}>Week of: </Text>
                <Button style={styles.btn} onPress={this._handlePress}> Forward </Button>
            </View>
            <ScrollView style={styles.scroll} horizontal={true}>
                <DayView color='blue'/>
                <DayView color='red'/>
                <DayView color='green'/>
                <DayView color='yellow'/>
                <DayView color='purple'/>
                <DayView color='orange'/>
                <DayView color='cyan'/>
            </ScrollView>
        </View>
    );
  }
});

var navigatorFlex = 0.05;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigator: {
    flex: navigatorFlex,
    flexDirection: 'row',
  },
  scroll: {
    flex: 1 - navigatorFlex,
    flexDirection: 'row',
  },
  btn: {
    flex: 0.2,
  },
  navigatorText: {
    flex: 0.8,
    textAlign: 'center',
  }
});
