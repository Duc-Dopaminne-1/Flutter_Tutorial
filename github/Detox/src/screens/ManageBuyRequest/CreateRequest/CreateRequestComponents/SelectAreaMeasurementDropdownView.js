import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';

import {METRIC_UNIT} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {commonStyles} from '../../../../assets/theme/styles';
import InputSection from '../../../../components/InputSection';
import NumberUtils from '../../../../utils/NumberUtils';
import {DROPDOWN_AREA_MEASUREMENT_MODEL} from '../../model/DropdownAreaMeasurementModel';
import DropdownList from './DropdownListView';
import {styles} from './styles';

const inputs = {
  FROM_AREA: 0,
  TO_AREA: 1,
};

const mapAreaOptions = (data, selectedId) => {
  return data
    ? data.map(e => {
        return {
          id: e.id,
          name: e.name,
          checked: e.id === selectedId,
          fromValue: e.fromValue,
          toValue: e.toValue,
        };
      })
    : [];
};

const SelectAreaMeasurementDropdownView = ({
  onSelected = () => {},
  errors,
  chosenItemId = null,
  onChangeTextFromArea = () => {},
  onChangeTextToArea = () => {},
}) => {
  const [areaOptions, setAreaOptions] = useState(DROPDOWN_AREA_MEASUREMENT_MODEL());
  const [isCustomValue, setIsCustomValue] = useState(false);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  useEffect(() => {
    if (chosenItemId) {
      setAreaOptions(mapAreaOptions(DROPDOWN_AREA_MEASUREMENT_MODEL(), chosenItemId));
      if (chosenItemId === areaOptions[areaOptions.length - 1].id) {
        setIsCustomValue(true);
      } else {
        setIsCustomValue(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenItemId]);

  const onChosenOption = item => {
    if (item) {
      if (item.name !== areaOptions[areaOptions.length - 1].name) {
        setToValue('');
        setFromValue('');
        setIsCustomValue(false);
        onSelected(item);
      } else {
        setIsCustomValue(true);
        onSelected({
          id: areaOptions[areaOptions.length - 1]?.id,
          fromValue: fromValue,
          toValue: toValue,
        });
      }
    }
  };

  const onChangeText = (text, input) => {
    switch (input) {
      case inputs.FROM_AREA:
        setFromValue(text);
        onChangeTextFromArea(text);
        break;
      case inputs.TO_AREA:
        setToValue(text);
        onChangeTextToArea(text);
        break;
    }
  };

  const renderInputsCustomValue = () => {
    return (
      <View style={styles.inputCustomContainer}>
        <View style={styles.inputFromContainer}>
          <InputSection
            inputContainerStyle={commonStyles.input}
            inputStyle={styles.input}
            keyboardType={'number-pad'}
            value={fromValue}
            error={errors?.fromArea}
            editable
            onChangeText={text => {
              onChangeText(text, inputs.FROM_AREA);
            }}
            customRightComponent={
              <View style={styles.inputCustomRightComponentContainer}>
                <Text style={styles.txtInput}>{METRIC_UNIT.SQUARE_METER}</Text>
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
            value={toValue}
            keyboardType={'number-pad'}
            error={errors?.toArea}
            editable
            onChangeText={text => {
              onChangeText(text, inputs.TO_AREA);
            }}
            customRightComponent={
              <View style={styles.inputCustomRightComponentContainer}>
                <Text style={styles.txtInput}>{METRIC_UNIT.SQUARE_METER}</Text>
              </View>
            }
            isInputIntPrice
            formatValue={e => NumberUtils.formatNumberToCurrencyNumber(e, 0)}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <DropdownList
        data={areaOptions}
        viewTitle={translate(STRINGS.AREA_MEASUREMENT)}
        modalTitle={translate(STRINGS.SELECT_MEASURE)}
        placeHolder={translate(STRINGS.SELECT_MEASURE)}
        onSelected={onChosenOption}
      />
      {isCustomValue ? renderInputsCustomValue() : <></>}
    </>
  );
};

export default SelectAreaMeasurementDropdownView;
