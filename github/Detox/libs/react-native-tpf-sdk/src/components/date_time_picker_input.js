import moment from 'moment';
import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import themeContext from '../constants/theme/themeContext';
import { Divider } from '../components';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import { CUSTOM_COLOR } from '../constants/colors';
import { SPACING } from '../constants/size';
import I18n from '../i18n';
import AppText from './app_text';
const DateTimePickerInput = props => {
  const {
    style,
    title,
    value,
    placeholder,
    isFocus,
    borderBottomColor,
    type,
    iconComponent,
    name,
    onOpen,
    onCancel,
    pickerVisible,
    onChangeText,
    translateTitle = false,
    translatePlaceholder = false
  } = props;
  const language = I18n.locale;
  const defaultValue = useMemo(() => {
    if (!value) {
      if (type === 'time') {
        return moment(new Date()).format('HH:mm');
      } else {
        return moment(new Date()).format('DD/MM/YYYY');
      }
    }
    return value;
  }, [type, value]);

  const theme = useContext(themeContext);

  const _onOpen = useCallback(() => {
    return typeof onOpen === 'function' && onOpen(name);
  }, [onOpen, name]);
  const _onCancel = useCallback(() => {
    return typeof onCancel === 'function' && onCancel(name);
  }, [onCancel, name]);
  // const labelStyle = useMemo(() => {
  //   return [value ? styles.inputContainer : styles.placeholder];
  // }, [value]);
  return (
    <>
      <View style={[styles.container, style]}>
        <AppText translate={translateTitle} style={styles.title}>
          {title}
        </AppText>
        <TouchableOpacity onPress={_onOpen}>
          <View style={styles.rowContainer}>
            <AppText style={styles.inputContainer}>{defaultValue}</AppText>
            {iconComponent}
          </View>

          <Divider
            style={[
              styles.divider,
              isFocus
                ? { backgroundColor: theme?.app?.primaryColor1 }
                : {
                    backgroundColor: borderBottomColor
                      ? borderBottomColor
                      : theme?.app?.primaryColor1
                  }
            ]}
          />
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        date={
          value
            ? type === 'time'
              ? moment(value, 'HH:mm').toDate()
              : moment(value, 'DD/MM/YYYY').toDate()
            : new Date()
        }
        isVisible={pickerVisible}
        locale={language === 'vi' ? 'vi-VN' : 'en-ES'}
        is24Hour
        mode={type ? type : 'date'}
        onConfirm={onChangeText}
        onCancel={_onCancel}
      />
    </>
  );
};
export default React.memo(DateTimePickerInput);

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.Medium
  },
  title: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    paddingBottom: SPACING.Normal
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  inputContainer: {
    height: LINE_HEIGHT.BodyText,
    // lineHeight: LINE_HEIGHT.BodyText,
    fontSize: FONT_SIZE.BodyText,
    paddingLeft: 0,
    paddingVertical: 0,
    marginVertical: 0,
    textAlignVertical: 'center'
  },
  divider: {
    marginTop: SPACING.Normal
  },
  placeholder: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: CUSTOM_COLOR.RegentGray
  }
});
