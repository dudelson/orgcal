import { connect } from 'react-redux';
import DayView from '../views/dayView';
import DateTime from '../datetime';
import Settings from '../settings';

function mapStateToProps(state, ownProps) {
    return {
        date: ownProps.date,
        tasks: state.tasks.byDate[DateTime.format(ownProps.date, Settings.tasksByDateFormat)],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        
    };
}

const DayViewContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DayView);

export default DayViewContainer;
