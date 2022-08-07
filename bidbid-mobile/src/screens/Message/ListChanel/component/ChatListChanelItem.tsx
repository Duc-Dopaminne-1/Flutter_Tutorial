import React, { ReactElement } from 'react';
import { View, Image, Pressable, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import { colors, fonts, images } from '@/vars';
import { upPerCaseFirst } from '@/shared/processing';
import { language } from '@/i18n';
import { isIOS } from '@/shared/devices';
import { getUserId } from '@/redux/user/selector';
import { CONVERSATION_STARTED_MESSAGE } from '@/constants/app';
import RoundSVG from '@/components/SVG/RoundSVG';
import { formatNameUser } from '@/shared/discovery';

interface Prop {
  item: {
    name: string;
    lastMessage: {
      content: string;
      createdAt: string;
      creatorId: string;
    };
    imageUrl?: string;
    last_message_time: Date;
    id: string;
    unread: number;
    updatedAt: string;
  };
  unread: number;
  onPress: (roomId: string, name: string) => void;
}

function ChatListChanelItem(props: Prop): ReactElement {
  const {
    item: { id, lastMessage, imageUrl, updatedAt, unread },
    onPress,
    item,
  } = props;
  const prefixMessage = lastMessage?.creatorId === getUserId() ? `${language('you')}: ` : '';

  const getDayOfWeek = (date: string): any => {
    // "yyyy-mm-dd"
    const dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : moment(new Date(date)).format('dddd');
  };

  const setTimeOfMessage = (time: Date): string => {
    const dateTime = moment(time).format('YYYY-MM-DD');
    const currentDateTime = moment().format('YYYY-MM-DD');
    let distanceTime = moment(dateTime).locale('en').from(moment(currentDateTime), true);

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
      timeMessage = moment(time).format('MMMM DD');
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
    const messageStyle = [styles.lastMessage, unread !== 0 ? {} : { fontWeight: null }];
    return (
      <View style={styles.title}>
        <Text style={styles.userName} numberOfLines={1}>
          {upPerCaseFirst(formatNameUser(item))}
        </Text>
        <Text style={messageStyle} numberOfLines={1}>
          {prefixMessage}
          {lastMessage
            ? lastMessage.content === CONVERSATION_STARTED_MESSAGE
              ? language('conversationStarted')
              : lastMessage.content
            : language('hiChat')}
        </Text>
      </View>
    );
  };

  const renderTime = () => {
    if ((lastMessage && lastMessage.createdAt) || updatedAt) {
      const timeStyle = [styles.time, unread !== 0 ? { color: colors.red_700 } : {}];

      return (
        <View style={styles.content}>
          <Text style={timeStyle}>{setTimeOfMessage(new Date(lastMessage ? lastMessage.createdAt : updatedAt))}</Text>
          {unread !== 0 && (
            <View style={styles.wrapRound}>
              <RoundSVG />
            </View>
          )}
        </View>
      );
    }
    return null;
  };

  const onPressItem = () => {
    onPress(id, upPerCaseFirst(formatNameUser(item)));
  };

  return (
    <Pressable style={styles.container} onPress={onPressItem}>
      {renderAvatar()}
      <View style={styles.wrapItem}>
        <View style={styles.containerTitle}>
          {renderName()}
          {renderTime()}
        </View>
      </View>
    </Pressable>
  );
}

function moviePropsAreEqual(prevMovie, nextMovie) {
  if (prevMovie.item.lastMessage === null && nextMovie.item.lastMessage) {
    return false;
  }

  return !(
    (prevMovie.item.lastMessage && prevMovie.item.lastMessage.createdAt !== nextMovie.item.lastMessage.createdAt) ||
    prevMovie.unread !== nextMovie.unread
  );
}

export default React.memo(ChatListChanelItem, moviePropsAreEqual);

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
  },
  title: {
    flexDirection: 'column',
  },
  avatarWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 15,
    paddingTop: 5,
  },
  lastMessage: {
    fontSize: fonts.size.s12,
    color: colors.gray_900,
    fontWeight: isIOS ? '600' : 'bold',
    fontFamily: fonts.family.PoppinsRegular,
    marginTop: 4,
  },
  time: {
    color: colors.gray_500,
    fontSize: fonts.size.s12,
    fontFamily: fonts.family.PoppinsRegular,
  },
  userName: {
    fontSize: fonts.size.s14,
    color: colors.gray_900,
    fontWeight: isIOS ? '600' : 'bold',
    fontFamily: fonts.family.PoppinsRegular,
    marginTop: 6,
  },
  wrapRound: {
    marginTop: 11,
  },
});
