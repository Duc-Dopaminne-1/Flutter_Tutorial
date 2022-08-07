import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {HELPERS} from '../../assets/theme/helpers';
import {METRICS} from '../../assets/theme/metric';
import TextView from '../TextView';
import RangeSlider from './RangeSlider';
import {DefaultMarker, DefaultSliderNumberInput} from './SliderWithInput';
import {DefaultSliderNumberInputProps, RangeSliderProps, SliderWithInputProps} from './types';

const SliderWith2Inputs = ({
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
      <View style={HELPERS.fillRowSpaceBetween}>
        <View style={HELPERS.fill}>
          <Text style={props?.input1TitleStyle}>{props?.input1Title}</Text>
          <Text style={props?.input1TitleDescriptionStyle}>{props?.input1TitleDescription}</Text>
          <DefaultSliderNumberInput
            editable={editable}
            value={props?.input1Value}
            style={METRICS.resetMarginLeft}
            validation={props?.input1Validator}
            onBlurInput={props?.onBlurInput1}
            onFocusInput={props?.onFocusInput1}
            onChangeInput={props?.onChangeInput1}
          />
        </View>
        <View style={[HELPERS.fill, HELPERS.crossEnd]}>
          <Text style={props?.input2TitleStyle}>{props?.input2Title}</Text>
          <Text style={props?.input2TitleDescriptionStyle}>{props?.input2TitleDescription}</Text>
          <DefaultSliderNumberInput
            editable={editable}
            value={props?.input2Value}
            style={METRICS.resetMarginLeft}
            validation={props?.input2Validator}
            onBlurInput={props?.onBlurInput2}
            onFocusInput={props?.onFocusInput2}
            onChangeInput={props?.onChangeInput2}
          />
        </View>
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...HELPERS.fullWidth,
  },
});

export default SliderWith2Inputs;
