/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {StringeeVideoView} from 'stringee-react-native';

import {CONSTANTS} from '../../assets/constants';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {normal} from '../../assets/theme/metric';
import {SCREEN_SIZE} from '../../utils/ImageUtil';
import {ActionButton} from './components/ActionButton';
import PhoneCallAnimation, {Props as AvatarProps} from './components/AnimatedLogo';
import DTMF from './components/DTMF';

export type CallScreenProps = {
  hasLocalStream?: boolean,
  stringeeCallId?: string,
  hasRemoteStream?: boolean,
  isVideoCall?: boolean,
  switchCameraHandler?: void,
  muteButtonHandler?: void,
  enableVideoButtonHandler?: void,
  acceptButtonHandler?: void,
  rejectButtonHandler?: void,
  speakerButtonHandler?: void,
  endButtonHandler?: void,
  userId?: string,
  callState?: string,
  isAnswered?: boolean,
  enableVideo?: boolean,
  isMute?: boolean,
  isSpeaker?: boolean,
} & AvatarProps;

const CallScreen = ({
  isAnswered,
  hasLocalStream,
  hasRemoteStream,
  stringeeCallId,
  isVideoCall,
  switchCameraHandler,
  userId,
  avatar,
  callState = 'Đang gọi...',
  muteButtonHandler,
  enableVideoButtonHandler,
  rejectButtonHandler,
  acceptButtonHandler,
  speakerButtonHandler,
  endButtonHandler,
  enableVideo,
  isMute,
  isSpeaker,
  enabledAnimation = false,
  initIsShowDTMF = false,
  sendDTMF,
}: CallScreenProps) => {
  const [isShowDTMF, setShowDTMF] = useState(initIsShowDTMF);

  return (
    <View style={styles.container}>
      {isVideoCall && (
        <>
          {hasRemoteStream && stringeeCallId !== '' && (
            <View style={styles.remoteView}>
              <StringeeVideoView
                style={HELPERS.fill}
                callId={stringeeCallId}
                streamId=""
                local={false}
              />
            </View>
          )}

          {hasLocalStream && stringeeCallId !== '' && (
            <View style={styles.localView}>
              <StringeeVideoView
                style={HELPERS.fill}
                callId={stringeeCallId}
                streamId=""
                local={true}
                overlay={true}
              />
            </View>
          )}

          {/* {isVideoCall && (
        <TouchableOpacity onPress={switchCameraHandler} style={styles.camera}>
          <Image source={cameraSwitchImg} style={styles.switchCamera} />
        </TouchableOpacity>
      )} */}
        </>
      )}

      <PhoneCallAnimation source={avatar} enabledAnimation={enabledAnimation} />
      <Text style={styles.userId} numberOfLines={1}>
        {userId}
      </Text>
      <Text style={styles.callState}>{callState}</Text>

      <View style={styles.bottomButons}>
        {isAnswered ? (
          <>
            {isShowDTMF ? (
              <DTMF onPress={sendDTMF} />
            ) : (
              <View>
                <View style={styles.row1}>
                  <ActionButton
                    icon={IMAGES.CALL_IC_VIDEO}
                    title={translate('call.video')}
                    isDisable={!isVideoCall}
                    isActive={false}
                    onPress={enableVideoButtonHandler}
                  />
                  <ActionButton
                    icon={IMAGES.CALL_IC_NUMPAD}
                    title={translate('call.numpad')}
                    isDisable={userId !== translate('call.hotline')}
                    onPress={() => setShowDTMF(true)}
                  />
                </View>
                <View style={styles.row2}>
                  <ActionButton
                    icon={IMAGES.CALL_IC_MUTE}
                    title={translate('call.mute')}
                    isActive={isMute}
                    onPress={muteButtonHandler}
                  />
                  <ActionButton
                    icon={IMAGES.CALL_IC_VOLUME}
                    title={translate('call.speaker')}
                    isActive={isSpeaker}
                    onPress={speakerButtonHandler}
                  />
                </View>
              </View>
            )}
          </>
        ) : null}

        {isAnswered ? (
          <View style={HELPERS.rowCenter}>
            <ActionButton
              icon={IMAGES.CALL_IC_END_CALL}
              inactiveBackground={COLORS.STATE_ERROR}
              inactiveColor={COLORS.NEUTRAL_WHITE}
              onPress={endButtonHandler}
            />
            {isShowDTMF && (
              <TouchableOpacity
                style={styles.hideButton}
                hitSlop={CONSTANTS.HIT_SLOP}
                onPress={() => setShowDTMF(false)}>
                <Text style={styles.hideText}>Ẩn</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={HELPERS.rowSpaceBetween}>
            <ActionButton
              icon={IMAGES.CALL_IC_END_CALL}
              inactiveBackground={COLORS.STATE_ERROR}
              inactiveColor={COLORS.NEUTRAL_WHITE}
              onPress={rejectButtonHandler}
            />
            <ActionButton
              icon={IMAGES.CALL_IC_CALL}
              inactiveBackground={COLORS.PRIMARY_A100}
              inactiveColor={COLORS.NEUTRAL_WHITE}
              onPress={acceptButtonHandler}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_A20,
  },

  localView: {
    backgroundColor: COLORS.TEXT_DARK_10,
    position: 'absolute',
    top: 50,
    right: 30,
    width: 100,
    height: 150,
  },

  remoteView: {
    backgroundColor: COLORS.TEXT_DARK_10,
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_SIZE.WIDTH,
    height: SCREEN_SIZE.HEIGHT,
  },
  // switchCamera: {
  //   position: 'absolute',
  //   top: 10,
  //   left: 20,
  //   width: 40,
  //   height: 40,
  //   zIndex: 2,
  // },

  userId: {
    ...FONTS.bold,
    color: COLORS.TEXT_DARK_10,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 180,
    marginHorizontal: normal,
  },
  callState: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
    marginTop: 8,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    marginBottom: 40,
  },
  bottomButons: {
    position: 'absolute',
    bottom: 50,
    left: 60,
    right: 60,
  },
  hideButton: {
    position: 'absolute',
    right: 50,
  },
  hideText: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
  },
});
