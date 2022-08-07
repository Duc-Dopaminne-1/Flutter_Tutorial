import { View, Image } from 'react-native';
import React, { Component, useMemo } from 'react';
import styles from './styles';
import moment from 'moment';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { DefaultAvatar } from '../../DefaultAvatar';

export interface ChatItemProps {
  key: string; // Need for prevent re-render
  title: string;
  content?: string;
  avatar?: string;
  created?: string;
  showRightButton?: boolean;
  rightButtonText?: string;
  isUnread?: boolean;
  onPress?: () => void;
  onRightButtonPress?: () => void;
}

const ChatItem = (props: ChatItemProps) => {
  const {
    key, // Need for prevent re-render
    title,
    content,
    avatar = '',
    created,
    isUnread = false,
    showRightButton,
    rightButtonText = '',
    onPress,
    onRightButtonPress,
  } = props;

  const renderAvatar = () => {
    return (
      <View style={styles.avatarWrapper}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <DefaultAvatar name={title} textStyle={styles.avatarText} containerStyle={[styles.avatar, styles.avatarContainer]} />
        )}
      </View>
    );
  };

  const renderTitleContentView = () => {
    const unreadStyle = isUnread ? styles.unRead : {};
    const renderContent = content ? (
      <CustomText style={[styles.lastMessage, unreadStyle]} numberOfLines={1} text={content} />
    ) : null;

    return (
      <View style={styles.title}>
        <CustomText style={[styles.username, unreadStyle]} numberOfLines={1} text={title} />
        {renderContent}
      </View>
    );
  };

  const renderCreatedView = () => {
    if (!created) return null;
    const unreadStyle = isUnread ? styles.unRead : {};

    return (
      <View style={styles.content}>
        <CustomText style={[styles.time, unreadStyle]} text={moment(created).fromNow()} />
      </View>
    );
  };

  const renderRightButton = () => {
    if (!showRightButton) return null;
    return (
      <CustomTouchable onPress={onRightButtonPress} style={styles.rightButtonContainer}>
        <CustomText style={styles.username} text={rightButtonText} />
      </CustomTouchable>
    );
  };

  const renderItem = useMemo(() => {
    return (
      <CustomTouchable disabled={showRightButton} style={styles.container} onPress={onPress}>
        {renderAvatar()}
        <View style={styles.containerTitle}>
          {renderTitleContentView()}
          {renderCreatedView()}
        </View>
      </CustomTouchable>
    );
  }, [key, title, content, avatar, created, isUnread]);

  return (
    <View>
      {renderItem}
      {renderRightButton()}
    </View>
  );
};

export default ChatItem;
