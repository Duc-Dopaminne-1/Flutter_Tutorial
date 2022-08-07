import React, {RefObject} from 'react';
import {Dimensions, Keyboard, Platform, StyleSheet, View} from 'react-native';
import {Modalize} from 'react-native-modalize';

const {height: screenHeight} = Dimensions.get('screen');
const modalMaxHeight = screenHeight * 0.9;

const styles = StyleSheet.create({
  modalContainer: {
    maxHeight: modalMaxHeight,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});

export const useModalize = (modalRef: RefObject) => {
  const openModal = () => {
    Keyboard.dismiss();
    modalRef?.current?.open();
  };

  const closeModal = () => {
    Keyboard.dismiss();
    modalRef?.current?.close();
  };

  return {
    openModal,
    closeModal,
  };
};

const ModalWithModalize = ({
  children,
  withReactModal = false,
  getModalRef,
  modalTopOffset = 0,
  onClosed = () => {},
  handlePosition = 'outside',
  scrollViewProps,
  ...props
}) => {
  return (
    <Modalize
      {...props}
      scrollViewProps={{keyboardShouldPersistTaps: 'always', ...scrollViewProps}}
      threshold={300}
      velocity={1000}
      modalTopOffset={modalTopOffset}
      modalStyle={styles.modalContainer}
      adjustToContentHeight
      withReactModal={withReactModal}
      ref={getModalRef}
      onClosed={onClosed}
      keyboardAvoidingBehavior={Platform.OS === 'ios' ? 'padding' : ''}
      keyboardAvoidingOffset={0}
      handlePosition={handlePosition}
      withOverlay>
      <View>{children}</View>
    </Modalize>
  );
};

export default ModalWithModalize;
