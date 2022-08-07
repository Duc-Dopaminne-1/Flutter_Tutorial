import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { BallIndicator } from '..';
import { CUSTOM_COLOR } from '../../constants/colors';

const AppLoading = ({ loading }) => {
  return (
    <View>
      <Modal
        animationInTiming={100}
        animationIn="fadeIn"
        animationOutTiming={100}
        animationOut="fadeOut"
        isVisible={loading}>
        <BallIndicator color={CUSTOM_COLOR.White} />
      </Modal>
    </View>
  );
};

export default AppLoading;
