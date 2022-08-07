import { View, TextStyle, ViewStyle, Text, TextInputProps as RNTextInputProps, Image, StyleProp } from 'react-native';
import React, { Component } from 'react';
import styles from './styles';
import DatePicker from 'react-native-datepicker';
import translate from '@src/localize';
import ICON_CALENDAR from '@src/res/icons/icon-calendar.png';
import { useEffect } from 'react';
import { CustomText } from '../CustomText';
import { Config } from '@src/configs/appConfig';

interface Props {
  styleContainers?: StyleProp<ViewStyle>;
  container?: StyleProp<ViewStyle>;
  mainContainer?: StyleProp<ViewStyle>;
  dateTextStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  date: string;
  // inputRef: any;
  placeholder?: string;
  onFocus?: () => void;
  onCancel?: () => void;
  onDateChange?: (date: any) => void;
  description?: string;
  minDate?: string | Date | undefined;
  mode?: "date" | "time" | "datetime" | undefined
  format?: string
}

export const getToday = () => {
  const date = new Date().getDate(); //Current Date
  const month = new Date().getMonth() + 1; //Current Month
  const year = new Date().getFullYear(); //Current Year
  return date + '/' + month + '/' + year;
};

class CustomDateTimePicker extends React.Component<Props, {}> {
  datePickerRef: any;

  focus = () => {
    this.datePickerRef.onPressDate();
  };

  render() {
    const { container, description, mainContainer,
      titleStyle, onFocus, onCancel, styleContainers, placeholder, date, dateTextStyle, onDateChange, minDate,
      mode = 'date', format = Config.Manager.formatDate } = this.props;
    return (
      <View style={[styles.mainContainer, mainContainer]}>
        {description ? <CustomText style={[styles.description, titleStyle]} text={description} /> : null}
        <View style={[styles.containers, container]}>
          <DatePicker
            ref={ref => (this.datePickerRef = ref)}
            onCloseModal={onCancel}
            onOpenModal={onFocus}
            minDate={minDate}
            style={[styles.containerDatePicker, styleContainers]}
            mode={mode}
            placeholder={placeholder}
            format={format}
            date={date}
            confirmBtnText={translate('global.confirm')}
            cancelBtnText={translate('global.cancel')}
            iconSource={ICON_CALENDAR}
            customStyles={{
              dateInput: styles.dateInput,
              dateIcon: styles.dateIconStyle,
              dateText: [styles.dateTextStyle, dateTextStyle],
              placeholderText: styles.dateTextStyle,
              btnTextConfirm: styles.btnTextConfirm,
              // btnTextCancel: styles.buttonActionText
            }}
            onDateChange={(date: any) => {
              onDateChange && onDateChange(date);
            }}
          />
        </View>
      </View>
    );
  }
}

export default React.memo(CustomDateTimePicker);
