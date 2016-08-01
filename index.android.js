// TODO: figure out how to inherit CSS styles
// TODO: javascript logging system? (or react logging system?)
// TODO: learn docjs syntax and make sure DateTime docstrings are correct

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';

var Org = require('./app/Org');
var WeekView = require('./app/views/WeekView');

// makes it easy to find the beginning of the current log session
console.log(Array(59).join('='));

class orgcal extends Component {
  render() {
    return (
        <View style={{flex: 1}}>
            <WeekView/>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    
});

AppRegistry.registerComponent('orgcal', () => orgcal);
