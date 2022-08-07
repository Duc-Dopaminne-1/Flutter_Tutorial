import { Animated, Image, Text, View } from 'react-native';
import { CHECK, MARKED_READ, READ, TRASH, NOTIFICATION } from '@src/constants/icons';
import { IArchiveNotificationActionPayload, INotificationCategory, IReadNotificationActionPayload } from '../..';
import React, { Component } from 'react';
import { NOTIFICATIONS } from '@src/constants/screenKeys';
// import { Navigation } from 'react-native-navigation';
import NotificationCard from '@src/components/NotificationCard';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { colors } from '@src/constants/vars';
import styles from './styles';
import translate from '@src/localize';

export interface ItemProps {
  content: string;
  created: Date;
  read: boolean;
  title: string;
  category: INotificationCategory;
  id: string;
  onSwipe: (swipeItem: Swipeable) => void;
  onPressMarkRead: (payload: IReadNotificationActionPayload) => void;
  onPressArchive: (payload: IArchiveNotificationActionPayload) => void;
  onLongPress: () => void;
}

export default class ItemList extends Component<ItemProps> {
  lock = false;

  swipe: any;

  renderRightActionDelete = (x: number, progress: any) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      this.props.onPressArchive({
        ids: [this.props.id],
        callBack: this.setBadge,
      });
    };
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton style={[styles.rightAction, { backgroundColor: colors.RED }]} onPress={pressHandler}>
          <Image style={{ marginBottom: 5 }} source={TRASH} />
          <Text
            style={{
              color: colors.WHITE,
              paddingHorizontal: 10,
              lineHeight: 13,
            }}
          >
            Delete
          </Text>
        </RectButton>
      </Animated.View>
    );
  };

  setBadge = (number: number) => {
    const badge = number === 0 ? '' : number.toString();
    // Navigation.mergeOptions(`TAB-${NOTIFICATIONS}`, {
    //   bottomTab: {
    //     badge,
    //     badgeColor: 'red',
    //     icon: NOTIFICATION,
    //   },
    // });
    this.lock = false;
  };

  renderRightActionMarkRead = (x: number, progress: any) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.read ? 0 : x, 0],
    });
    const pressHandler = () => {
      if (!this.props.read && this.lock === false) {
        this.lock = true;
        this.props.onPressMarkRead({
          ids: [this.props.id],
          callBack: this.setBadge,
        });
      }
      this.swipe.close();
    };
    const icon = this.props.read ? READ : MARKED_READ;
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          activeOpacity={this.props.read ? 0 : 0.5}
          style={[styles.rightAction, { backgroundColor: colors.GREY }]}
          onPress={pressHandler}
        >
          <Image style={{ marginBottom: 5 }} source={icon} />
          <Text
            style={{
              color: colors.WHITE,
              paddingHorizontal: 10,
              textAlign: 'center',
              lineHeight: 13,
            }}
          >
            {this.props.read ? translate('notifications.read') : translate('notifications.mark_as_read')}
          </Text>
        </RectButton>
      </Animated.View>
    );
  };

  renderRightActions = (progress: Animated.AnimatedInterpolation) => (
    <View
      style={[
        {
          flexDirection: 'row',
          // Width: 200,
        },
      ]}
    >
      {this.props.read ? <View /> : <View style={{ width: 100 }}>{this.renderRightActionMarkRead(128, progress)}</View>}
      <View style={{ width: 100 }}>{this.renderRightActionDelete(98, progress)}</View>
    </View>
  );

  render() {
    const {
      // OnPress,
      created,
      content,
      read,
      category,
      id,
      title,
    } = this.props;
    return (
      <Swipeable
        onSwipeableWillOpen={() => this.props.onSwipe(this.swipe)}
        renderRightActions={this.renderRightActions}
        ref={c => (this.swipe = c)}
      >
        <NotificationCard
          // Key={index}
          data={{ content, created, read, category, id, title }}
          onNotificationTapped={this.props.onLongPress}
        />
      </Swipeable>
    );
  }
}
