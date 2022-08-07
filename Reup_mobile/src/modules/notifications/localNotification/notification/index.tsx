import * as Animatable from 'react-native-animatable';
import * as NotificationActions from '../actions';
import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from './style';
export interface Props {
  notification: any;
  removeNotification: any;
}

// Custom Local Notification pop-up if you choose an optional 2 in Notification Services file
class Notification extends Component<Props, {}> {
  static defaultProps = {
    notification: PropTypes.shape({
      type: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    }),
    removeNotification: PropTypes.func,
  };

  render() {
    return (
      <Animatable.View animation="fadeInDown">
        <TouchableOpacity
          style={styles.information}
          activeOpacity={0.6}
          onPress={() => this.props.removeNotification(this.props.notification)}
        >
          <View style={styles.button}>
            <Text style={styles.buttonTextTitle}>{this.props.notification.title}</Text>
            <Text style={styles.buttonText}>{this.props.notification.message}</Text>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(NotificationActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
