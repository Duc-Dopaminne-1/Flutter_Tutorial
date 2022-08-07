import React, { ReactElement } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '@/vars';

interface CustomInitModalProps {
  isVisible: boolean;
  onBackdropPress?: () => void;
  children: ReactElement;
}

export default function CustomInitModal(props: CustomInitModalProps): ReactElement {
  const { isVisible, onBackdropPress, children } = props;

  return (
    <Modal
      isVisible={isVisible}
      style={styles.modal}
      customBackdrop={
        <TouchableWithoutFeedback onPress={onBackdropPress}>
          <View style={styles.wrapOutModal} />
        </TouchableWithoutFeedback>
      }
      onBackdropPress={onBackdropPress}
    >
      {children}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 0,
    justifyContent: 'flex-end',
    marginVertical: 0,
  },
  wrapOutModal: {
    flex: 1,
    backgroundColor: colors.gray_900,
  },
});
