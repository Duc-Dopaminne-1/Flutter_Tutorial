import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {CONSTANTS, KEY_BOARD_TYPE, PERCENTAGE_UNIT} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {COLORS} from '../../assets/theme/colors';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import InputSection from '../InputSection';
import TextView from '../TextView';
import RangeSlider from './RangeSlider';
import {DefaultSliderNumberInputProps, RangeSliderProps, SliderWithInputProps} from './types';

export const DefaultMarker = ({style}) => {
  return (
    <TouchableOpacity
      hitSlop={CONSTANTS.HIT_SLOP}
      style={[styles.customMarker, style]}
      opacity={1}
    />
  );
};

export const DefaultSliderNumberInput = ({
  title,
  titleStyle,
  titleDescription,
  titleDescriptionStyle,
  editable,
  value,
  validation,
  style,
  onChangeInput = () => {},
  onBlurInput = () => {},
  onFocusInput = () => {},
}: DefaultSliderNumberInputProps) => {
  const [inputText, setInputText] = useState(value);

  const onInputTextChange = text => {
    if (validation && !validation(text)) {
      return;
    }
    setInputText(text);

    onChangeInput && onChangeInput(text, setInputText);
  };

  useEffect(() => {
    if (value >= 0) {
      setInputText(value);
    }
  }, [value]);

  return (
    <View style={[styles.inputContainer, style]}>
      <InputSection
        headerTitle={title}
        headerStyles={titleStyle}
        titleDescription={titleDescription}
        titleDescriptionStyle={titleDescriptionStyle}
        keyboardType={KEY_BOARD_TYPE.FLOAT_NUMBER}
        customStyle={METRICS.resetPadding}
        inputContainerStyle={[commonStyles.input, METRICS.resetMargin]}
        value={`${inputText}`}
        onChangeText={onInputTextChange}
        inputStyle={HELPERS.fullSize}
        editable={editable}
        customRightComponent={
          <View>
            <Text style={commonStyles.blackText14}>{PERCENTAGE_UNIT}</Text>
          </View>
        }
        isInputFloatPrice
        onFocus={() => onFocusInput(inputText, setInputText)}
        onBlur={() => onBlurInput(inputText, setInputText)}
      />
    </View>
  );
};

const SliderWithInput = ({
  headerTitle,
  titleStyle,
  headerRightComp,
  editable = true,
  markerStyle,
  customMarker,
  customRightComp,
  trackHorizontalPadding,
  ...props
}: RangeSliderProps | SliderWithInputProps | DefaultSliderNumberInputProps) => {
  const [sliderWidth, setSliderWidth] = useState(0);

  const onSliderContainerRender = event => {
    const containerWidth = event.nativeEvent.layout.width - (trackHorizontalPadding ?? 0);
    setSliderWidth(containerWidth);
  };

  return (
    <View style={styles.container}>
      <TextView
        title={headerTitle}
        titleStyle={titleStyle}
        customRightComponent={
          <View style={[HELPERS.fill, HELPERS.crossEnd]}>{headerRightComp}</View>
        }
      />
      <View style={[HELPERS.fullWidth, HELPERS.fillRow]}>
        <View style={HELPERS.fill} onLayout={onSliderContainerRender}>
          <RangeSlider
            {...props}
            markerStyle={markerStyle}
            sliderLength={sliderWidth}
            showSlideHeader={false}
            editable={editable}
            customMarker={customMarker ? customMarker : () => <DefaultMarker style={markerStyle} />}
          />
        </View>
        {customRightComp || (
          <DefaultSliderNumberInput
            editable={editable}
            value={props?.inputValue}
            validation={props?.inputValidator}
            onBlurInput={props?.onBlurInput}
            onFocusInput={props?.onFocusInput}
            onChangeInput={props?.onChangeInput}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...HELPERS.fullWidth,
  },
  customMarker: {
    borderRadius: 12,
    borderWidth: SIZES.BORDER_WIDTH_2,
    width: 24,
    height: 24,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  inputContainer: {width: 100, marginLeft: 24, marginTop: 8},
});

export default SliderWithInput;
