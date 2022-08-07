import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import styles from './style';

export interface Props {
  notifications: any;
}

class NotificationContainer extends Component<Props, {}> {
  renderNotifications() {
    const notificationsToDisplay: object[] = [];
    if (this.props.notifications) {
      /*
       * This.props.notifications.notifications.forEach(function (element: any, index: any) {
       *   notificationsToDisplay.unshift(
       *     <Notification key={index} notification={element} />
       *   );
       * });
       */

      return <View>{notificationsToDisplay}</View>;
    }

    return <View />;
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>{this.renderNotifications()}</ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state: any) => ({
  notifications: state.notifications,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationContainer);
