import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';

import {APP_CURRENCY, CONTACT_TRADING_TYPE} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {commonStyles} from '../../../../assets/theme/styles';
import InputSection from '../../../../components/InputSection';
import NumberUtils from '../../../../utils/NumberUtils';
import {DROPDOWN_PRICE_RANGES_MODEL} from '../../model/DropdownPriceRangesModel';
import DropdownList from './DropdownListView';
import {styles} from './styles';

const inputs = {
  FROM_PRICE: 'FROM_PRICE',
  TO_PRICE: 'TO_PRICE',
};

const mapPriceRange = (curPriceRange, chosenId) => {
  return curPriceRange?.map(e => ({
    ...e,
    checked: e.id === chosenId,
  }));
};

const InputsCustomPrice = ({
  errors,
  fromPrice,
  toPrice,
  onChangeFromPrice = () => {},
  onChangeToPrice = () => {},
}) => {
  return (
    <View style={styles.inputCustomContainer}>
      <View style={styles.inputFromContainer}>
        <InputSection
          inputContainerStyle={commonStyles.input}
          inputStyle={styles.input}
          keyboardType={'number-pad'}
          value={fromPrice}
          error={errors?.fromPrice}
          editable
          onChangeText={onChangeFromPrice}
          customRightComponent={
            <View style={styles.inputCustomRightComponentContainer}>
              <Text style={styles.txtInput}>{APP_CURRENCY}</Text>
            </View>
          }
          isInputIntPrice
          formatValue={e => NumberUtils.formatNumberToCurrencyNumber(e, 0)}
        />
      </View>
      <Text style={styles.inputCustomMiddleSectionText}>{translate(STRINGS.TO)}</Text>
      <View style={styles.inputFromContainer}>
        <InputSection
          inputContainerStyle={commonStyles.input}
          inputStyle={styles.input}
          value={toPrice}
          error={errors?.toPrice}
          keyboardType={'number-pad'}
          editable={true}
          onChangeText={onChangeToPrice}
          customRightComponent={
            <View style={styles.inputCustomRightComponentContainer}>
              <Text style={styles.txtInput}>{APP_CURRENCY}</Text>
            </View>
          }
          isInputIntPrice
          formatValue={e => NumberUtils.formatNumberToCurrencyNumber(e, 0)}
        />
      </View>
    </View>
  );
};

const SelectPriceRangeDropdownView = ({
  contactType = CONTACT_TRADING_TYPE.BUY,
  onSelectedPrice = () => {},
  chosenItemId = null,
  errors,
  onChangeTextFromPrice = () => {},
  onChangeTextToPrice = () => {},
}) => {
  const [state, setState] = useState({
    priceRangeOptions: DROPDOWN_PRICE_RANGES_MODEL(contactType),
    isCustomPrice: false,
    fromPrice: '',
    toPrice: '',
  });

  const setFromAndToPrice = (fromPrice, toPrice) => {
    setState({...state, fromPrice: fromPrice ? fromPrice : '', toPrice: toPrice ? toPrice : ''});
  };

  const onChosenPriceRange = () => {
    if (chosenItemId !== null) {
      const isCustomPrice =
        chosenItemId === state.priceRangeOptions[state.priceRangeOptions.length - 1].id;
      const priceRanges = mapPriceRange(state.priceRangeOptions, chosenItemId);
      setState({...state, priceRangeOptions: priceRanges, isCustomPrice});
    }
  };
  useEffect(onChosenPriceRange, [chosenItemId]);

  const mapPriceRangeOnChosenRequestType = () => {
    setState({
      ...state,
      priceRangeOptions: DROPDOWN_PRICE_RANGES_MODEL(contactType),
      isCustomPrice: false,
      fromPrice: '',
      toPrice: '',
    });
  };
  useEffect(mapPriceRangeOnChosenRequestType, [contactType]);

  const onChosenPrice = item => {
    if (item) {
      const chosenCustomPriceRange =
        item.id === state.priceRangeOptions[state.priceRangeOptions.length - 1].id;
      if (!chosenCustomPriceRange) {
        setFromAndToPrice(null, null);
        onSelectedPrice(item);
      } else {
        const fromValue = NumberUtils.removeAllComma(state.fromPrice);
        const toValue = NumberUtils.removeAllComma(state.toPrice);
        onSelectedPrice({
          ...item,
          fromValue: fromValue,
          toValue: toValue,
        });
      }
    }
  };

  const onChangeText = (text, input) => {
    const removedCommaString = NumberUtils.removeAllComma(text);
    switch (input) {
      case inputs.FROM_PRICE:
        setFromAndToPrice(text, state.toPrice);
        onChangeTextFromPrice(removedCommaString);
        break;
      case inputs.TO_PRICE:
        setState({...state, toPrice: text});
        onChangeTextToPrice(removedCommaString);
        break;
    }
  };

  const handleOnBlurInputs = input => {
    const fromValue = NumberUtils.removeAllComma(state.fromPrice);
    const toValue = NumberUtils.removeAllComma(state.toPrice);
    onSelectedPrice({
      id: chosenItemId,
      fromValue: fromValue,
      toValue: toValue,
    });
    switch (input) {
      case inputs.FROM_PRICE:
        const formattedFromPrice = NumberUtils.formatNumberToCurrencyNumber(state.fromPrice, 0);
        setFromAndToPrice(formattedFromPrice, state.toPrice);
        break;
      case inputs.TO_PRICE:
        const formattedToPrice = NumberUtils.formatNumberToCurrencyNumber(state.toPrice, 0);
        setFromAndToPrice(state.fromPrice, formattedToPrice);
        break;
    }
  };

  const handleOnFocusInputs = input => {
    const formattedFromPrice = NumberUtils.removeAllComma(state.fromPrice);
    const formattedToPrice = NumberUtils.removeAllComma(state.toPrice);
    switch (input) {
      case inputs.FROM_PRICE:
        setFromAndToPrice(formattedFromPrice, state.toPrice);
        break;
      case inputs.TO_PRICE:
        setFromAndToPrice(state.fromPrice, formattedToPrice);
        break;
    }
  };

  return (
    <>
      <DropdownList
        data={state.priceRangeOptions}
        viewTitle={translate(STRINGS.PRICE_RANGE_OF_INTEREST)}
        modalTitle={translate(STRINGS.SELECT_PRICE_RANGE)}
        placeHolder={translate(STRINGS.SELECT_PRICE_RANGE)}
        onSelected={onChosenPrice}
      />
      {state.isCustomPrice && (
        <InputsCustomPrice
          errors={errors}
          fromPrice={state.fromPrice}
          toPrice={state.toPrice}
          onChangeFromPrice={text => {
            onChangeText(text, inputs.FROM_PRICE);
          }}
          onChangeToPrice={text => {
            onChangeText(text, inputs.TO_PRICE);
          }}
          onBlurFromPrice={() => handleOnBlurInputs(inputs.FROM_PRICE)}
          onFocusFromPrice={() => handleOnFocusInputs(inputs.FROM_PRICE)}
          onBlurToPrice={() => handleOnBlurInputs(inputs.TO_PRICE)}
          onFocusToPrice={() => handleOnFocusInputs(inputs.TO_PRICE)}
        />
      )}
    </>
  );
};

export default SelectPriceRangeDropdownView;
