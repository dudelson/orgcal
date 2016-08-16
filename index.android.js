import React, {
    Component
} from 'react';
import {
    AppRegistry,
    Dimensions,
    LayoutAnimation,
    PanResponder,
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';

var Org = require('./app/org');
var WeekView = require('./app/views/weekView');

var {
    width: window_width,
    height: window_height
} = Dimensions.get('window');

// makes it easy to find the beginning of the current log session
console.log(Array(59)
    .join('='));

class Menu extends Component {
    render() {
        return (
            <View style={styles.sideMenuContainer}>
                <Text> test</Text>
            </View>
        );
    }
}

class orgcal extends Component {
    constructor() {
        super();
        this.state = {
            showDrop: false
        }
    }

    _previousLeft = -0.7 * window_width - 10;
    _previousOpacity = 0;
    _minLeft = -0.7 * window_width - 10;
    _menuStyles = {};
    _dropStyle = {};
    _CustomLayoutLinear = {
        duration: 200,
        create: {
            type: LayoutAnimation.Types.linear,
            property: LayoutAnimation.Properties.left,
        },
        update: {
            type: LayoutAnimation.Types.curveEaseInEaseOut,
        },
    };
    menu = (null: ? {
        setNativeProps(props: Object): void
    });
    drop = (null: ? {
        setNativeProps(props: Object): void
    });

    _updatePosition() {
        this.menu && this.menu.setNativeProps(this._menuStyles);
        this.drop && this.drop.setNativeProps(this._dropStyles);
    }

    _endMove(evt, gestureState) {
        if (gestureState.vx < 0 || gestureState.dx < 0) {
            this._menuStyles.style.left = this._minLeft;
            this._dropStyles.style.opacity = 0;
            this._previousLeft = this._minLeft;
            this._previousOpacity = 0;
            this.setState({
                showDrop: false
            })
        }
        if (gestureState.vx > 0 || gestureState.dx > 0) {
            this._menuStyles.style.left = 0;
            this._dropStyles.style.opacity = 1;
            this._previousLeft = 0;
            this._previousOpacity = 1;
        }
        this._updatePosition();
        LayoutAnimation.configureNext(this._CustomLayoutLinear);
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) =>
                true,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return gestureState.dy / gestureState.dx != 0;
            },
            onPanResponderGrant: (evt, gestureState) => {
                this.setState({
                    showDrop: true
                })
            },
            onPanResponderMove: (evt, gestureState) => {
                this._menuStyles.style.left = this._previousLeft +
                    gestureState
                    .dx;
                this._dropStyles.style.opacity = this._previousOpacity +
                    Math.pow(
                        gestureState.dx / (-this._minLeft), 0.5
                    );
                if (this._menuStyles.style.left > 0) {
                    this._menuStyles.style.left = 0;
                    this._dropStyles.style.opacity = 1;
                };
                if (this._menuStyles.style.left < this._minLeft) {
                    this._menuStyles.style.left = this._minLeft;
                    this._dropStyles.style.opacity = 0;
                };
                this._updatePosition();
                LayoutAnimation.configureNext(this._CustomLayoutLinear);
            },
            onPanResponderTerminationRequest: (evt, gestureState) =>
                true,
            onPanResponderRelease: (evt, gestureState) => this._endMove(
                evt,
                gestureState),
            onPanResponderTerminate: (evt, gestureState) => this._endMove(
                evt,
                gestureState),
            onShouldBlockNativeResponder: (event, gestureState) =>
                true,
        });

        this._menuStyles = {
            style: {
                left: this._previousLeft,
            },
        };
        this._dropStyles = {
            style: {
                opacity: this._previousOpacity,
            },
        };

    }

    componentDidMount() {
        this._updatePosition();
        //StatusBarIOS.setStyle(1);
    }

    render() {
        // extract scheduled tasks from org files before we can render anything
        Org.extractScheduledTasks();
        return (
            <View style={{flex: 1}}>
            <WeekView/>
            <View {...this._panResponder.panHandlers} style={styles.sideMenu} ref={(menu) => {this.menu = menu;}}>
                <Menu/>
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    sideMenu: {
        position: 'absolute',
        left: -0.7 * window_width - 10,
        top: 0,
        width: 0.7 * window_width + 20,
        height: window_height,
        backgroundColor: 'transparent',
    },
    sideMenuContainer: {
        width: 0.7 * window_width,
        height: window_height,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: {
            width: 2,
            height: 0
        },
    }
});

AppRegistry.registerComponent('orgcal', () => orgcal);
