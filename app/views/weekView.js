import React, {
    Component,
    PropTypes,
} from 'react';
import {
    Text,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Button from 'react-native-button';
import DayViewContainer from '../containers/dayViewContainer';
import DateTime from '../datetime';
import Settings from '../settings';

class WeekView extends Component {
    render() {
        let hours = [];
        for (let i=0; i<= 24; i++) {
            hours.push(i === 24 ? <Text key={i} /> : <Text key={i}>{i}</Text>);
        }
        return (
            <View style={styles.container}>
                <View style={styles.navigator}>
                    <Button style={styles.btn}
                        onPress={() => this.props.gotoWeek(-1)}
                    >
                    {"  <"}
                    </Button>
                    <Text style={styles.navigatorText}>
                        {DateTime.weekRangeString(this.props.displayedWeek, 'MMM Do')}
                    </Text>
                    <Button style={styles.btn}
                        onPress={() => this.props.gotoWeek(1)}
                    >
                        {">  "}
                    </Button>
                </View>
                <ScrollView>
                    <ScrollView style={styles.scroll} horizontal >
                        <DayViewContainer
                            date={DateTime.dateForDayOfWeek(this.props.displayedWeek, 'Sunday')}
                        />
                        <DayViewContainer
                            date={DateTime.dateForDayOfWeek(this.props.displayedWeek, 'Monday')}
                        />
                        <DayViewContainer
                            date={DateTime.dateForDayOfWeek(this.props.displayedWeek, 'Tuesday')}
                        />
                        <DayViewContainer
                            date={DateTime.dateForDayOfWeek(this.props.displayedWeek, 'Wednesday')}
                        />
                        <DayViewContainer
                            date={DateTime.dateForDayOfWeek(this.props.displayedWeek, 'Thursday')}
                        />
                        <DayViewContainer
                            date={DateTime.dateForDayOfWeek(this.props.displayedWeek, 'Friday')}
                        />
                        <DayViewContainer
                            date={DateTime.dateForDayOfWeek(this.props.displayedWeek, 'Saturday')}
                        />
                    </ScrollView>
                    <View style={styles.hours}>{hours}</View>
                </ScrollView>
                <View style={styles.overlay}>
                    <Button containerStyle={styles.overlayBtnContainer}
                        style={styles.overlayBtn}
                        onPress={() => this.props.gotoWeek(0)}
                    >
                        Today
                    </Button>
                </View>
            </View>
        );
    }
}

WeekView.propTypes = {
    displayedWeek: PropTypes.array.isRequired,
    gotoWeek: PropTypes.func.isRequired,
};

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

export default WeekView;
