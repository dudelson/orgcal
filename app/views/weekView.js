import React, {
    Component,
} from 'react';
import {
    Text,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Button from 'react-native-button';

const DateTime = require('../datetime');
const DayView = require('./dayView');
const Settings = require('../settings');

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
        if (direction === -1) {
            this.setState({
                diplayedWeek: DateTime.weekRelative(this.state.displayedWeek, -1),
            });
        } else {
            this.setState({
                diplayedWeek: DateTime.weekRelative(this.state.displayedWeek, 1),
            });
        }
    }

    /**
     * Switch to the week view containing today
     */
    _gotoToday() {
        this.setState({
            displayedWeek: DateTime.thisWeek(),
        });
    }

    render() {
        let hours = [];
        for (let i=0; i<= 24; i++) {
            if (i === 24) {
                hours.push(<Text key={i} />);
            } else {
                hours.push(<Text key={i}>{i}</Text>);
            }
        }
        return (
            <View style={styles.container}>
                <View style={styles.navigator}>
                    <Button style={styles.btn} onPress={() => this._gotoWeek(-1)}>{"  <"}</Button>
                    <Text style={styles.navigatorText}>
                        {DateTime.weekRangeString(this.state.displayedWeek, 'MMM Do')}
                    </Text>
                    <Button style={styles.btn} onPress={() => this._gotoWeek(1)}>{">  "}</Button>
                </View>
                <ScrollView>
                    <ScrollView style={styles.scroll} horizontal={true}>
                        <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, 'Sunday')} />
                        <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, 'Monday')} />
                        <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, 'Tuesday')} />
                        <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, 'Wednesday')} />
                        <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, 'Thursday')} />
                        <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, 'Friday')} />
                        <DayView date={DateTime.dateForDayOfWeek(this.state.displayedWeek, 'Saturday')} />
                    </ScrollView>
                    <View style={styles.hours}>{hours}</View>
                </ScrollView>
                <View style={styles.overlay}>
                    <Button containerStyle={styles.overlayBtnContainer}
                        style={styles.overlayBtn}
                        onPress={() => this._gotoToday()}
                    >
                        Today
                    </Button>
                </View>
            </View>
        );
    }
}

const navigatorFlex = 0.10;

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
    hours: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'absolute',
        left: 0,
        top: 0,
        //width: 20,
        height: Settings.windowHeight * Settings.dayViewHeightScale,
        opacity: 0.5,
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
    },
});

module.exports = WeekView;
