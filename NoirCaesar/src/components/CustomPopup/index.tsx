import React from 'react';
import { View, Image } from 'react-native';
import IC_LOGO from '@res/images/ic_logo.png';
import { styles } from './styles';
import translate from '@src/localize';
import { CustomText } from '../CustomText';
import Modal from 'react-native-modal';
import { CustomTouchable } from '../CustomTouchable';
import { colors } from '@src/constants/vars';

export interface Props {
  loading: boolean;
  text?: string;
  showText?: boolean;
  showLogo?: boolean;
  buttonRedTitle?: string;
  buttonGrayTitle?: string;
  onPressRedButton?: () => void;
  onPressGrayButton?: () => void;
  onBackdropPress?: () => void;
}

export const CustomPopup = (props: Props) => {
  const {
    loading,
    text = '',
    showText = true,
    showLogo = true,
    buttonRedTitle = translate('upload_collection.close'),
    buttonGrayTitle,
    onPressRedButton,
    onPressGrayButton,
    onBackdropPress,
  } = props;

  const renderButton = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {buttonGrayTitle ? (
          <CustomTouchable style={[styles.buttonClose, { backgroundColor: colors.GRAY_COLOR, width: '50%' }]} onPress={onPressGrayButton}>
            <CustomText text={buttonGrayTitle} style={styles.textButton} />
          </CustomTouchable>
        ) : null}
        <CustomTouchable
          style={[styles.buttonClose, { backgroundColor: colors.RED_COLOR, width: buttonGrayTitle ? '50%' : '100%' }]}
          onPress={onPressRedButton}
        >
          <CustomText text={buttonRedTitle} style={styles.textButton} />
        </CustomTouchable>
      </View>
    );
  };

  return (
    <Modal onBackdropPress={onBackdropPress} onBackButtonPress={onBackdropPress} isVisible={loading}>
      <View style={styles.container}>
        {showLogo ? <Image source={IC_LOGO} style={styles.image} /> : null}
        {showText ? <CustomText text={text} style={styles.textTitle}></CustomText> : null}
        {renderButton()}
      </View>
    </Modal>
  );
};
