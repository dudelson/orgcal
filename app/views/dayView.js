import React, {
    Component,
} from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';

const DateTime = require('../datetime');
const Org = require('../org');
const ScheduledTask = require('./scheduledTask');
const Settings = require('../settings');

class DayView extends Component {
    isOverlapping(A, B) {
        let mA = Org.getScheduledTask(A);
        let mB = Org.getScheduledTask(B);

        return (mA.startTimestamp.isBetween(mB.startTimestamp, mB.endTimestamp)) ||
               (mB.startTimestamp.isBetween(mA.startTimestamp, mA.endTimestamp));
    }

    findOverlaps(tasks) {
        let overlaps = {};
        for (let i=0; i<tasks.length; i++) {
            overlaps[tasks[i]] = [];
        }
        for (let i=0; i<tasks.length; i++) {
            for (let j=i+1; j<tasks.length; j++) {
                if (this.isOverlapping(tasks[i], tasks[j])) {
                    overlaps[tasks[i]].push(tasks[j]);
                    overlaps[tasks[j]].push(tasks[i]);
                }
            }
        }
        return overlaps;
    }

    computeOverlapSlots(tasks, overlaps) {
        let connectedComponents = {}; // READ-ONLY
        tasks.forEach((firstTask, i) => {
            console.log(`i = ${i}`);
            if (connectedComponents[firstTask]) return;
            let mutuallyOverlapping = [];
            let q = [firstTask];
            while (q.length !== 0) {
                let task = q.pop();
                if (mutuallyOverlapping.includes(task)) continue;
                mutuallyOverlapping.push(task);
                connectedComponents[task] = mutuallyOverlapping; // might have to clone this
                overlaps[task].forEach((t) => {
                    // Add to the end of the queue
                    // why is this method called "unshift"?
                    q.unshift(t);
                });
            }
        });
        return connectedComponents;
    }

    render() {
        let tasks = Org.getScheduledTasksForDate(this.props.date);
        console.log('finding Overlaps...');
        let overlaps = this.findOverlaps(tasks);
        console.log('overlaps:', overlaps);
        console.log('computing overlap slots...');
        let slots = this.computeOverlapSlots(tasks, overlaps);
        console.log('done!');
        return (
            <View style={styles.day}>
                <Text>{DateTime.format(this.props.date, 'ddd M/D')}</Text>
                { // dynamically generate scheduled tasks for this date
                tasks.map((t) => {
                    let task = Org.getScheduledTask(t);
                    return (<ScheduledTask
                        key={task.id}
                        text={task.heading}
                        start={task.startTimestamp}
                        end={task.endTimestamp}
                        location={task.location}
                        color={task.color}
                        nOverlaps={slots[t].length}
                        overlapSlot={slots[t].indexOf(t)}
                    />);
                })}
            </View>
        );
    }
}

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

module.exports = DayView;
