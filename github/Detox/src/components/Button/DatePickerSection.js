import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {CONSTANTS} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal} from '../../assets/theme/metric';
import {getDatePickerDateString} from '../../utils/TimerCommon';
import RequiredLabel from '../RequiredLabel';

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'android' ? 12 : 8,
    justifyContent: 'center',
    borderRadius: SIZES.BORDER_RADIUS_8,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_BORDER,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    minHeight: CONSTANTS.INPUT_HEIGHT,
  },
  buttonText: {
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_40,
  },
  headerStyle: {
    ...FONTS.bold,
    color: COLORS.TEXT_DARK_10,
  },
  valueText: {
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_10,
  },
  errorText: {
    color: COLORS.STATE_ERROR,
    fontSize: 12,
    ...FONTS.regular,
  },
  disabledButtonContainer: {
    backgroundColor: COLORS.GREY_ED,
  },
  disabledText: {
    color: COLORS.GRAY_A3,
  },
  iconCalendar: {
    width: 18,
    height: 19,
    position: 'absolute',
    end: normal,
  },
});

const MINIMUM_DATE = new Date(Date.UTC(1900, 0, 1));

const DatePickerSection = ({
  headerTitle,
  headerStyle = {},
  value,
  onChosen,
  placeholder,
  isRequired,
  error,
  isShowLabel = true,
  isShowIcon = false,
  maximumDate = new Date(),
  minimumDate = MINIMUM_DATE,
  customRightIcon = null,
  pickerMode = 'date',
  dateOnView = '',
  display = 'spinner',
  disabled = false,
  customStyle = {},
  customButtonStyle,
  timeZoneOffsetInMinutes = 0,
}) => {
  const language = 'vi_VN';
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    hideDatePicker();
    onChosen(date);
  };
  const showDateOnView = () => {
    if (dateOnView) {
      return (
        <Text style={[styles.valueText, disabled ? styles.disabledText : {}]}>{dateOnView}</Text>
      );
    } else if (value) {
      return (
        <Text style={[styles.valueText, disabled ? styles.disabledText : {}]}>
          {getDatePickerDateString(value)}
        </Text>
      );
    } else {
      return (
        <Text style={[styles.buttonText, disabled ? styles.disabledText : {}]}>{placeholder}</Text>
      );
    }
  };
  return (
    <View style={customStyle}>
      {isShowLabel && (
        <RequiredLabel
          title={headerTitle}
          titleStyle={[styles.headerStyle, headerStyle]}
          isRequired={isRequired}
        />
      )}
      <TouchableOpacity disabled={disabled} onPress={showDatePicker}>
        <View
          style={[
            styles.buttonContainer,
            disabled ? styles.disabledButtonContainer : {},
            customButtonStyle,
          ]}>
          {showDateOnView()}
          {isShowIcon &&
            (customRightIcon ? (
              customRightIcon
            ) : (
              <Image source={IMAGES.IC_CALENDAR} style={styles.iconCalendar} />
            ))}
        </View>
      </TouchableOpacity>
      <DateTimePickerModal
        locale={language}
        isVisible={isDatePickerVisible}
        mode={pickerMode}
        display={display}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        headerTextIOS={translate(STRINGS.PICK_A_DATE)}
        confirmTextIOS={translate(STRINGS.OK)}
        cancelTextIOS={translate(STRINGS.CANCEL)}
        timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
        date={value ? new Date(value) : new Date()}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
      {error ? <Text style={styles.errorText}>{translate(error)}</Text> : null}
    </View>
  );
};

DatePickerSection.propTypes = {
  headerTitle: PropTypes.string,
  value: PropTypes.any,
  onChosen: PropTypes.func,
  placeHolder: PropTypes.string,
  isRequired: PropTypes.bool,
};

DatePickerSection.defaultProps = {
  headerTitle: '',
  value: '',
  onChosen: () => {},
  placeholder: '',
  isRequired: false,
};

export default DatePickerSection;
