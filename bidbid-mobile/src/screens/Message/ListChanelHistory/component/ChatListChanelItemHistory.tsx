import React, { ReactElement } from 'react';
import { View, Image, Pressable, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import { colors, fonts, images } from '@/vars';
import { convertYYMMDDToMMDD } from '@/shared/processing';
import { CustomLine } from '@/components/CustomeLine';
import { language } from '@/i18n';

interface Prop {
  item: {
    name: string;
    lastMessage: {
      content: string;
      createdAt: string;
    };
    imageUrl?: string;
    last_message_time: Date;
    id: string;
    isHasMessage?: boolean;
  };
  onPress: (roomId: string, name: string) => void;
}

export function ChatListChanelItemHistory(props: Prop): ReactElement {
  const {
    item: { id, lastMessage, name, imageUrl },
    onPress,
  } = props;

  const getDayOfWeek = (date: string): any => {
    // "yyyy-mm-dd"
    const dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  };

  const setTimeOfMessage = (time: Date): string => {
    const dateTime = moment(time).format('YYYY-MM-DD');
    const currentDateTime = moment().format('YYYY-MM-DD');
    let distanceTime = moment(dateTime).from(moment(currentDateTime), true);

    let timeMessage = '';
    if (distanceTime === 'a few seconds') {
      timeMessage = moment(time).format('hh:mm a');
    } else if (
      distanceTime === 'a day' ||
      distanceTime === '2 days' ||
      distanceTime === '3 days' ||
      distanceTime === '4 days' ||
      distanceTime === '5 days' ||
      distanceTime === '6 days'
    ) {
      timeMessage = getDayOfWeek(dateTime);
    } else {
      timeMessage = convertYYMMDDToMMDD(dateTime);
    }
    return timeMessage;
  };

  const renderAvatar = () => {
    return (
      <View style={styles.avatarWrapper}>
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.avatar} /> : <Image source={images.missing} style={styles.avatar} />}
      </View>
    );
  };

  const renderName = () => {
    return (
      <View style={styles.title}>
        <Text style={styles.userName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {lastMessage ? lastMessage.content : language('hiChat')}
        </Text>
      </View>
    );
  };

  const renderTime = () => {
    if (lastMessage && lastMessage.createdAt) {
      return (
        <View style={styles.content}>
          <Text style={styles.time}>{setTimeOfMessage(new Date(lastMessage ? lastMessage.createdAt : ''))}</Text>
        </View>
      );
    }
    return null;
  };

  const onPressItem = () => {
    onPress(id, name);
  };

  return (
    <Pressable style={styles.container} onPress={onPressItem}>
      {renderAvatar()}
      <View style={styles.wrapItem}>
        <View style={styles.containerTitle}>
          {renderName()}
          {renderTime()}
        </View>
        <CustomLine lineStyle={styles.line} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 15,
    marginTop: 15,
  },
  containerTitle: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 15,
  },
  wrapItem: {
    flex: 1,
    marginTop: 8,
  },
  line: {
    backgroundColor: colors.gray_line_beta,
    marginLeft: 15,
    marginTop: 15,
  },
  title: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    flex: 0.8,
  },
  avatarWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    resizeMode: 'cover',
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginLeft: 15,
    paddingTop: 5,
  },
  lastMessage: {
    fontSize: fonts.size.s14,
    color: colors.gray_last_time,
    marginTop: 10,
  },
  time: {
    color: colors.gray_time,
    fontSize: fonts.size.s16,
  },
  userName: {
    fontSize: fonts.size.s16,
    color: colors.title_black,
  },
});
