import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {APP_CURRENCY, CommissionCurrencyUnit, KEY_BOARD_TYPE} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import PriceSuggestionList from '../../../../components/PriceSuggestionList';
import MeasureUtils from '../../../../utils/MeasureUtils';
import NumberUtils from '../../../../utils/NumberUtils';
import {InputWithUnit} from '../../DetailPropertyPost/BottomInfo';
import PropertyPostUtils from '../../PropertyPostUtils';

const styles = StyleSheet.create({
  commission: {
    ...METRICS.smallMarginTop,
    paddingVertical: 0,
  },
  input: (focused, colorTheme) => ({
    ...commonStyles.inputBorderWithIcon,
    fontSize: SIZES.FONT_16,
    ...(focused && {borderColor: colorTheme}),
  }),
});

const commissionTypes = [
  {
    checked: false,
    id: CommissionCurrencyUnit.PERCENTAGE,
    name: '%',
    unitOfMeasureName: '%',
  },
  {
    checked: false,
    id: CommissionCurrencyUnit.VND,
    name: APP_CURRENCY,
    unitOfMeasureName: APP_CURRENCY,
  },
];

const CommissionComponent = ({
  style,
  title,
  titleDescription,
  value,
  placeholder = translate('contactTrading.complete.enterCommission'),
  error,
  onChangeCommission,
  onSelectType,
  defaultValue = CommissionCurrencyUnit.PERCENTAGE,
  colorTheme = COLORS.PRIMARY_A100,
  hint = '',
}) => {
  const isPercent = value.id
    ? value.id === CommissionCurrencyUnit.PERCENTAGE
    : defaultValue === CommissionCurrencyUnit.PERCENTAGE;
  const [valueInput, setValueInput] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);
  const [focused, setFocused] = useState(false);
  const [listPrices, setListPrices] = useState([]);
  const [priceSelected, setPriceSelected] = useState(-1);

  const commissionTypeList = useMemo(
    () =>
      commissionTypes.map(e => {
        return {
          id: e.id,
          unitOfMeasureName: e.unitOfMeasureName,
          name: e.name,
          checked: e.id === (value?.id ?? defaultValue),
        };
      }),
    [value.id, defaultValue],
  );

  const onChangeText = text => {
    if (!isPercent) {
      setShowSuggest(true);
      const unformattedSuggestedValue = NumberUtils.parseIntValue(NumberUtils.removeAllComma(text));
      if (MeasureUtils.isValidPriceValue(unformattedSuggestedValue)) {
        if (unformattedSuggestedValue !== 0) {
          setValueInput(NumberUtils.formatNumberToCurrencyNumber(unformattedSuggestedValue, 0));
        } else {
          setValueInput('');
        }
        onChangeCommission({id: CommissionCurrencyUnit.VND, value: unformattedSuggestedValue});
      }
    } else {
      setShowSuggest(false);
      if (!isNaN(text) && text > 100) {
        text = '100';
      }
      const formatText = text.replace(',', '.');
      if (PropertyPostUtils.isValidFloatNumberForPost(formatText)) {
        setValueInput(formatText);
        onChangeCommission({id: CommissionCurrencyUnit.PERCENTAGE, value: formatText});
      }
    }
  };

  useEffect(() => {
    const privateValue = value?.value ?? '';

    if (!isPercent) {
      const priceData = MeasureUtils.generateSuggestionPrices(privateValue);
      setListPrices(priceData);
      const formatPrice = NumberUtils.formatNumberToCurrencyNumber(privateValue ?? 0, 0);
      setValueInput(formatPrice);
    } else {
      setValueInput(privateValue);
    }
  }, [value.value, isPercent]);

  const onSelectItem = item => {
    if (!item) {
      return;
    }

    if (priceSelected && priceSelected !== item.value) {
      setValueInput(item.name);
      setPriceSelected(item.value);
      onChangeCommission({id: CommissionCurrencyUnit.VND, value: item.value});
    }
    setShowSuggest(false);
  };

  const onFocus = () => {
    setShowSuggest(true);
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
    if (!isPercent) {
      const text = NumberUtils.formatNumberToCurrencyNumber(valueInput, 0);
      setValueInput(text);
      setTimeout(() => {
        // auto hide the suggestion list after 1500 ms
        setShowSuggest(false);
      }, 1500);
    }
  };

  return (
    <View style={style}>
      <InputWithUnit
        colorTheme={colorTheme}
        placeholder={placeholder}
        placeholderTextColor={COLORS.TEXT_DARK_40}
        style={styles.commission}
        inputStyle={styles.input(focused, colorTheme)}
        titleStyle={commonStyles.blackTextBold16}
        selectBoxStyle={styles.input(focused, colorTheme)}
        value={`${valueInput}`}
        keyboardType={isPercent ? KEY_BOARD_TYPE.FLOAT_NUMBER : KEY_BOARD_TYPE.INT_NUMBER}
        returnKeyType="done"
        isDropdown={true}
        editable={true}
        items={commissionTypeList}
        onSelect={onSelectType}
        title={title}
        description={titleDescription}
        error={error}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        hint={hint}
        dropdownPlaceholderStyle={commonStyles.blackText16}
      />

      {!isPercent && showSuggest && listPrices?.length > 0 && (
        <PriceSuggestionList onSelect={onSelectItem} data={listPrices} />
      )}
    </View>
  );
};

export default CommissionComponent;
