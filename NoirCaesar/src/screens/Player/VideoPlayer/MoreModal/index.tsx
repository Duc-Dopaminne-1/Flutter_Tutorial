import styles from './styles';
import { View } from 'react-native';
import React from 'react';
import { CustomText } from '@src/components/CustomText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { ModalItem } from '../index';

interface Props {
  items: ModalItem[];
  onBackdropPress: () => void;
  loading: boolean;
  onCustomPress: (item: ModalItem) => void;
}

const MoreModal = (props: Props) => {
  return (
    <Modal onBackdropPress={props.onBackdropPress} onBackButtonPress={props.onBackdropPress} isVisible={props.loading}>
      <View style={styles.activityIndicatorWrapper}>
        <KeyboardAwareScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
          {props.items &&
            props.items.map((item: ModalItem) => (
              <CustomTouchable key={item.key} style={styles.containerButton} onPress={props.onCustomPress.bind(undefined, item)}>
                <CustomText text={item.value} style={styles.textTitle} numberOfLines={1}></CustomText>
              </CustomTouchable>
            ))}
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
};
export { MoreModal };
