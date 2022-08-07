import MultiSlider from '@ptomasroos/react-native-multi-slider';
import PropTypes from 'prop-types';
import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions, LayoutAnimation, StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import CustomMarker from '../../screens/Auth/RegisterAgent/components/CustomMarker';
import PriceSuggestionList from '../PriceSuggestionList';
import RequiredLabel from '../RequiredLabel';
import RulerSlider from './RulerSlider';
import {RangeSliderProps} from './types';

const listSuggestionDefault = [
  {name: '1 - 5 tỷ', value: [1, 5]},
  {name: '5 - 10 tỷ', value: [5, 10]},
  {name: '10 - 20 tỷ', value: [10, 20]},
  {name: '20 - 30 tỷ', value: [20, 30]},
  {name: '30 - 40 tỷ', value: [30, 40]},
  {name: '40 - 50 tỷ', value: [40, 50]},
  {name: '50 tỷ +', value: [50, 50]},
];

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
  unit = '',
  optionsArray,
  min,
  max,
  step,
  enabledTwo,
  enabledOne,
  slideMargin = 40,
  isOverlappable,
  showSlideHeader = true,
  showDescription = true,
  sliderLength,
  containerStyle,
  headerStyle,
  renderDescription,
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
  const iOptionsArray = useMemo(
    () => (optionsArray?.length > 0 ? optionsArray : createArray(min, max, step)),
    [optionsArray, min, max, step],
  );
  const unitLower = unit?.toLocaleLowerCase();
  const [currentValues, setCurrentValues] = useState(values);
  const [listSuggestion, setListSuggestion] = useState(listSuggestionDefault);

  useEffect(() => {
    const findIndex = listSuggestion.findIndex(
      e => e.value[0] === currentValues[0] && e.value[1] === currentValues[1],
    );
    const newList = listSuggestionDefault.map((e, i) => {
      if (i === findIndex) {
        return {...e, isActive: true};
      }
      return {...e, isActive: false};
    });
    setListSuggestion(newList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValues[0], currentValues[1]]);

  const onChangeValues = value => {
    setCurrentValues(value);
  };

  const onSelectSuggestPrice = item => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentValues(item.value);
    onValuesChangeFinish(item.value);
  };

  const rangePrice = () => {
    if (showDescription) {
      if (currentValues.length === 1) {
        return `${currentValues[0]} ${unit}`;
      } else {
        if (currentValues[0] === currentValues[1]) {
          return `${translate('common.price2')} ${currentValues[0]} ${unit}`;
        }
        return `${translate('common.price_from_to', {
          from: `${currentValues[0]} ${unitLower}`,
          to: `${currentValues[1]} ${unitLower}${currentValues[1] >= max ? '+' : ''}`,
        })}`;
      }
    }
    return '';
  };

  return (
    <View style={containerStyle}>
      {showSlideHeader && (
        <View style={styles.price_interested}>
          <RequiredLabel title={title} isRequired={isRequired} titleStyle={headerStyle} />
        </View>
      )}
      {showDescription && <Text style={styles.desValue}>{rangePrice()}</Text>}
      {renderDescription}
      <View style={styles.sliderContainer}>
        <MultiSlider
          values={editable ? currentValues : [0]}
          optionsArray={iOptionsArray}
          sliderLength={sliderLength ? sliderLength : width - slideMargin}
          min={min}
          max={max}
          steps={step}
          customMarker={editable ? customMarker : () => null}
          selectedStyle={[editable ? trackSelectedStyle : styles.disabled, overrideTrackstyle]}
          unselectedStyle={[editable ? trackUnselectedStyle : styles.disabled, overrideTrackstyle]}
          trackStyle={{...trackStyle, ...(editable ? {} : styles.disabled)}}
          onValuesChange={onChangeValues}
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
          touchDimensions={{
            height: 200,
            width: 200,
            borderRadius: SIZES.BORDER_RADIUS_20,
            slipDisplacement: 1000,
          }}
        />
        <RulerSlider array={iOptionsArray} min={min} max={max} currentValues={currentValues} />
        <PriceSuggestionList
          data={listSuggestion}
          styleItem={styles.itemSuggestion}
          styleIsActive={{backgroundColor: COLORS.PRIMARY_A100}}
          onSelect={onSelectSuggestPrice}
        />
      </View>
    </View>
  );
};

RangeSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  title: PropTypes.string,
  isRequired: PropTypes.bool,
  values: PropTypes.array.isRequired,
  unit: PropTypes.string,
  enabledTwo: PropTypes.bool,
  isOverlappable: PropTypes.bool,
};

RangeSlider.defaultProps = {
  min: 0,
  max: 50,
  step: 1,
  title: '',
  isRequired: false,
  enabledTwo: true,
  isOverlappable: true,
};

export default RangeSlider;

const styles = StyleSheet.create({
  price_interested: {
    paddingTop: 16,
  },

  sliderInRange: {
    backgroundColor: COLORS.PRIMARY_A100,
  },
  sliderNotInRange: {backgroundColor: COLORS.SLIDER_NOT_IN_RANGE},

  sliderHeight: {
    height: 4,
  },

  sliderContainer: {alignItems: 'center'},
  disabled: {
    backgroundColor: COLORS.GRAY_A3,
  },
  desValue: {
    ...FONTS.regular,
    fontSize: 14,
    marginTop: SIZES.MARGIN_16,
  },
  itemSuggestion: {borderRadius: SIZES.BORDER_RADIUS_8, backgroundColor: COLORS.GREY_ED},
});
