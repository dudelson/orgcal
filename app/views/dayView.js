import React, {
    Component,
} from 'react';
import {
    PropTypes,
    Text,
    StyleSheet,
    View,
} from 'react-native';
import DateTime from '../datetime';
import ScheduledTaskContainer from '../containers/scheduledTaskContainer';
import Settings from '../settings';

class DayView extends Component {
    render() {
        return (
            <View style={styles.day}>
                <Text>{DateTime.format(this.props.date, 'ddd M/D')}</Text>
                { // dynamically generate scheduled tasks for this date
                this.props.tasks.map((task) =>
                    <ScheduledTaskContainer key={task} id={task} />
                )}
            </View>
        );
    }
}

DayView.propTypes = {
    date: PropTypes.object.isRequired,
    tasks: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
    day: {
        flex: 1,
        // TODO: expose this multiplicative factor as a setting
        width: Settings.windowWidth * Settings.dayViewWidthScale,
        // this height needs to match the height of the hours component in weekview.js
        height: Settings.windowHeight * Settings.dayViewHeightScale,
        backgroundColor: 'skyblue',
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
    },
});

export default DayView;
