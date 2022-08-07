/* eslint-disable no-underscore-dangle */
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {
  Bubble,
  GiftedChat,
  GiftedChatProps,
  IMessage,
  Message,
  MessageText,
  MessageTextProps,
} from 'react-native-gifted-chat';

import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal, small} from '../../assets/theme/metric';
import BaseScreen from '../../components/BaseScreen';
import {Loading} from '../../components/SectionHorizontalList';
import {FORMAT_DATE, unixTimestampToTimeAmPm} from '../../utils/TimerCommon';
import {StringeeContext} from '../Call/StringeeContext';
import ScreenIds from '../ScreenIds';

const styles = StyleSheet.create({
  btnSend: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: small,
  },
  textMessage: {
    flex: 1,
    height: 40,
    paddingTop: 12,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    paddingHorizontal: normal,
    paddingRight: 60,
    borderRadius: small,
  },
  viewInputMessage: {
    flexDirection: 'row',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: small,
    borderTopWidth: 1,
    borderTopColor: COLORS.SEPARATOR_LINE,
  },
  logo: {width: 36, height: 36},
  textUser: {
    ...FONTS.regular,
    fontSize: 12,
    textAlign: 'right',
    color: COLORS.TEXT_DARK_40,
    marginBottom: small,
  },
});

export const LiveChatRoomScreen = ({navigation, route}) => {
  const {queueId, description, name, email, phone} = route?.params ?? {};
  const {
    liveChat: {
      //
      connected,
      userId,
      inConv,
      lastMessage,
      onPressStart,
      onPressSend,
      onPressEnd,
    },
  } = useContext(StringeeContext);

  const [messages, setMessages] = useState([]);
  const loading = !inConv;

  useEffect(() => {
    if (connected) {
      onPressStart(queueId, name, email, phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  useEffect(() => {
    if (inConv) {
      onSend([
        {
          _id: 1,
          text: description,
          createdAt: new Date(),
          user: {
            _id: userId,
          },
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inConv]);

  useEffect(() => {
    if (lastMessage) {
      setMessages(previousMessages => {
        return GiftedChat.append(previousMessages, [lastMessage]);
      });
    }
  }, [lastMessage]);

  const onBackPress = () => {
    onPressEnd();
    navigation.goBack();
  };

  const onSend = (messages2: IMessage[] = []) => {
    setMessages(previousMessages => {
      return GiftedChat.append(previousMessages, messages2);
    });

    messages2.forEach(message => {
      onPressSend(message.text);
    });
  };

  return (
    <BaseScreen
      testID={ScreenIds.LiveChatRoom}
      title={translate('liveChatRoom.screenTitle')}
      onBackPress={onBackPress}>
      <Loading loading={loading}>
        <LiveChatRoomContainer
          messages={messages}
          userId={userId}
          onSend={messages2 => onSend(messages2)}
          renderAvatar={() => <Image source={IMAGES.LOGO_CIRCLE} style={styles.logo} />}
        />
      </Loading>
    </BaseScreen>
  );
};

const RenderTimeAndUser = ({props}) => {
  const isRenderUserAndTime = props.currentMessage?.user?._id !== props.previousMessage?.user?._id;
  const userName = props.position === 'right' ? '' : props.currentMessage.user.name;
  const messageTime =
    props.currentMessage.createdAt && unixTimestampToTimeAmPm(props.currentMessage.createdAt);
  return (
    <View>
      <Message
        {...props}
        renderBubble={() => {
          return (
            <View>
              {isRenderUserAndTime && (
                <Text style={[styles.textUser, {textAlign: props.position}]}>
                  {`${userName ? `${userName},` : ''} ${messageTime ?? ''}`}
                </Text>
              )}
              <Bubble
                {...props}
                containerStyle={{
                  left: {marginVertical: 0},
                }}
                wrapperStyle={{
                  left: {backgroundColor: COLORS.GREY_ED},
                  right: {backgroundColor: COLORS.PRIMARY_A100},
                }}
                renderTime={() => <></>}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

type CustomChatProps = {
  renderActionsButton: React.ReactNode,
  renderMessageFile: (props: MessageTextProps) => React.ReactNode,
} & GiftedChatProps;

export const LiveChatRoomContainer = ({
  messages,
  userId,
  onSend,
  renderActionsButton,
  renderMessageFile = () => {},
  ...giftedChatProps
}: CustomChatProps) => {
  const [textMessage, setTextMessage] = useState('');
  const inputRef = useRef();

  const onPressSend = props => {
    props.onSend({text: textMessage.trim()}, true);
    setTextMessage('');
    inputRef.current.clear();
  };

  return (
    <GiftedChat
      {...giftedChatProps}
      messages={messages}
      renderAvatarOnTop={true}
      renderMessage={props => {
        return <RenderTimeAndUser props={props} />;
      }}
      renderMessageText={props => {
        return (
          <MessageText
            {...props}
            textStyle={{
              left: {...FONTS.regular, color: COLORS.BLACK_31, fontSize: 14},
              right: {...FONTS.regular, color: COLORS.NEUTRAL_WHITE, fontSize: 14},
            }}
            renderMessageFile={renderMessageFile(props)}
          />
        );
      }}
      renderInputToolbar={props => (
        <View style={styles.viewInputMessage}>
          {renderActionsButton}
          <TextInput
            ref={inputRef}
            multiline
            style={styles.textMessage}
            onChangeText={setTextMessage}
            placeholder={translate('liveChatSupport.inputPlaceHolder')}
            placeholderTextColor={COLORS.TEXT_DARK_40}
          />
          {textMessage.trim().length > 0 && (
            <TouchableOpacity onPress={() => onPressSend(props)} style={styles.btnSend}>
              <Image source={IMAGES.IC_SEND} style={{tintColor: COLORS.PRIMARY_A100}} />
            </TouchableOpacity>
          )}
        </View>
      )}
      minInputToolbarHeight={60}
      isCustomViewBottom={true}
      onSend={messages2 => onSend(messages2)}
      user={{_id: userId}}
      keyboardShouldPersistTaps="handled"
      dateFormat={FORMAT_DATE.CALENDAR_DATE}
    />
  );
};
