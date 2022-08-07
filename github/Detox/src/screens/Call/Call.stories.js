import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {translate} from '../../assets/localize';
import CallScreen from './CallScreen';

const USER_ID = '84984120491';

storiesOf('z|Call/Video', module) //format
  .addDecorator(storyFn => <View style={styles.container}>{storyFn()}</View>)
  .add('answering', () => (
    <CallScreen //format
      isVideoCall
      userId={USER_ID}
      isAnswered
    />
  ))

  .add('calling', () => (
    <CallScreen //foramat
      userId={USER_ID}
      isVideoCall
    />
  ))

  .add('enable speaker', () => (
    <CallScreen //format
      userId={USER_ID}
      isVideoCall
      isAnswered
      isSpeaker
    />
  ))

  .add('disable volume', () => (
    <CallScreen //format
      userId={USER_ID}
      isVideoCall
      isAnswered
      isMute
    />
  ))

  .add('disable video', () => (
    <CallScreen //format
      userId={USER_ID}
      isVideoCall
      isAnswered
      enableVideo
    />
  ))

  .add('show dtmf', () => (
    <CallScreen //format
      userId={translate('call.hotline')}
      isVideoCall
      isAnswered
      initIsShowDTMF
    />
  ))

  .add('default', () => <CallScreen userId={USER_ID} isVideoCall isAnswered />);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'blue'},
});
