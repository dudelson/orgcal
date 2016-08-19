import React, {
    Component,
} from 'react';
import {
    PropTypes,
    Text,
    TouchableHighlight,
    StyleSheet,
} from 'react-native';

class ScheduledTask extends Component {
    render() {
        return (<TouchableHighlight
            style={[styles.container, {
                left: this.props.dimensions[0],
                top: this.props.dimensions[1],
                width: this.props.dimensions[2],
                height: this.props.dimensions[3],
                backgroundColor: this.props.color,
            }]}
            onPress={this.props.displayInfo}
        >
            <Text style={styles.text}>{this.props.text}</Text>
        </TouchableHighlight>
        );
    }
}

ScheduledTask.propTypes = {
    dimensions: PropTypes.array.isRequired,
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    displayInfo: PropTypes.function.isRequired,
};

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

export default ScheduledTask;
