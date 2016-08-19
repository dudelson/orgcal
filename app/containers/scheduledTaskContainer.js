import { Dimensions } from 'react-native';
import { connect } from 'react-redux';
import Actions from '../actions';
import ScheduledTask from '../views/scheduledTask';
import DateTime from '../datetime';
import Settings from '../settings';

const { windowWidth, windowHeight } = Dimensions.get('window');

/**
 * returns a 4 tuple (left, top, width, height) that specifies this task's
 * absolute position (relative to its parent). The position is calculated based
 * on the task's start time, duration, and any overlapping tasks.
 * @param {Object} start the moment object representing the start datetime of the task
 * @param {Object} end the moment object representing the end datetime of the task
 * @param {Number} nOverlaps the number of other tasks this task overlaps with
 * @param {Number} overlapSlot this task's position among overlapping tasks
 * @returns {Array} [left, top, width, height]
 */
function computeDimensions(start, end, nOverlaps, overlapSlot) {
    let overlapSlotWidth = windowWidth * Settings.dayViewWidthScale / nOverlaps;
    // on-screen vertical space between consecutive hour markers, in px
    let hourHeight = Math.round(windowHeight * Settings.dayViewHeightScale / 24);
    // duration of this task, in hours
    let taskDuration = DateTime.getDuration(start, end, 'hours');
    // time that this task starts represented as a decimal according to the
    // following schema: the hour component is converted to military time,
    // and the minute component is converted to a decimal. For example, a
    // task which is scheduled to start at 1:45PM would become 13.75.
    let decimalStartTime = DateTime.getDecimalTime(start);

    let left = Math.round(overlapSlotWidth * overlapSlot);
    let top = hourHeight * decimalStartTime;
    let width = Math.round(overlapSlotWidth);
    let height = hourHeight * taskDuration;

    return [left, top, width, height];
}

function mapStateToProps(state, ownProps) {
    return {
        dimensions: computeDimensions(
            state.tasks.byId[ownProps.id].startTimestamp,
            state.tasks.byId[ownProps.id].endTimestamp,
            state.tasks.byId[ownProps.id].overlaps.length,
            state.tasks.byId[ownProps.id].overlapSlot
        ),
        text: state.tasks.byId[ownProps.id].heading,
        color: state.tasks.byId[ownProps.id].color,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        displayInfo: () => dispatch(Actions.toggleTaskOverlay(true, ownProps.id)),
    };
}

const ScheduledTaskViewContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ScheduledTask);

export default ScheduledTaskViewContainer;
