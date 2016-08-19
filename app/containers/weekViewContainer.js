import { connect } from 'react-redux';
import Actions from '../actions';
import DateTime from '../datetime';
import WeekView from '../views/weekView';

/**
 * Switch the week view to a different week.
 * If <n> is 0, go to the CURRENT WEEK. This is not the same as not changing the
 * displayed week.
 * If <n> is -1, go back a week.
 * Else go forward a week.
 * @param {Function} dispatch the redux dispatch function
 * @param {Number} n the temporal direction to move
 */
function gotoWeek(dispatch, n) {
    let displayedWeek;
    if (n === 0) {
        displayedWeek = DateTime.thisWeek();
    } else if (n < 0) {
        displayedWeek = DateTime.weekRelative(this.state.displayedWeek, -1);
    } else {
        displayedWeek = DateTime.weekRelative(this.state.displayedWeek, 1);
    }
    dispatch(Actions.setDisplayedWeek(displayedWeek));
}

function mapStateToProps(state) {
    return { displayedWeek: state.displayedWeek };
}

function mapDispatchToProps(dispatch) {
    return { gotoWeek: (n) => gotoWeek(dispatch, n) };
}

const WeekViewContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(WeekView);

export default WeekViewContainer;
