import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {translate} from '../assets/localize';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import RequiredLabel from './RequiredLabel';

const widthRadioButton = 24;
const heightRadioButton = widthRadioButton;
const borderRadiusRadioButton = widthRadioButton / 2;

export const ITEM_TYPE = {
  DEFAULT: 0, // 1 selection 1/2 component width
  FULL: 1, // 1 selection 1/1 screen width
  ROW_SPACE: 3, // all selections on the same row
  ROW_SPACE_40: 2, // all selections on the same row if possible
};

const styles = StyleSheet.create({
  radioButton: {
    width: widthRadioButton,
    height: heightRadioButton,
    borderRadius: borderRadiusRadioButton,
    padding: 1,
    borderWidth: SIZES.BORDER_WIDTH_2,
    borderColor: COLORS.GREY_E4,
    ...HELPERS.center,
  },
  errorText: {
    color: COLORS.STATE_ERROR,
    fontSize: 12,
    ...FONTS.regular,
  },
  checkedRadioButton: {
    borderColor: COLORS.PRIMARY_A100,
  },
  button: {
    ...HELPERS.fillRow,
    alignItems: 'center',
  },
  buttonNonWidth: {
    height: 24,
    ...HELPERS.row,
    alignItems: 'center',
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...commonStyles.txtFontSize14,
    ...FONTS.regular,
    ...HELPERS.fill,
  },
  itemSpace40: {
    paddingStart: 40,
  },
  disabledRadioButton: {
    backgroundColor: COLORS.DISABLE_BUTTON,
  },
  disabledRadioButtonText: {
    opacity: 0.3,
  },
  radioInnerCircle: {
    backgroundColor: COLORS.PRIMARY_A100,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  txtTitle: {
    marginBottom: 8,
  },
});

const RadioSelectionsView = (
  {
    data = [],
    chosenItemId,
    onChosen = () => {},
    type = ITEM_TYPE.DEFAULT,
    headerTitle,
    headerStyle,
    isRequired = false,
    customStyle,
    initValue = false,
    error,
    checkedStyle,
    uncheckedStyle,
    titleStyle,
    disabled,
    allowUpdateData = false,
  },
  ref,
) => {
  const [selectionData, setSelectionData] = useState(data);

  useEffect(() => {
    allowUpdateData && setSelectionData(data);
  }, [allowUpdateData, data]);

  const resetData = () => {
    setSelectionData(data);
  };

  useImperativeHandle(ref, () => ({
    resetData,
  }));

  const onPressButton = choiceIndex => {
    const updatedSelections = selectionData.map((e, index) => {
      const item = {...e};
      if (choiceIndex === index) {
        item.isChecked = true;
        item.checked = true;
      } else {
        item.isChecked = false;
        item.checked = false;
      }
      return item;
    });
    setSelectionData(updatedSelections);
    onChosen(selectionData[choiceIndex]);
  };

  useEffect(() => {
    if (initValue) {
      const index = data.findIndex(item => item.value === initValue);
      if (index >= 0) {
        onPressButton(index);
      }
    }
    if (chosenItemId) {
      const index = data.findIndex(item => item?.id === chosenItemId);
      if (index >= 0) {
        onPressButton(index);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initValue, chosenItemId]);

  const renderChoices = choices => {
    const selectionButtons = choices.map((e, index) => {
      const choiceTitle = e.title ?? e.name ?? e.description ?? '';
      const isChosen = e.isChecked ?? e.checked ?? false;
      const radioStyle = [
        styles.radioButton,
        (e?.disabled || disabled) && styles.disabledRadioButton,
        uncheckedStyle,
        isChosen ? {...styles.checkedRadioButton, ...checkedStyle} : {},
      ];
      return (
        <TouchableOpacity
          disabled={e?.disabled}
          key={index}
          style={type === ITEM_TYPE.DEFAULT ? styles.button : styles.buttonNonWidth}
          onPress={() => {
            onPressButton(index);
          }}
          activeOpacity={1}>
          <View style={radioStyle}>{isChosen && <View style={styles.radioInnerCircle} />}</View>
          <View style={commonStyles.separatorColumn12} />
          <Text
            style={[
              styles.title,
              titleStyle,
              (e?.disabled || disabled) && styles.disabledRadioButtonText,
            ]}>
            {choiceTitle}
          </Text>
        </TouchableOpacity>
      );
    });

    if (type === ITEM_TYPE.DEFAULT) {
      const selectionView = selectionButtons.map((e, index) => {
        const isLastRow = index % 2 === 0 && index === selectionButtons.length - 1;
        const isLastButton = index === selectionButtons.length - 1;
        if (index > 0 && index % 2 === 1) {
          return (
            <View
              key={index}
              style={[styles.rowContainer, isLastButton ? {} : METRICS.normalPlusMarginBottom]}>
              {selectionButtons[index - 1]}
              {e}
            </View>
          );
        } else if (isLastRow) {
          return (
            <View key={index} style={styles.rowContainer}>
              {e}
            </View>
          );
        }
      });
      return selectionView;
    } else if (type === ITEM_TYPE.ROW_SPACE_40) {
      const selectionView = selectionButtons.map((e, index) => {
        return (
          <View key={index} style={[HELPERS.rowCross, index === 0 ? {} : styles.itemSpace40]}>
            {e}
          </View>
        );
      });

      return <View style={[HELPERS.fillRowCross]}>{selectionView}</View>;
    } else if (type === ITEM_TYPE.ROW_SPACE) {
      const selectionView = selectionButtons.map((e, index) => {
        return (
          <View key={index} style={[HELPERS.rowCross]}>
            {e}
          </View>
        );
      });

      return (
        <View style={[HELPERS.fillRowCross, HELPERS.rowSpaceBetweenCenter]}>{selectionView}</View>
      );
    } else {
      const selectionView = selectionButtons.map((e, index) => {
        return (
          <View key={index} style={METRICS.smallVerticalMargin}>
            {e}
          </View>
        );
      });
      return selectionView;
    }
  };
  return (
    <View style={customStyle} pointerEvents={disabled ? 'none' : 'auto'}>
      {!!headerTitle && (
        <RequiredLabel
          title={headerTitle}
          titleStyle={[styles.txtTitle, headerStyle]}
          isRequired={isRequired}
        />
      )}
      {renderChoices(selectionData)}
      {error ? <Text style={styles.errorText}>{translate(error)}</Text> : null}
    </View>
  );
};

export default forwardRef(RadioSelectionsView);
