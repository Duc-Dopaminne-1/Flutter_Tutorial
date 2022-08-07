import React from 'react';
import styles from './styles';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../../vars';
import Modal from 'react-native-modal';

interface ModalLoadingProps {
  isVisible: boolean;
}
const ModalLoading = (props: ModalLoadingProps) => {
  return (
    <Modal isVisible={props.isVisible} animationInTiming={1} animationOutTiming={1}>
      <View style={styles.container}>
        <ActivityIndicator color={colors.red_600} />
      </View>
    </Modal>
  );
};

export default ModalLoading;
