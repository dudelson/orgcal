'use strict';

import React, { Component } from 'react';
import {
  Dimensions,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import Button from 'react-native-button';

var DateTime = require('../DateTime');
var DayView = require('./DayView');

var {width, height} = Dimensions.get('window');

class WeekView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedWeek: DateTime.thisWeek(),
    };
  }

  /**
   * Switch the week view to a different week.
   * If arg is -1, go back a week, else go forward a week.
   */
  _gotoWeek(direction) {
    if(direction == -1) {
      this.setState({diplayedWeek: DateTime.weekRelative(this.state.displayedWeek, -1)});
    } else {
      this.setState({diplayedWeek: DateTime.weekRelative(this.state.displayedWeek, 1)});
    }
  }

  /**
   * Switch to the week view containing today
   */
  _gotoToday() {
    this.setState({displayedWeek: DateTime.thisWeek()});
  }

  render () {
    return (
        <View style={styles.container}>
            <View style={styles.navigator}>
                <Button style={styles.btn} onPress={() => this._gotoWeek(-1)}>{"<"}</Button>
                <Text style={styles.navigatorText}>
                    {DateTime.weekRangeString(this.state.displayedWeek, "MMM Do")}
                </Text>
                <Button style={styles.btn} onPress={() => this._gotoWeek(1)}>{">"}</Button>
            </View>
            <ScrollView style={styles.scroll} horizontal={true}>
                <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, "Sunday")}/>
                <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, "Monday")}/>
                <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, "Tuesday")}/>
                <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, "Wednesday")}/>
                <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, "Thursday")}/>
                <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, "Friday")}/>
                <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, "Saturday")}/>
            </ScrollView>
            <View style={styles.overlay}>
                <Button containerStyle={styles.overlayBtnContainer}
                        style={styles.overlayBtn}
                        onPress={() => this._gotoToday()}>
                            Today
                </Button>
            </View>
        </View>
    );
  }
}

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
    padding: 5,
  },
  navigatorText: {
    flex: 0.8,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    right: 10,
    bottom: 10,
    opacity: 0.5,
  },
  overlayBtnContainer: {
    width: 50,
    height: 20,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  overlayBtn: {
    fontSize: 12,
  }
});

module.exports = WeekView;
