import React, {
    Component,
} from 'react';
import {
    AppRegistry,
    View,
} from 'react-native';
import {
    createStore,
    combineReducers,
    dispatch,
} from 'redux';
import {
    Provider,
} from 'react-redux';
import * as reducers from './app/reducers';
import Actions from './app/actions';
import DateTime from './app/datetime';
import Org from './app/org';
import WeekViewContainer from './app/containers/weekViewContainer';
import Menu from './app/views/menu';
import TaskInfo from './app/views/taskInfo';

// makes it easy to find the beginning of the current log session
console.log(Array(59).join('='));

class orgcal extends Component {
    constructor() {
        super();
        // create redux store
        const reducer = combineReducers(reducers);
        const store = createStore(reducer);
        // extract scheduled tasks from org files before we can render anything
        dispatch(Actions.extractScheduledTasks());
        // set some initial state
        dispatch(Actions.setDisplayedWeek(DateTime.thisWeek()));
    }

    render() {
        return (
            <Provider store={this.store}>
                <View style={{ flex: 1 }}>
                    <WeekViewContainer />
                    <TaskInfo />
                    <Menu />
                </View>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('orgcal', () => orgcal);
