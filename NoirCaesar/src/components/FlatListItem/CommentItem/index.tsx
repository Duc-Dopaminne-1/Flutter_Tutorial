import styles from './styles';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { CustomText } from '@src/components/CustomText';
import FastImage from 'react-native-fast-image';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { IComment } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment/models';
import { formatTime } from '@src/utils/date';
import { DefaultAvatar } from '@src/components/DefaultAvatar';

interface ChapterItemProp {
  item: IComment;
  onCustomPress: () => void;
}

const CommentItem = (props: ChapterItemProp) => {
  const { item, onCustomPress } = props;

  const renderAvatar = () => {
    if (item.user.avatar && item.user.avatar != '') {
      return <FastImage resizeMode={'stretch'} source={{ uri: item.user.avatar }} style={styles.avatar} />;
    } else {
      return <DefaultAvatar name={item.user.username} textStyle={styles.avatarText} containerStyle={styles.avatar} />;
    }
  };

  return (
    <CustomTouchable onPress={onCustomPress}>
      <View style={styles.container}>
        {renderAvatar()}
        <View style={styles.containerContent}>
          <View style={styles.containerTitle}>
            <CustomText style={styles.contentTitle} numberOfLines={1} text={item.user.username}></CustomText>
            <CustomText style={styles.contentTime} numberOfLines={1} text={formatTime(item.created)}></CustomText>
          </View>
          <CustomText style={styles.contentDes} text={item.text}></CustomText>
        </View>
        <View style={styles.separator} />
      </View>
    </CustomTouchable>
  );
};

export { CommentItem };
