import React, {
    Component,
} from 'react';
import {
    AppRegistry,
    View,
} from 'react-native';

const Org = require('./app/org');
const WeekView = require('./app/views/weekView');
const Menu = require('./app/views/menu');

// makes it easy to find the beginning of the current log session
console.log(Array(59).join('='));

class orgcal extends Component {
    render() {
        // extract scheduled tasks from org files before we can render anything
        Org.extractScheduledTasks();
        return (
            <View style={{ flex: 1 }}>
                <WeekView />
                <Menu />
            </View>
        );
    }
}

AppRegistry.registerComponent('orgcal', () => orgcal);
