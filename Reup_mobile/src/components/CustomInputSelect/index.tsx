import React from 'react';
import styles from './styles';
import { View, Image } from 'react-native';
import { CustomText } from '../CustomText';
import { CustomTouchable } from '../CustomTouchable';
import { INPUT_WIDTH } from '@src/constants/vars';
import { ICON_ARROW_DOWN } from '@src/constants/icons';

const CustomInputSelect = ({
  text,
  description,
  descriptionStyle,
  moreStyle,
  containerStyle,
  textStyle,
  onPress,
  iconRightStyle,
  mainContainer,
  showLeftIcon = true,
  styleTouchable,
  ...rest
}: any) => (
    <View style={[styles.mainContainer, mainContainer]}>
      {description ? <CustomText style={[styles.description, descriptionStyle]} text={description} /> : null}
      <CustomTouchable style={styleTouchable ?? styles.customTouchable} onPress={onPress}>
        <View style={[styles.formBar, moreStyle]}>
          <View style={[styles.container, containerStyle, { width: '100%' }]}>
            <CustomText
              text={text}
              style={[styles.textStyle, textStyle]}
            />
            {showLeftIcon
              ? <Image resizeMode={'contain'} style={[styles.arrowImage, iconRightStyle]} source={ICON_ARROW_DOWN} />
              : null
            }
          </View>
        </View>
      </CustomTouchable>
    </View >
  );

export default React.memo(CustomInputSelect);
