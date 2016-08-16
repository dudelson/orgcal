import React, {
    Component,
} from 'react';
import {
    Text,
    TouchableHighlight,
    StyleSheet,
} from 'react-native';

const DateTime = require('../datetime');
const Settings = require('../settings');

class ScheduledTask extends Component {
    /**
     * returns a 4 tuple (left, top, width, height) that specify this component's
     * absolute position (relative to its parent)
     */
    computeDimensions() {
        let overlapSlotWidth = Settings.windowWidth * Settings.dayViewWidthScale / this.props.nOverlaps;
        // on-screen vertical space between consecutive hour markers, in px
        let hourHeight = Math.round(Settings.windowHeight * Settings.dayViewHeightScale / 24);
        // duration of this task, in hours
        let taskDuration = DateTime.getDuration(this.props.start, this.props.end, 'hours');
        // time that this task starts represented as a decimal according to the
        // following schema: the hour component is converted to military time,
        // and the minute component is converted to a decimal. For example, a
        // task which is scheduled to start at 1:45PM would become 13.75.
        let decimalStartTime = DateTime.getDecimalTime(this.props.start);

        let left = Math.round(overlapSlotWidth * this.props.overlapSlot);
        let top = hourHeight * decimalStartTime;
        let width = Math.round(overlapSlotWidth);
        let height = hourHeight * taskDuration;

        return [left, top, width, height];
    }

    displayScheduledTaskInfo() {
        console.log('HELPFUL INFO');
    }

    render() {
        let position = this.computeDimensions();
        return (<TouchableHighlight
            style={[styles.container, {
                backgroundColor: this.props.color,
                left: position[0],
                top: position[1],
                width: position[2],
                height: position[3],
            }]}
            onPress={this.displayScheduledTaskInfo}
        >
            <Text style={styles.text}>{this.props.text}</Text>
        </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
    },
    text: {
        color: 'black',
    },
});

module.exports = ScheduledTask;
