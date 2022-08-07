import * as actions from './actions';
import { IArchiveNotificationActionPayload, INotification, IReadNotificationActionPayload } from '..';
import React, { Component } from 'react';
import Item from '@src/modules/notifications/components/Notification';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import connectHelper from '@src/utils/connect';
import selector from '@src/modules/notifications/notification/selector';

export interface ConnectNotificationProps {
  id: string;
  title?: string;
  onSwipe: (swipeItem: Swipeable) => void;
  onPressMarkRead: (payload: IReadNotificationActionPayload) => void;
  onPressArchive: (payload: IArchiveNotificationActionPayload) => void;
  onLongPress: () => void;
}

type Props = INotification & ConnectNotificationProps;

export class Notification extends Component<Props, {}> {
  render() {
    return (
      <Item
        onSwipe={this.props.onSwipe}
        content={this.props.content}
        created={this.props.created}
        category={this.props.category}
        title={this.props.title}
        id={this.props.id}
        read={this.props.read}
        onPressMarkRead={this.props.onPressMarkRead}
        onPressArchive={this.props.onPressArchive}
        onLongPress={this.props.onLongPress}
      />
    );
  }
}

export default connectHelper<ConnectNotificationProps>({
  state: (state, ownProps) => {
    return selector(ownProps.id)(state);
  },
  actions,
})(Notification);
