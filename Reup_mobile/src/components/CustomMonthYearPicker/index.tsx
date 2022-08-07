import { View, StyleProp, TextStyle, ViewStyle, Picker, Image, ImageStyle, TouchableWithoutFeedback } from 'react-native';
import styles from './styles';
import React, { useState } from 'react';
import { CustomText } from '../CustomText';
import { ObjDropdown } from '../Dropdown/DropdownNative';
import moment from 'moment';
import { CustomTouchable } from '../CustomTouchable';
import translate from '@src/localize';
import { ICON_ARROW_DOWN } from '@src/constants/icons';
import { find } from 'lodash';
import Modal from 'react-native-modal';
import CustomGroupRadioButton, { RadioButtonObject } from '../CustomGroupRadioButton';

interface Props {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
  mainContainer?: StyleProp<ViewStyle>;
  container?: StyleProp<ViewStyle>;
  selectedYear: number;
  selectedMonth: number;
  textStyle?: StyleProp<TextStyle>;
  iconRightStyle?: ImageStyle;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  containerTextStyle?: StyleProp<ViewStyle>;
  icon?: string,
  onDateChange?: (month: number, year: number) => void;
  isFilterType?: boolean,
}

export enum Type {
  AllTime = 0,
  SpecificTime = 1,
}

const CustomMonthYearPicker = (props: Props) => {
  const currentYear = moment().year();
  const currentMonth = moment().month() + 1;
  const {
    title,
    titleStyle,
    textStyle,
    iconRightStyle,
    numberOfLines = 1,
    mainContainer,
    container,
    selectedYear = currentYear,
    selectedMonth = currentMonth,
    onDateChange,
    buttonContainerStyle,
    containerTextStyle,
    icon,
    isFilterType = false,
  } = props;

  const [isVisiblePicker, setVisiblePicker] = useState<boolean>(false)

  const getYears = () => {
    const startYear = 1900;
    const endYear = moment().year() + 101;
    let years: ObjDropdown[] = []
    for (let i = startYear; i <= endYear; i++) {
      years.push({
        _key: String(i),
        _value: String(i)
      })
    }

    return years;
  }

  const [years, setYears] = useState<ObjDropdown[]>(getYears());
  const months: ObjDropdown[] = [
    { _key: `1`, _value: translate('date.January') },
    { _key: `2`, _value: translate('date.February') },
    { _key: `3`, _value: translate('date.March') },
    { _key: `4`, _value: translate('date.April') },
    { _key: `5`, _value: translate('date.May') },
    { _key: `6`, _value: translate('date.June') },
    { _key: `7`, _value: translate('date.July') },
    { _key: `8`, _value: translate('date.August') },
    { _key: `9`, _value: translate('date.September') },
    { _key: `10`, _value: translate('date.October') },
    { _key: `11`, _value: translate('date.November') },
    { _key: `12`, _value: translate('date.December') },
  ]
  const [year, setYear] = useState<ObjDropdown>({ _key: String(selectedYear), _value: String(selectedYear) });
  const findMonth = find(months, { _key: `${selectedMonth}` });
  const [month, setMonth] = useState<ObjDropdown>(findMonth ?? { _key: String(selectedMonth), _value: String(selectedMonth) });
  const [selectedValueMonth, setSelectedValueMonth] = useState<string>(month._key);
  const [selectedValueYear, setSelectedValueYear] = useState<string>(year._key);

  const [isShowPicker, setShowPicker] = useState<boolean>(!isFilterType)
  const radioBtnsData: RadioButtonObject[] = [
    { key: Type.AllTime, label: translate('filter.all_time') },
    { key: Type.SpecificTime, label: translate('filter.specific_time') }
  ]

  const onChangeType = (obj: RadioButtonObject) => {
    if (obj.key == Type.AllTime) {
      setShowPicker(false)
      onDateChange && onDateChange(0, 0)
    } else {
      setShowPicker(true)
      const findMonth = find(months, { _key: `${currentMonth}` });
      findMonth && setMonth(findMonth);
      setYear({ _key: String(currentYear), _value: String(currentYear) })
      setSelectedValueMonth(findMonth ? findMonth?._key : '1')
      findMonth && onDateChange && onDateChange(currentMonth, currentYear);
    }
  }

  const onConfirmPress = () => {
    const findMonth = find(months, { _key: `${selectedValueMonth}` });
    findMonth && setMonth(findMonth);
    setYear({ _key: String(selectedValueYear), _value: String(selectedValueYear) })
    findMonth && onDateChange && onDateChange(parseInt(findMonth._key), parseInt(selectedValueYear));
    setVisiblePicker(false)
  }

  const onCancelPress = () => {
    setSelectedValueMonth(month._key);
    setSelectedValueYear(year._key);
    setVisiblePicker(false)
  }

  const renderPickerItems = (data: ObjDropdown[]) => {
    let items = data.map((item, index) => {
      return (<Picker.Item key={'r-' + index} label={item._value} value={item._key} />)
    })
    return items;
  }

  const onChangeValueMonth = (itemValue: any, itemPosition: number) => {
    setSelectedValueMonth(itemValue);
  }

  const onChangeValueYear = (itemValue: any, itemPosition: number) => {
    setSelectedValueYear(itemValue);
  }

  const renderModal = () => {
    return (
      <Modal
        key={'CustomMonthYearPicker'}
        isVisible={isVisiblePicker}
        hideModalContentWhileAnimating
        style={styles.modal}
        useNativeDriver
        customBackdrop={
          <TouchableWithoutFeedback onPress={onCancelPress}>
            <View style={styles.customBackdrop} />
          </TouchableWithoutFeedback>
        }
      >
        <View style={styles.outerContainer}>
          <View style={styles.toolBar}>
            <CustomTouchable style={styles.toolBarButton} onPress={onCancelPress}>
              <CustomText style={[styles.toolBarButtonText, styles.btnTextCancel]} text={translate('global.cancel')} />
            </CustomTouchable>

            <View style={{ flex: 1 }} />

            <CustomTouchable style={styles.toolBarButton} onPress={onConfirmPress}>
              <CustomText style={[styles.toolBarButtonText, styles.btnTextConfirm]} text={translate('global.confirm')} />
            </CustomTouchable>
          </View>

          <View style={styles.innerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedValueMonth}
              itemStyle={styles.itemStyle}
              onValueChange={onChangeValueMonth}>
              {renderPickerItems(months)}
            </Picker>
            <Picker
              style={styles.picker}
              selectedValue={selectedValueYear}
              itemStyle={styles.itemStyle}
              onValueChange={onChangeValueYear}>
              {renderPickerItems(years)}
            </Picker>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <View style={[styles.mainContainer, mainContainer]}>
      {title ? <CustomText numberOfLines={numberOfLines} style={[styles.title, titleStyle]} text={title} /> : null}
      {isFilterType
        ? <CustomGroupRadioButton
          styleContainerRadioBtn={styles.containerGroupRadioButton}
          radioBtnsData={radioBtnsData}
          onDataChange={onChangeType}
          style={styles.groupRadioButton}
        />
        : null}
      {isShowPicker
        ? <CustomTouchable style={[styles.containers, container]} onPress={() => setVisiblePicker(true)}>
          <View style={[styles.buttonContainer, buttonContainerStyle]}>
            <CustomText
              style={[styles.modalDropdownText, textStyle]}
              numberOfLines={1}
              text={`${month._value}, ${year._value}`}
              styleContainer={containerTextStyle}
            />
            <Image resizeMode={'contain'} style={[styles.iconRight, iconRightStyle]} source={icon ? icon : ICON_ARROW_DOWN} />
          </View>
          {renderModal()}
        </CustomTouchable>
        : null}
    </View>
  );
};

export default CustomMonthYearPicker;
