import { View, Alert, Platform, ScrollView, Keyboard } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { styles, options } from './styles';
import { SEND_MESSAGE } from '@src/constants/icons';
import MIRCO from '@res/icons/microphone.png';
import PICTURE from '@res/icons/picture.png';
import DELETE from '@res/icons/delete.png';
import DELETE_RED from '@res/icons/delete_red.png';
import PRGRESS_WHITE from '@res/icons/progress_white.png';
import ChatInput from '@src/components/Chat/ChatInput';
import FastImage from 'react-native-fast-image';
import { CustomText } from '@src/components/CustomText';
import DELETE_USER_ICON from '@res/icons/delete_user.png';
//@ts-ignore
import { Stopwatch } from 'react-native-stopwatch-timer';
import translate from '@src/localize';
import { openSettings, check, PERMISSIONS, request } from 'react-native-permissions';
import * as Progress from 'react-native-progress';
import { Image as ImageProp } from 'react-native-image-crop-picker';
import { formatDurationRecord } from '@src/utils/date';
import Draggable from '../Draggable';
import * as Animatable from 'react-native-animatable';
import { colors } from '@src/constants/vars';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { MessageType } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/models';

export interface NewMessageProps {
  onSendMessage: (type: MessageType, content: string | string[]) => void;
  onPressPickImage: () => void;
  _onLongPress: () => void;
  _onPressOut: () => void;
  onRemoveImage: (index: number) => void;
  images: (ImageProp & { progress: number; sourceURL: string } & { type: any })[];
}

const AddNewMessageForm = (props: NewMessageProps) => {
  const [isRecording, setRecording] = useState(false);
  const [stopwatchStart, setStopwatchStart] = useState(false);
  const [stopwatchReset, setStopwatchReset] = useState(false);
  const [time, setTime] = useState(0);
  const [value, setValue] = useState('');
  const [showBin, setShowBin] = useState(false);
  const viewRef: any = useRef(null);
  const canSend = useRef<boolean>(true);
  const keyboardDidShowListener = useRef<any>();
  const keyboardDidHideListener = useRef<any>();
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const _keyboardDidShow = () => {
    setKeyboardHeight(15)
  }
  const _keyboardDidHide = () => {
    setKeyboardHeight(0)
  }
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      keyboardDidShowListener.current = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
      keyboardDidHideListener.current = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
      return () => {
        if (keyboardDidShowListener.current) {
          keyboardDidShowListener.current.remove()
        }
        if (keyboardDidHideListener.current) {
          keyboardDidHideListener.current.remove()
        }
      }
    }
  });
  const { onSendMessage, onPressPickImage, _onLongPress, _onPressOut, onRemoveImage, images } = props;

  const getMessageType = () => {
    const hasImage = images.length > 0;
    let checkImageType =
      images.filter(im => {
        return im.progress == 1 && im.sourceURL && im.type === 'image';
      }).length > 0;
    let checkVideoType =
      images.filter(im => {
        return im.progress == 1 && im.sourceURL && im.type === 'video';
      }).length > 0;
    if (hasImage) {
      if (checkImageType) {
        return MessageType.IMAGE;
      } else if (checkVideoType) {
        return MessageType.VIDEO;
      }
    } else if (isRecording) {
      return MessageType.RECORD;
    }
    return MessageType.TEXT;
  };

  const getMsecs = (time: any) => {
    setTime(time);
  };

  const checkOnRecording = () => {
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.MICROPHONE).then(result => {
        switch (result) {
          case 'unavailable':
            Alert.alert(translate('alert.micro_unavailable_title'), translate('alert.micro_unavailable_message'));
            break;
          case 'blocked':
            Alert.alert(translate('alert.micro_access_denied_title'), translate('alert.micro_access_denied_message'), [
              {
                text: translate('alert.ok'),
                onPress: () => setRecording(false),
              },
              {
                style: 'cancel',
                text: translate('alert.settings'),
                onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
              },
            ]);
            break;
          case 'denied':
            request(PERMISSIONS.IOS.MICROPHONE).then(result => {
              if (result === 'granted') {
                _onLongPress();
                setStopwatchStart(true);
                setStopwatchReset(false);
              }
            });
            break;
          case 'granted':
            _onLongPress();
            setStopwatchStart(true);
            setStopwatchReset(false);
            break;
        }
      });
    } else {
      check(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
        switch (result) {
          case 'unavailable':
            Alert.alert(translate('alert.micro_unavailable_title'), translate('alert.micro_unavailable_message'));
            break;
          case 'blocked':
            Alert.alert(translate('alert.micro_access_denied_title'), translate('alert.micro_access_denied_message'), [
              {
                text: translate('alert.ok'),
                onPress: () => setRecording(false),
              },
              {
                style: 'cancel',
                text: translate('alert.settings'),
                onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
              },
            ]);
            break;
          case 'denied':
            request(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
              if (result === 'granted') {
                _onLongPress();
                setStopwatchStart(true);
                setStopwatchReset(false);
              }
            });
            break;
          case 'granted':
            _onLongPress();
            setStopwatchStart(true);
            setStopwatchReset(false);
            break;
        }
      });
    }
  };

  const checkOnStopRecording = () => {
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.MICROPHONE).then(result => {
        switch (result) {
          case 'unavailable':
            break;
          case 'blocked':
            break;
          case 'denied':
            request(PERMISSIONS.IOS.MICROPHONE).then(result => {
              setRecording(false);
              // if (result === 'granted') {
              //   _onPressOut();
              //   setStopwatchStart(false);
              //   setStopwatchReset(true);
              // }
            });
            break;
          case 'granted':
            _onPressOut();
            setStopwatchStart(false);
            setStopwatchReset(true);
            onPressSend();
            break;
        }
      });
    } else {
      check(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
        switch (result) {
          case 'unavailable':
            break;
          case 'blocked':
            break;
          case 'denied':
            request(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
              setRecording(false);
              // if (result === 'granted') {
              //   _onPressOut();
              //   setStopwatchStart(false);
              //   setStopwatchReset(true);
              // }
            });
            break;
          case 'granted':
            _onPressOut();
            setStopwatchStart(false);
            setStopwatchReset(true);
            onPressSend();
            break;
        }
      });
    }
  };

  const onStartRecord = () => {
    if (!value) {
      if (images.length > 0) {
        return;
      }
      checkOnRecording();
    }
  };

  const onStopRecord = () => {
    if (!value) {
      if (images.length > 0) {
        return;
      }
      checkOnStopRecording();
    }
  };

  const onPressSend = () => {
    if (canSend.current) {
      canSend.current = false;
      const imageUrl: string[] = images.map(item => item.sourceURL);
      const content = images.length > 0 ? imageUrl : value.trim();
      onSendMessage(getMessageType(), content);
      setValue('');
      setTimeout(() => {
        canSend.current = true;
      }, 1000);
    }
  };

  const onStartDrag = () => {
    setRecording(true);
    onStartRecord();
  };

  const onDragResult = (isDetele: boolean) => {
    if (!isDetele) {
      onStopRecord();
      setRecording(false);
      return;
    }
    setRecording(false);
    setShowBin(true);
    setTimeout(() => {
      viewRef &&
        viewRef.current &&
        viewRef.current.shake().then(() => {
          setShowBin(false);
        });
    }, 200);
  };

  const onChangeText = (text: string) => {
    setValue(text);
  };

  const renderItem = () =>
    images.map((image: any, index: number) => {
      return (
        <View style={styles.wrapperImage} key={index}>
          <View style={styles.image}>
            <FastImage source={{ uri: image.path }} style={styles.imageAttach} />
            {image.progress > 0 && image.progress < 1 && <Progress.Bar progress={image.progress} width={80} color={colors.RED_COLOR} />}
            <CustomTouchable style={styles.deleteImageContainer} onPress={onRemoveImage.bind(undefined, index)}>
              <FastImage source={DELETE_USER_ICON} style={styles.deleteImageIcon} />
            </CustomTouchable>
          </View>
        </View>
      );
    });

  const renderSendOrRecord = () => {
    let source = value.trim() !== '' || images.length > 0 ? SEND_MESSAGE : MIRCO;
    const isUploading =
      images.length > 0 &&
      images.filter(item => item.progress != 1).length > 0;
    const showButton = (images.length > 0 && !isUploading) || images.length <= 0;
    return (
      showButton && (
        <FastImage resizeMode={'contain'} source={isRecording ? SEND_MESSAGE : source} style={[value ? styles.iconSend : styles.iconMicro]} />
      )
    );
  };

  const renderRecordIcon = () => (
    <View>
      <CustomText style={styles.swipetext} text={'Swipe left to cancel or release to send'} />
      <View style={styles.recordContainer}>
        <View style={styles.recordRow}>
          <FastImage resizeMode={'contain'} source={DELETE} style={styles.iconDetele} />
          <View style={styles.containerIconAudio}>
            <FastImage resizeMode={'contain'} source={PRGRESS_WHITE} style={styles.iconProgressAudio} />
          </View>
          <CustomText style={styles.time} text={formatDurationRecord(time) ?? '00:00'} />
          <Stopwatch start={stopwatchStart} reset={stopwatchReset} options={options} getMsecs={getMsecs} />
        </View>
      </View>
    </View>
  );

  const renderInput = () => (
    <ChatInput
      style={[styles.inputChat]}
      placeholder="Message"
      value={value}
      disable={images.length > 0}
      onChangeText={onChangeText}
      multiline
      moreStyle={styles.moreStyle}
      editable={!(images.length > 0)}
    />
  );

  const renderChatBar = () => (
    <View style={images.length ? styles.container : styles.containerWithoutImage}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {renderItem()}
      </ScrollView>
      <View style={[styles.chatBar]}>
        {!showBin ? (
          <CustomTouchable onPress={onPressPickImage} style={{ marginEnd: 12 }}>
            <FastImage source={PICTURE} style={styles.icon} />
          </CustomTouchable>
        ) : (
            <View style={[styles.icon, { marginEnd: 12 }]} />
          )}
        <View style={[styles.inputChatContainer]}>
          {renderInput()}
          <CustomTouchable style={styles.buttonSendContainer} onPress={onPressSend}>
            {renderSendOrRecord()}
          </CustomTouchable>
        </View>
      </View>
    </View>
  );

  const renderBin = () => (
    <Animatable.View style={styles.fakePin} iterationCount={'infinite'} direction="alternate" ref={viewRef}>
      <FastImage source={DELETE_RED} style={styles.icon} />
    </Animatable.View>
  );

  return (
    <View style={{ paddingBottom: keyboardHeight }}>
      {isRecording ? renderRecordIcon() : renderChatBar()}
      {value.trim() == '' && images.length == 0 && <Draggable styles={styles.draggable} onDrag={onDragResult} onStartDrag={onStartDrag} />}
      {showBin && renderBin()}
    </View>
  );
};

export { AddNewMessageForm };
