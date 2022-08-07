import { Image, Text, TouchableOpacity, View } from 'react-native';
import React, { Component } from 'react';
import { ICON } from '@src/constants/icons';
import { INotification } from '@modules/notifications';
import moment from 'moment';
import styles from './styles';

interface Props {
  data: INotification;
  onNotificationTapped: (notification: INotification) => void;
}
type State = {};

export default class NotificationCard extends Component<Props, State> {
  onNotificationTapping = () => {
    const { onNotificationTapped, data } = this.props;
    onNotificationTapped(data);
  };

  returnIcon = () => {
    return ICON;
  };

  render() {
    const { content, created, read, title } = this.props.data;
    const icon = this.returnIcon();
    return (
      <TouchableOpacity onLongPress={this.onNotificationTapping}>
        <View style={[styles.rowContainer, { backgroundColor: `${read ? '#FFFFFF' : '#EDF3FF'}` }]}>
          <Image style={styles.avatar} source={icon} />
          <View style={styles.contentContainer}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={[styles.messageText]} numberOfLines={2}>
              {content}
            </Text>
            <Text style={styles.createdDate}>{moment(created).fromNow()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
