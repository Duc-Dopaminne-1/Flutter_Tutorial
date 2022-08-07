import isEmpty from 'lodash/isEmpty';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import DropdownCities from '../../../components/DropdownCities';
import DropdownDistricts from '../../../components/DropdownDistricts';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import ArrayUtils from '../../../utils/ArrayUtils';
import FooterButtons from '../NewPost/NewPostComponents/FooterButtons';
import {NewPostStyles} from '../NewPost/NewPostComponents/NewPostConstant';
import CrawlerFilterUtil from './CrawlerFilterUtil';

const styles = StyleSheet.create({
  titleText: {
    ...FONTS.bold,
    fontSize: 24,
    flex: 1,
  },
  container: {
    borderRadius: 16,
    ...METRICS.padding,
  },
  borderGrey: {
    borderColor: COLORS.GRAY_C9,
  },
});

export const commonCheckBoxStyle = {
  style: HELPERS.fill,
  textStyle: {
    ...FONTS.fontSize14,
  },
};

const mapListData = (listData, selectedItems: Array) => {
  if (ArrayUtils.hasArrayData(selectedItems)) {
    return listData?.map(e => ({...e, checked: selectedItems?.includes(e?.id)}));
  } else {
    return listData?.map(e => ({...e, checked: false}));
  }
};

const mapChoiceList = (listData, selectedName) => {
  if (isEmpty(selectedName)) {
    return listData?.map(e => ({...e, checked: false}));
  } else {
    return listData?.map(e => ({...e, checked: e?.name === selectedName}));
  }
};

const CrawlerFilterView = ({data, onConfirmed}) => {
  const {filterData, propertyTypes: propertyTypeList, acreageRangeData, priceRangeData} = data;
  const [state, setState] = useState(filterData);
  const [typeList, setTypeList] = useState(propertyTypeList);
  const [acreageRangeList, setAcreageList] = useState(
    mapChoiceList(acreageRangeData, filterData?.acreageRange),
  );
  const [priceRangeList, setPriceRangeList] = useState(
    mapChoiceList(priceRangeData, filterData?.priceRange),
  );
  const [isResetCity, setResetCity] = useState(true);

  useEffect(() => {
    if (isResetCity) {
      setResetCity(false);
    }
  }, [isResetCity]);

  useEffect(() => {
    setTypeList(mapListData(propertyTypeList, filterData.propertyTypes));
  }, [filterData.propertyTypes, propertyTypeList]);

  // useEffect(() => {
  //   setAcreageList(mapChoiceList(acreageRangeData, filterData.acreageRange));
  // }, [filterData.acreageRange, acreageRangeData]);

  // useEffect(() => {
  //   setPriceRangeList(mapChoiceList(priceRangeData, filterData.priceRange));
  // }, [filterData.priceRange, priceRangeData]);

  const onChoosePropertyType = items => {
    setState({...state, propertyTypes: items?.map(e => e.id)});
  };
  const onRemovePropertyTypes = ids => {
    setState({...state, propertyTypes: ids});
  };
  const onChangeCity = item => {
    if (item.id !== state?.cityId) {
      setState({...state, cityId: item.id, districtIds: []});
    }
  };
  const onChangeDistrict = items => {
    setState({...state, districtIds: items?.map(e => ({id: e.id}))});
  };
  const onChooseAcreage = item => {
    setState({
      ...state,
      acreageRange: item?.name,
      acreageRangeValue: item?.value,
    });
  };

  const onChoosePrice = item => {
    setState({
      ...state,
      priceRange: item?.name,
      priceRangeValue: item?.value,
    });
  };

  const onClearFilter = () => {
    const clearData = CrawlerFilterUtil.getInitialFilterData();
    setState(clearData);
    setResetCity(true);
    setTypeList(mapListData(propertyTypeList));
    setAcreageList(mapListData(acreageRangeData));
    setPriceRangeList(mapListData(priceRangeData));
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.titleText}>{translate(STRINGS.FILTER)}</Text>
        <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          style={METRICS.smallNormalMarginTop}
          inputStyle={{...commonStyles.inputBorder, ...styles.borderGrey}}
          headerStyles={commonStyles.blackText14}
          title={translate(STRINGS.BDS_PROPERTY_TYPE)}
          dropdownTitle={translate(STRINGS.ALL)}
          popupTitle={translate(STRINGS.BDS_PROPERTY_TYPE)}
          items={typeList}
          onChosen={onChoosePropertyType}
          onRemoveItem={onRemovePropertyTypes}
          isSelectSingle={false}
          isHaveAll={false}
          dropdownPlaceHolderStyle={commonStyles.blackText14}
        />
        <View>
          <DropdownCities
            isReset={isResetCity}
            colorTheme={COLORS.PRIMARY_A100}
            style={METRICS.smallNormalMarginTop}
            title={translate(STRINGS.AREA)}
            titleStyle={commonStyles.blackText14}
            selectedId={state?.cityId}
            onChangeCity={onChangeCity}
            placeholder={translate(STRINGS.PROVINCE)}
            setDefaultFirst={false}
            inputStyle={{...commonStyles.inputBorder, ...styles.borderGrey}}
          />
          <DropdownDistricts
            style={METRICS.tinyMarginTop}
            colorTheme={COLORS.PRIMARY_A100}
            selectedIds={state?.districtIds}
            onChangeDistrict={onChangeDistrict}
            cityId={state?.cityId}
            isSelectSingle={false}
            placeholder={translate(STRINGS.DISTRICT)}
            setDefaultFirst={false}
            inputStyle={{...commonStyles.inputBorder, ...styles.borderGrey}}
          />
        </View>
        <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          style={METRICS.smallNormalMarginTop}
          inputStyle={{...commonStyles.inputBorder, ...styles.borderGrey}}
          headerStyles={commonStyles.blackText14}
          title={translate(STRINGS.PRICE_RANGE)}
          dropdownTitle={translate('common.selectPriceRange')}
          popupTitle={translate(STRINGS.PRICE_RANGE)}
          items={priceRangeList}
          onChosen={onChoosePrice}
        />
        <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          style={METRICS.smallNormalMarginTop}
          inputStyle={{...commonStyles.inputBorder, ...styles.borderGrey}}
          headerStyles={commonStyles.blackText14}
          title={translate(STRINGS.ACREAGE)}
          dropdownTitle={translate(STRINGS.SELECT_MEASURE)}
          popupTitle={translate(STRINGS.ACREAGE)}
          items={acreageRangeList}
          onChosen={onChooseAcreage}
        />
      </View>
      <View
        style={[commonStyles.footerContainer, NewPostStyles.borderTopWidth, METRICS.marginBottom]}>
        <FooterButtons
          nextButtonTitle={translate(STRINGS.APPLY)}
          onPressNext={() => onConfirmed(state)}
          onPressCancel={onClearFilter}
          cancelButtonTitle={translate('common.reselect')}
          cancelTextStyle={commonStyles.blackTextBold14}
          cancelButtonStyle={NewPostStyles.backGrayNonBorder}
        />
      </View>
    </>
  );
};

export default CrawlerFilterView;
