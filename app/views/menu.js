import React, {
    Component,
} from 'react';
import {
    LayoutAnimation,
    PanResponder,
    Text,
    StyleSheet,
    View,
} from 'react-native';

const Settings = require('../settings');

class Menu extends Component {
    constructor() {
        super();
        this.state = {
            showDrop: false
        }
    }

    _previousLeft = -0.7 * Settings.windowWidth - 10;
    _previousOpacity = 0;
    _minLeft = -0.7 * Settings.windowWidth - 10;
    _menuStyles = {};
    _dropStyles = {};
    _CustomLayoutLinear = {
        duration: 200,
        create: {
            type: LayoutAnimation.Types.linear,
            property: LayoutAnimation.Properties.opacity,
        },
        update: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
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
        //LayoutAnimation.configureNext(this._CustomLayoutLinear);
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
                console.log(LayoutAnimation.Properties);
                console.log(this._CustomLayoutLinear);
                //LayoutAnimation.configureNext(this._CustomLayoutLinear);
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
        return (
            <View style={{ flex: 1 }}>
                {this.state.showDrop?<View style={styles.drop} ref={(drop) => {this.drop = drop;}}></View>:<View></View>}
                <View {...this._panResponder.panHandlers} style={styles.sideMenu} ref={(menu) => {this.menu = menu;}}>
                    <View style={styles.sideMenuContainer}>
                        <Text>test</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sideMenu: {
        position: 'absolute',
        left: -0.7 * Settings.windowWidth - 10,
        top: 0,
        width: 0.7 * Settings.windowWidth + 20,
        height: Settings.windowHeight,
        backgroundColor: 'transparent',
    },
    sideMenuContainer: {
        width: 0.7 * Settings.windowWidth,
        height: Settings.windowHeight,
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

module.exports = Menu;
