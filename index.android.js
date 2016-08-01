import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';

var RNFS = require('react-native-fs');
var Org = require('./app/Org');
var WeekView = require('./app/views/WeekView');

// makes it easy to find the beginning of the current log session
console.log(Array(59).join('='));

class orgcal extends Component {
  render() {
      // TODO: move this to separate file (app/FS.js)
      // TODO: figure out how to return the file contents instead of a promise
      // TODO: figure out how to inherit CSS styles
      RNFS.readDir(RNFS.ExternalDirectoryPath)
          .then((result) => {
              return Promise.all([RNFS.stat(result[0].path), result[0].path]);
          })
          .then((result) => {
              if(result[0].isFile()) {
                  return RNFS.readFile(result[1], 'utf8');
              }
              return 'no file';
          })
          .then((fileContents) => {
              this.extractScheduledTasks(fileContents);
          })
          .catch((err) => {
              console.log("FUCK I GOT AN ERROR");
              console.log(err.message, err.code);
          });
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
