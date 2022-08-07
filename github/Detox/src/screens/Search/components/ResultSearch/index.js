import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Select2 from 'react-native-select-two';

import {FONT_REGULAR} from '../../../../assets/fonts';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {normal, small} from '../../../../assets/theme/metric';
import {testProps} from '../../../../utils/testProps';
import {ids} from '../../../ids';

export const styles = StyleSheet.create({
  containerResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: normal,
    marginBottom: normal,
  },
  filterKeyword: {
    ...FONTS.bold,
    fontSize: 16,
    marginBottom: 4,
  },
  resultText: {
    ...FONTS.regular,
    fontSize: 14,
  },
  resultValue: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.PRIMARY_A100,
  },
  rightComponent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    height: 35,
    borderColor: COLORS.NEUTRAL_WHITE,
    width: 48,
    borderRadius: small,
    minHeight: 48,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  iconSort: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    position: 'absolute',
  },
});

export const defaultProps = {
  orderBys: [],
  onSelectOrderBy: () => {},
  filterKeyword: 'abc',
  resultValue: 10,
  isShowSort: true,
  containerStyle: {},
};

export type Props = typeof defaultProps;

export const ResultSearch = (props: Props) => {
  const {orderBys, onSelectOrderBy, filterKeyword, resultValue, isShowSort, containerStyle} = props;
  const selectRef = React.useRef(null);
  const onPress = () => {
    selectRef?.current?.showModal();
  };
  return (
    <View style={[styles.containerResult, containerStyle]}>
      <View style={HELPERS.fillCol}>
        {!!filterKeyword && <Text style={styles.filterKeyword}>{filterKeyword}</Text>}
        <Text style={styles.resultText}>
          {translate('search.resultCountPrefix')}
          <Text style={styles.resultValue}>{` ${resultValue} `}</Text>
          {`${translate('search.resultCountSuffix')}`}
        </Text>
      </View>
      {isShowSort && (
        <View style={styles.rightComponent}>
          <Select2
            ref={selectRef}
            style={styles.dropdown}
            isSelectSingle={true}
            defaultFontName={FONT_REGULAR}
            colorTheme={COLORS.PRIMARY_A100}
            data={orderBys}
            showLabel={false}
            onSelect={onSelectOrderBy}
            showSearchBox={false}
            popupTitle={translate(STRINGS.SORT)}
            title={translate(STRINGS.SORT)}
            isRequiredAtLeastOne={true}
            cancelButtonText={translate(STRINGS.CANCEL)}
            selectButtonText={translate(STRINGS.SELECT)}
            searchPlaceHolderText={translate(STRINGS.ENTER_SEARCH_KEY)}
          />
          <TouchableOpacity
            activeOpacity={1}
            {...testProps(ids.search.sortButton)}
            style={styles.iconSort}
            onPress={onPress}>
            <Image source={IMAGES.IC_SORT} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

ResultSearch.defaultProps = defaultProps;
