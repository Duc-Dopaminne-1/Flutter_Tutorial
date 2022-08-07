import React from 'react';
import { SafeAreaView, View, Image } from 'react-native';
import {
  ICON_PREV_ON,
  ICON_PREV_OFF,
  ICON_NEXT_ON,
  ICON_NEXT_OFF,
  ICON_COMBINED_SHAPE,
  ICON_COMBINED_SHAPE_OFF,
} from '@src/constants/icons';
import { CustomText } from '@src/components/CustomText';
import styles from './styles';
import { CustomTouchable } from '@src/components/CustomTouchable';
import translate from '@src/localize';

interface Props {
  canPrev: boolean;
  canNext: boolean;
  canOption: boolean;
  onPressPrev?: () => void;
  onPressNext?: () => void;
  onPressOptions?: () => void;
}

const BottomControl = (props: Props) => {
  const { canPrev, canNext, canOption, onPressPrev, onPressNext, onPressOptions } = props;

  const renderPreviousView = () => {
    const styleBottomText = canPrev ? styles.bottomTextOn : styles.bottomTextOff;
    const imageIcon = canPrev ? ICON_PREV_ON : ICON_PREV_OFF;

    return (
      <CustomTouchable disabled={!canPrev} onPress={onPressPrev} style={styles.pressContainer}>
        <Image resizeMode="contain" source={imageIcon} style={[styles.bottomIcon, { marginRight: 5 }]} />

        <CustomText style={styleBottomText} text={translate('bookReader.button_prev')} />
      </CustomTouchable>
    );
  };

  const renderBottomMidIcon = () => {
    const imageIcon = canOption ? ICON_COMBINED_SHAPE : ICON_COMBINED_SHAPE_OFF;
    return (
      <CustomTouchable disabled={!canOption} onPress={onPressOptions} style={{ marginHorizontal: 64 }}>
        <Image resizeMode="contain" source={imageIcon} style={styles.bottomMidIcon} />
      </CustomTouchable>
    );
  };

  const renderNextView = () => {
    const styleBottomText = canNext ? styles.bottomTextOn : styles.bottomTextOff;
    const imageIcon = canNext ? ICON_NEXT_ON : ICON_NEXT_OFF;

    return (
      <CustomTouchable disabled={!canNext} onPress={onPressNext} style={styles.pressContainer}>
        <CustomText style={styleBottomText} text={translate('bookReader.button_next')} />

        <Image resizeMode="contain" source={imageIcon} style={[styles.bottomIcon, { marginLeft: 5 }]} />
      </CustomTouchable>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#131318' }}>
      <View style={styles.bottomControl}>
        {renderPreviousView()}
        {renderBottomMidIcon()}
        {renderNextView()}
      </View>
    </SafeAreaView>
  );
};

export default BottomControl;
