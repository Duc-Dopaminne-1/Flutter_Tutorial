/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {CONSTANTS} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {translate} from '../assets/localize';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {METRICS} from '../assets/theme/metric';
import InputFormatType from '../components/InputFormatType';
import {useSetRangeValue} from '../hooks';
import RequiredLabel from './RequiredLabel';

const styles = StyleSheet.create({
  inputKeyword: {
    height: 40,
    borderRadius: 5,
    borderWidth: SIZES.BORDER_WIDTH_1,
    flex: 1,
    borderColor: COLORS.SELECTED_AREA,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    paddingLeft: 8,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  marginText: {marginHorizontal: 12, ...FONTS.regular},
  viewRangeSelect: {
    // height: 50,
  },
  containerSelect: {
    flexWrap: 'wrap',
    marginTop: 12,
    // height: 50,
  },
  touchSelect: {
    marginEnd: 12,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: SIZES.BORDER_RADIUS_20,
    backgroundColor: COLORS.SELECTED_AREA,
  },
  textSelect: {...FONTS.regular, fontSize: 12},
  errorText: {
    color: COLORS.STATE_ERROR,
    fontSize: 12,
    ...FONTS.regular,
  },
});

const RangeInputSelect = props => {
  const {
    maxLength,
    titleStyle,
    options,
    defaultValue,
    initRankValue = [null, null],
    arrayRange,
    title,
    onValueChange,
    placeHolder = ['Nhỏ nhất', 'Lớn nhất'],
    isRequired = false,
    error = null,
  } = props;
  const {value, onBlur, setRangeValue, onChangeFromValue, onChangeToValue} =
    useSetRangeValue(defaultValue);

  useEffect(() => {
    if (_.isEqual(initRankValue, defaultValue)) {
      setRangeValue(defaultValue);
    }
  }, [defaultValue[0], defaultValue[1]]);

  useEffect(() => {
    onValueChange(value);
  }, [value[0], value[1]]);

  return (
    <View style={{...METRICS.marginTop}}>
      <RequiredLabel
        title={title}
        titleStyle={[{...FONTS.bold, color: COLORS.TEXT_DARK_10}, titleStyle]}
        isRequired={isRequired}
      />
      <View style={styles.containerInput}>
        <InputFormatType
          options={options}
          value={value[0]}
          placeholder={placeHolder[0]}
          maxLength={maxLength}
          onChangeText={onChangeFromValue}
          style={styles.inputKeyword}
        />
        <Text style={styles.marginText}>đến</Text>
        <InputFormatType
          options={options}
          value={value[1]}
          onBlur={onBlur}
          placeholder={placeHolder[1]}
          maxLength={maxLength}
          onChangeText={onChangeToValue}
          style={styles.inputKeyword}
        />
      </View>
      <View style={styles.viewRangeSelect}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={styles.containerSelect}>
          {arrayRange.map((item, index) => (
            <TouchableOpacity
              onPress={() => setRangeValue(item.value)}
              key={index}
              style={styles.touchSelect}>
              <Text style={styles.textSelect}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {error ? <Text style={styles.errorText}>{translate(error)}</Text> : null}
      </View>
    </View>
  );
};

RangeInputSelect.defaultProps = {
  defaultValue: [0, 1000],
  onValueChange: () => {},
  title: 'Khoảng giá',
  arrayRange: [
    {
      name: '< 500 triệu',
      value: [0, 0.5 * CONSTANTS.BILLION],
    },
    {
      name: '500 triệu - 1 tỷ',
      value: [0.5 * CONSTANTS.BILLION, CONSTANTS.BILLION],
    },
    {
      name: '1-3 tỷ',
      value: [CONSTANTS.BILLION, 3 * CONSTANTS.BILLION],
    },
    {
      name: '3-5 tỷ',
      value: [3 * CONSTANTS.BILLION, 5 * CONSTANTS.BILLION],
    },
    {
      name: '5-7 tỷ',
      value: [5 * CONSTANTS.BILLION, 7 * CONSTANTS.BILLION],
    },
    {
      name: '7-10 tỷ',
      value: [7 * CONSTANTS.BILLION, 10 * CONSTANTS.BILLION],
    },
    {
      name: '> 10 tỷ',
      value: [10 * CONSTANTS.BILLION, null],
    },
  ],
};

export {RangeInputSelect};
