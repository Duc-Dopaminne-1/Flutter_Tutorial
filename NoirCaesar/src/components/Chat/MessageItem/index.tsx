import { View, Image } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import styles from './styles';
import moment from 'moment';
import { CustomText } from '../../CustomText';
import Svg, { Path } from 'react-native-svg';
import { moderateScale } from 'react-native-size-matters';
import { CustomTouchable } from '../../CustomTouchable';
import ImageList from '../ImageList';
import VideoList from '../VideoList';
import { AudioItem } from '../AudioItem';
import { MessageType } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/models';
import { DefaultAvatar } from '@src/components/DefaultAvatar';

export interface MessageItemProps {
  channelId?: string;
  messageId: string;
  content: string;
  isCurrentUser: boolean;
  time: Date | string;
  status?: string;
  isShowStatus?: boolean;
  showDate: boolean;
  type?: MessageType;
  urls?: string[];
  paused?: boolean;
  duration?: number;
  currentId: string;
  onPressImage: (uris: string[], index: number) => void;
  onPressPlay?: (recordUri: string, id: string) => void;
  onPressPause?: () => void;
  onPressVideo: (uri: string[], index: number) => void;
}

export interface GroupProps {
  user_id?: string;
  showDisplayName?: boolean;
  showAvatar?: boolean;
  display_name?: string;
  avatar?: string;
  onPressAvatar?: (userId: string) => void;
}

export interface Props {
  messageProps: MessageItemProps;
  groupProps: GroupProps;
  isChatGroup?: boolean;
}

const MessageItem = (props: Props) => {
  const { messageProps, groupProps, isChatGroup = false } = props;

  const {
    channelId,
    messageId,
    content,
    time,
    status,
    isCurrentUser,
    isShowStatus = false,
    showDate = true,
    type = MessageType.TEXT,
    urls = [],
    paused,
    duration,
    currentId = '',
    onPressImage,
    onPressPlay,
    onPressPause,
    onPressVideo,
  } = messageProps;

  const {
    user_id = '',
    showDisplayName = false,
    showAvatar = false,
    display_name = '',
    avatar = '',
    onPressAvatar
  } = groupProps;

  const onPressItemListVideo = useCallback((index: number) => onPressVideo(urls, index), [urls]);

  const renderVideoList = () => (
    <View style={[{ flexDirection: 'row' }, !isCurrentUser ? styles.itemIn : styles.itemOut]}>
      <VideoList videos={urls} onPressVideo={onPressItemListVideo} />
    </View>
  );

  const onPressItemListImage = useCallback((index: number) => onPressImage(urls, index), [urls]);

  const renderImageList = () => {
    return (
      <View style={[{ flexDirection: 'row' }, !isCurrentUser ? styles.itemIn : styles.itemOut]}>
        <ImageList channelId={channelId} messageId={messageId} images={urls} onPressImage={onPressItemListImage} />
      </View>
    )
  };

  const renderRecord = (isCurrent: boolean) => (
    <AudioItem
      id={messageId}
      recordUri={urls[0]}
      paused={paused}
      onPressPlay={onPressPlay && onPressPlay.bind(undefined, urls[0], messageId)}
      onPressPause={onPressPause}
      isCurrent={isCurrent}
      duration={duration ?? 0}
      currentId={currentId}
    />
  );

  const renderLeftText = () => {
    return (
      <View style={[styles.item, styles.itemIn]}>
        <View style={[styles.balloon, styles.balloonLeft]}>
          <CustomText style={[styles.text]} text={content} />
          <View style={[styles.arrowContainer, styles.arrowLeftContainer]}>
            <Svg
              style={styles.arrowLeft}
              width={moderateScale(15.5, 0.6)}
              height={moderateScale(17.5, 0.6)}
              viewBox="32.484 17.5 15.515 17.5"
              enable-background="new 32.485 17.5 15.515 17.5"
            >
              <Path d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z" fill="#676877" x="0" y="0" />
            </Svg>
          </View>
        </View>
      </View>
    );
  }

  const renderRightText = () => {
    return (
      <View style={[styles.itemOut, { alignItems: 'flex-end' }]}>
        <View style={[styles.item]}>
          <View style={[styles.balloon, styles.balloonRight]}>
            <CustomText style={[styles.text]} text={content} />
            <View style={[styles.arrowContainer, styles.arrowRightContainer]}>
              <Svg
                style={styles.arrowRight}
                width={moderateScale(15.5, 0.6)}
                height={moderateScale(17.5, 0.6)}
                viewBox="0 0 3005 2248.37"
                enable-background="new 32.485 17.5 15.515 17.5"
              >
                <Path
                  d="M2937.39,2108.08c-3.88-1.31-391.72-134.66-795.52-438.5-236.63-178-431.82-378.72-580.14-596.46-176.38-258.9-286.67-543-328.17-845L288.79,1638.61l-.07.1c163.82,187.35,352,313,498.12,391.46,247,132.61,532.78,217.37,849.46,251.93,386.66,42.21,823,9.63,1297-96.81L3072.79,2154Z"
                  fill="#0F0F13"
                  x="0"
                  y="0"
                  stroke="#0F0F13"
                />
                <Path
                  d="M2937.39,2108.08c-3.88-1.31-391.72-134.66-795.52-438.5-236.63-178-431.82-378.72-580.14-596.46-176.18-258.62-286.43-542.38-328-844.07L1168,327c51.29,281.7,161.08,547.36,327.31,791.38,153.29,225,354.57,432.07,598.23,615.42,276.57,208.1,541.41,336.69,691.63,400.78-414.92,82.28-797.95,105.08-1140.19,67.73-306.39-33.44-582.34-115.15-820.19-242.85-143.94-77.28-330.45-202.36-489.76-390l-46.41,69.22c163.84,187.38,352,313,498.18,391.52,247,132.61,532.78,217.37,849.46,251.93,386.66,42.21,823,9.63,1297-96.81L3072.79,2154Z"
                  fill="#676877"
                  x="0"
                  y="0"
                  stroke="#676877"
                />
              </Svg>
            </View>
          </View>
        </View>
      </View>
    );
  }

  const renderLeftItem = () => {
    switch (type) {
      case MessageType.TEXT:
        return renderLeftText();
      case MessageType.IMAGE:
        return renderImageList();
      case MessageType.RECORD:
        return renderRecord(false);
      case MessageType.VIDEO:
        return renderVideoList();
    }
  };

  const renderRightItem = () => {
    switch (type) {
      case MessageType.TEXT:
        return renderRightText();
      case MessageType.IMAGE:
        return renderImageList();
      case MessageType.RECORD:
        return renderRecord(true);
      case MessageType.VIDEO:
        return renderVideoList();
    }
  };

  const renderStatus = () => isShowStatus && status && <CustomText style={styles.status} text={status} />;

  const renderSystemMessage = () => {
    return (
      <View>
        {showDate && renderTime()}
        <CustomText
          style={styles.systemMessage}
          text={content}
        />
      </View>
    );
  };

  const renderTime = () => {
    return (
      <CustomText
        style={styles.date}
        text={moment(time)
          .format('hh:mm a')
          .toString()
          .toUpperCase()}
      />
    );
  };

  const renderDisplayName = useMemo(() => {
    if (!isChatGroup || isCurrentUser || !showDisplayName) return null;
    return <CustomText style={styles.displayName} text={display_name} />;
  }, [showDisplayName]);

  const renderAvatar = useMemo(() => {
    if (!isChatGroup || isCurrentUser) return null;
    if (!showAvatar) return <View style={{ width: 46 }} />;
    if (avatar) return (
      <CustomTouchable style={{ alignSelf: 'flex-end' }} onPress={() => onPressAvatar && onPressAvatar(user_id)}>
        <Image source={{ uri: avatar }} style={[styles.avatar, styles.item]} />
      </CustomTouchable>
    )
    else return (
      <CustomTouchable style={{ alignSelf: 'flex-end' }} onPress={() => onPressAvatar && onPressAvatar(user_id)}>
        <DefaultAvatar name={display_name} textStyle={styles.avatarText} containerStyle={[styles.avatar, styles.item]} />
      </CustomTouchable>
    )
  }, [showAvatar]);

  const renderMainView = () => {
    return (
      <View>
        {showDate && renderTime()}
        <View style={[styles.contentWrap, !isCurrentUser ? styles.leftContentWrap : styles.rightContentWrap]}>
          {renderAvatar}
          <View>
            {renderDisplayName}
            {!isCurrentUser ? renderLeftItem() : renderRightItem()}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.container}>
        {type === MessageType.SYSTEM ? renderSystemMessage() : renderMainView()}
      </View>
    </View>
  );
};

export { MessageItem };
