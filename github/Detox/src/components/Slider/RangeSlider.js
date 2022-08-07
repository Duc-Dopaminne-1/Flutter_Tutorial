import MultiSlider from '@ptomasroos/react-native-multi-slider';
import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../assets/theme/colors';
import CustomMarker from '../../screens/Auth/RegisterAgent/components/CustomMarker';
import RequiredLabel from '../RequiredLabel';
import {RangeSliderProps} from './types';

function createArray(start, end, step) {
  let i;
  let length;
  const direction = start - end > 0 ? -1 : 1;
  const result = [];
  if (!step) {
    return result;
  } else {
    length = Math.abs((start - end) / step) + 1;
    for (i = 0; i < length; i++) {
      result.push(start + i * Math.abs(step) * direction);
    }
    return result;
  }
}

const {width} = Dimensions.get('window');

const RangeSlider = ({
  title,
  isRequired,
  values,
  unit,
  onValuesChange,
  optionsArray,
  min,
  max,
  step,
  enabledTwo,
  enabledOne,
  slideMargin = 48,
  isOverlappable,
  showSlideHeader = true,
  showDescription = true,
  sliderLength,
  containerStyle,
  customMarker = CustomMarker,
  customMarkerLeft = () => null,
  customMarkerRight = () => null,
  trackSelectedStyle = styles.sliderInRange,
  trackUnselectedStyle = styles.sliderNotInRange,
  trackStyle = styles.sliderHeight,
  onValuesChangeStart = () => {},
  onValuesChangeFinish = () => {},
  editable = true,
  markerOffsetX,
  markerContainerStyle,
  overrideTrackstyle,
}: RangeSliderProps) => {
  const iOptionsArray = optionsArray?.length > 0 ? optionsArray : createArray(min, max, step);
  const rangePrice = () => {
    if (showSlideHeader && showDescription) {
      return values.length === 1
        ? `${values[0]} ${unit}`
        : `${values[0]} - ${values[1]} ${unit}${values[1] >= max ? ' +' : ''}`;
    }
    return '';
  };

  return (
    <View style={containerStyle}>
      {showSlideHeader && (
        <View style={styles.price_interested}>
          <RequiredLabel title={title} isRequired={isRequired} />
          {showDescription && <Text style={styles.priceLabel}>{rangePrice()}</Text>}
        </View>
      )}
      <View style={styles.sliderContainer}>
        <MultiSlider
          values={editable ? values : [0]}
          optionsArray={iOptionsArray}
          sliderLength={sliderLength ? sliderLength : width - slideMargin}
          min={min}
          max={max}
          steps={step}
          customMarker={editable ? customMarker : () => null}
          selectedStyle={[editable ? trackSelectedStyle : styles.disabled, overrideTrackstyle]}
          unselectedStyle={[editable ? trackUnselectedStyle : styles.disabled, overrideTrackstyle]}
          trackStyle={{...trackStyle, ...(editable ? {} : styles.disabled)}}
          onValuesChange={onValuesChange}
          enabledTwo={enabledTwo && editable}
          enabledOne={enabledOne && editable}
          customMarkerLeft={customMarkerLeft}
          customMarkerRight={customMarkerRight}
          snapped={true}
          allowOverlap={isOverlappable}
          onValuesChangeStart={onValuesChangeStart}
          onValuesChangeFinish={onValuesChangeFinish}
          markerOffsetX={markerOffsetX}
          markerContainerStyle={markerContainerStyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  price_interested: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },

  sliderInRange: {
    backgroundColor: COLORS.PRIMARY_A100,
  },
  sliderNotInRange: {backgroundColor: COLORS.SLIDER_NOT_IN_RANGE},

  sliderHeight: {
    height: 6,
  },

  sliderContainer: {alignItems: 'center'},
  disabled: {
    backgroundColor: COLORS.GRAY_A3,
  },
});

RangeSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  title: PropTypes.string,
  isRequired: PropTypes.bool,
  onValuesChange: PropTypes.func,
  values: PropTypes.array.isRequired,
  unit: PropTypes.string,
  enabledTwo: PropTypes.bool,
  isOverlappable: PropTypes.bool,
};

RangeSlider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  title: '',
  isRequired: false,
  onValuesChange: () => {},
  enabledTwo: true,
  isOverlappable: true,
};

export default RangeSlider;
