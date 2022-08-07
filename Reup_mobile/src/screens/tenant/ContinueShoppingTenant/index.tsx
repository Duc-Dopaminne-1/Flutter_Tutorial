import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';
import { CustomText } from '@src/components/CustomText';
import { CustomButton } from '@src/components/CustomButton';
import CustomSectionHeader from '@src/components/CustomSection';
import { upperCase } from 'lodash';
import translate from '@src/localize';
import { CustomTouchable } from '@src/components/CustomTouchable';
import FastImage, { Source } from 'react-native-fast-image';

interface Props {
  image: Source | number;
  visible: boolean;
  onBackdropPress: () => void;
  onPressContinueShopping: () => void;
  title?: string;
  content?: string;
  titleButton: string;
}

const ContinueShoppingTenant = (props: Props) => {

  const { image, visible, onBackdropPress, title, content, titleButton, onPressContinueShopping } = props;

  const renderButtonClose = () => {
    return (
      <CustomTouchable onPress={onBackdropPress}>
        <CustomText text='X' style={styles.textClose} styleContainer={styles.closeContainer} />
      </CustomTouchable>
    );
  };

  const renderPopupHeader = () => {
    return (
      <CustomSectionHeader
        style={styles.sectionHeader}
        rightComponent={renderButtonClose()}
      />
    );
  };

  return (
    <Modal
      key={'continueShopping'}
      hideModalContentWhileAnimating
      isVisible={visible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onBackdropPress}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }>
      <View style={styles.viewPopup}>
        {renderPopupHeader()}
        <FastImage resizeMode="contain" source={image} style={styles.imagePopup} ></FastImage>
        <CustomText style={styles.titleTextPopup} text={title ? title : ''}></CustomText>
        <CustomText style={styles.thankyouTextPopup} text={content ? content : ''}></CustomText>
        <CustomButton text={titleButton} style={styles.continueShoppingButton} onPress={onPressContinueShopping} />
      </View>
    </Modal>
  );
};

export default React.memo(ContinueShoppingTenant);
