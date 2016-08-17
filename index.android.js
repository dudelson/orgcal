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
} from 'redux';
import {
    Provider,
} from 'react-redux';
import * as reducers from './app/reducers';

const Org = require('./app/org');
const WeekView = require('./app/views/weekView');
const TaskInfo = require('./app/views/taskinfo');
const Menu = require('./app/views/menu');

// makes it easy to find the beginning of the current log session
console.log(Array(59).join('='));

class orgcal extends Component {
    constructor() {
        super();
        // create redux store
        const reducer = combineReducers(reducers);
        const store = createStore(reducer);
        // extract scheduled tasks from org files before we can render anything
        Org.extractScheduledTasks();
    }

    render() {
        return (
            <Provider store={this.store}>
                <View style={{ flex: 1 }}>
                    <WeekView />
                    <TaskInfo />
                    <Menu />
                </View>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('orgcal', () => orgcal);
