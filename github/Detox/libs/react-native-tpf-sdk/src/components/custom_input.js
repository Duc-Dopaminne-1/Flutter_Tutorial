import { parseSelectOptionsToRadioData } from '../helpers/entityData';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useContext,
  useMemo
} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { ICCalendarBlank02, ICTextArea } from '../assets/icons';
import { CustomFilePicker, Divider, SubHead } from '../components';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../constants/colors';
import { SPACING } from '../constants/size';
import { ATTRIBUTE_TYPE, ATTRIBUTE_VALIDATION, DATE_FORMAT } from '../global/entity_type';
import { formatNumberNoZero, formatString } from '../helpers/formatNumber';
import {
  validateEmail,
  validateName,
  validateNumberic,
  validatePhone,
  validateBoolean,
  validateDate
} from '../helpers/validate';
import { translate as Translate } from '../i18n';
import { scale } from '../utils/responsive';
import AppText from './app_text';
import DropDownList from './dropdown_list';
import LocationForm from './location_form';
import RadioBoxes from './radio_boxes';
import themeContext from '../constants/theme/themeContext';
import SwitchToggle from 'react-native-switch-toggle';

const selectText = createSelector(
  state => state.setting.lang,
  (_, children) => children,
  (_, children) => {
    return Translate(children);
  }
);

const data = [
  {
    value: '0',
    title: 'common.no'
  },
  {
    value: '1',
    title: 'common.yes'
  }
];

const CustomInput = (
  {
    placeholder,
    value,
    onChangeText,
    title,
    style,
    type = 'text',
    autoCapitalize = 'none',
    multiline,
    borderBottomColor,
    keyboardType,
    item,
    onEndEditing,
    location,
    selectOptions,
    errorText = '',
    disable = false,
    onChangeMedia,
    renderDropdownItem,
    labelInput,
    hasRightButton,
    required = false,
    icDropdown,
    translate = false,
    translateTitle = false,
    translatePlaceholder = false,
    translateItem = false,
    translateValue = false,
    hasExtend = false,
    prefix = '',
    suffix = 'VNĐ',
    maxLength = 256,
    parseRadio = false,
    upperCase = false,
    minDate,
    maxDate,
    showSearch = false,
    onCopy,
    isAddedField,
    groupId,
    toggleCopy,
    formData,
    modeSelectDate,
    hideTitle = false
  },
  ref
) => {
  const theme = useContext(themeContext);
  const inputRef = useRef({
    isFocus: false,
    isValidated: false,
    hasValue: false
  });
  useImperativeHandle(ref, () => ({
    isFocus: inputRef.current.isFocus
  }));
  useEffect(() => {
    inputRef.current.hasValue = !!value;
  }, [value]);

  const [isFocus, setFocus] = useState(false);
  const isRequired = required || item?.isRequired;
  const { lang } = useSelector(state => state.setting);

  const onFocus = useCallback(() => {
    setFocus(true);
    inputRef.current.isFocus = true;
  }, []);

  const onBlur = useCallback(() => {
    setFocus(false);
    inputRef.current.isFocus = false;
    // onValidateCheck();
  }, []);

  const getErrMessageByLang = useCallback(() => {
    let _errMsg;
    if (lang === 'vi') {
      _errMsg = item?.validate?.message.Vi;
    } else if (lang === 'en') {
      _errMsg = item?.validate?.message.En;
    }
    return _errMsg;
  }, [lang, item]);

  const onValidateCheck = useCallback(
    _value => {
      let _errMsg = '';
      let checkValue = item?.value;
      if (checkValue) {
        switch (item?.validateType?.toLowerCase()) {
          case ATTRIBUTE_VALIDATION.email.toLowerCase():
            if (!validateEmail(checkValue)) {
              _errMsg = 'validation.email';
            }
            break;
          case ATTRIBUTE_VALIDATION.name.toLowerCase():
            if (!validateName(checkValue)) {
              _errMsg = 'validation.name';
            }
            break;

          case ATTRIBUTE_VALIDATION.idNumber.toLowerCase():
            if (!validateNumberic(checkValue)) {
              _errMsg = 'validation.idNumber';
            }
            if (checkValue?.length !== 9 && checkValue?.length !== 12) {
              _errMsg = 'validation.idNumber_length';
            }
            break;

          case ATTRIBUTE_VALIDATION.phone.toLowerCase():
            if (!validatePhone(checkValue)) {
              _errMsg = 'validation.phone';
            }
            break;
          default:
            _errMsg = '';
            break;
        }
        //validate input date
        if (
          modeSelectDate === 'input' &&
          [ATTRIBUTE_TYPE.date, ATTRIBUTE_TYPE.datetime, ATTRIBUTE_TYPE.time].includes(type)
        ) {
          let validateItemRelate;
          const listComponent = formData?.productForm?.listComponent;
          listComponent?.forEach(com => {
            com?.listAttribute.forEach(attribute => {
              if (attribute.attributeId === item?.validate?.attribute?.attributeId) {
                validateItemRelate = attribute;
              }
            });
          });
          const dateValue = new moment(item.value);
          if (!validateDate(checkValue)) {
            _errMsg = Translate(title) + Translate('validation.in_valid_format');
          } else if (
            validateItemRelate &&
            validateItemRelate?.value?.toString() ===
              item?.validate?.attribute?.optionId?.toString()
          ) {
            const old = moment().diff(dateValue, 'years');
            if (old < item?.validate?.minOld || old > item?.validate?.maxOld) {
              _errMsg = getErrMessageByLang();
            }
          } else if (item?.validate?.minOld && !item?.validate?.maxOld) {
            const old = moment().diff(dateValue, 'years');
            if (old < item?.validate?.minOld) {
              _errMsg = getErrMessageByLang();
            }
          } else if (!item?.validate?.minOld && item?.validate?.maxOld) {
            const old = moment().diff(dateValue, 'years');
            if (old > item?.validate?.maxOld) {
              _errMsg = getErrMessageByLang();
            }
          } else if (item?.validate?.minOld && item?.validate?.maxOld) {
            const old = moment().diff(dateValue, 'years');
            if (old < item?.validate?.minOld || old > item?.validate?.maxOld) {
              _errMsg = getErrMessageByLang();
            }
          } else if (
            typeof item?.datetimeMax === 'number' &&
            moment(checkValue).diff(moment().add(item?.datetimeMax, 'days')) > 0
          ) {
            _errMsg =
              Translate(title) +
              Translate('validation.must_less_day') +
              moment()
                .add(item?.datetimeMax + 1, 'days')
                .format(DATE_FORMAT[type]);
          } else if (
            typeof item?.datetimeMin === 'number' &&
            moment(checkValue).diff(moment().add(item?.datetimeMin, 'days')) < -86400000
          ) {
            _errMsg =
              Translate(title) +
              Translate('validation.must_start_from_day') +
              moment().add(item?.datetimeMin, 'days').format(DATE_FORMAT[type]);
          } else {
            _errMsg = '';
          }
        }

        // valdate input type === boolean
        if ([ATTRIBUTE_TYPE.boolean].includes(type)) {
          const resultValidate = validateBoolean(_value, valueRequire, condition);
          if (resultValidate) {
            _errMsg = getErrMessageByLang();
          }
        }

        // valdate input type === number | decimal | price
        if ([ATTRIBUTE_TYPE.number, ATTRIBUTE_TYPE.decimal, ATTRIBUTE_TYPE.price].includes(type)) {
          if (item?.value < item?.validate?.minNumber || item?.value > item?.validate?.maxNumber) {
            _errMsg = getErrMessageByLang();
          }
        }
      } else if (isRequired) {
        _errMsg = 'validation.required';
      }
      return _errMsg;
    },
    [item, isRequired]
  );
  const RequireCharacter = isRequired ? <Text style={styles.iconRequired}>{' *'}</Text> : null;
  const placeholderTxt = useSelector(state => selectText(state, placeholder));

  const priceRef = useRef(null);
  const onEndEditingWithValidate = useCallback(
    _value => {
      const err = onValidateCheck();
      typeof onEndEditing === 'function' && onEndEditing(err);
    },
    [onEndEditing, onValidateCheck]
  );

  useEffect(() => {
    if (value && formData) {
      formData?.productForm?.listComponent?.forEach(com => {
        if (com.groupId === groupId) {
          com.listAttribute.forEach(attr => {
            if (item.attributeId === attr.attributeId && !ATTRIBUTE_TYPE.boolean.includes(type)) {
              onEndEditingWithValidate();
            }
          });
        }
      });
      formData?.contact?.listComponent?.forEach(com => {
        if (com.groupId === groupId) {
          com.eavAttribute.forEach(eav => {
            if (item.attributeId === eav.attributeId && !ATTRIBUTE_TYPE.boolean.includes(type)) {
              onEndEditingWithValidate();
            }
          });
        }
      });
    }
  }, [value]);

  const activeCopy = useMemo(() => {
    if (toggleCopy) {
      return toggleCopy?.find(v => v.groupId === groupId);
    }
    return { groupId, isActive: false };
  }, [groupId, toggleCopy]);

  return (
    <>
      {[ATTRIBUTE_TYPE.text, ATTRIBUTE_TYPE.textarea, ATTRIBUTE_TYPE.texteditor].includes(type) ? (
        <>
          <View style={[styles.container, style]}>
            {title && !hideTitle ? (
              <View style={styles.row}>
                <AppText
                  translate={translateTitle || translate}
                  style={[
                    styles.title,
                    { color: theme?.text.primary },
                    (errorText || item?.error) && { color: TEXT_COLOR.Flamingo }
                  ]}>
                  {title}
                </AppText>
                <Text
                  style={[
                    styles.title,
                    (errorText || item?.error) && { color: TEXT_COLOR.Flamingo }
                  ]}>
                  {RequireCharacter}
                </Text>
              </View>
            ) : null}

            {hasExtend ? (
              <View style={styles.inputView}>
                <TextInput
                  blurOnSubmit={false}
                  multiline={multiline}
                  placeholder={translatePlaceholder || translate ? placeholderTxt : placeholder}
                  value={value}
                  onChangeText={text => onChangeText(upperCase ? text.toUpperCase() : text)}
                  style={[
                    styles.inputContainer,
                    styles.textAreaInput,
                    styles.inputExtend,
                    item?.style,
                    { color: theme?.text.primary, fontFamily: theme?.fonts?.REGULAR },
                    { borderColor: isFocus ? theme.app.primaryColor1 : CUSTOM_COLOR.grayBoder },
                    value?.length === maxLength ? { borderColor: CUSTOM_COLOR.Red } : {}
                  ]}
                  placeholderTextColor={theme.text.secondary}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onEndEditing={onEndEditingWithValidate}
                  autoCorrect={false}
                  autoCapitalize={autoCapitalize}
                  keyboardType={
                    keyboardType ||
                    [ATTRIBUTE_VALIDATION.phone, ATTRIBUTE_VALIDATION.idNumber].includes(
                      item?.validateType?.toLowerCase()
                    )
                      ? 'number-pad'
                      : 'default'
                  }
                  {...{ maxLength }}
                />
              </View>
            ) : (
              <TextInput
                multiline={
                  multiline || [ATTRIBUTE_TYPE.textarea, ATTRIBUTE_TYPE.texteditor].includes(type)
                }
                blurOnSubmit={false}
                placeholder={translatePlaceholder || translate ? placeholderTxt : placeholder}
                value={value}
                onChangeText={text => onChangeText(upperCase ? text.toUpperCase() : text)}
                style={[
                  styles.inputContainer,
                  { color: theme?.text.primary },
                  { borderColor: isFocus ? theme.app.primaryColor1 : CUSTOM_COLOR.grayBoder },
                  value?.length === maxLength ? { borderColor: CUSTOM_COLOR.Red } : {}
                ]}
                placeholderTextColor={theme.text.secondary}
                onFocus={onFocus}
                onBlur={onBlur}
                onEndEditing={onEndEditingWithValidate}
                autoCorrect={false}
                autoCapitalize={autoCapitalize}
                keyboardType={
                  keyboardType ||
                  [ATTRIBUTE_VALIDATION.phone, ATTRIBUTE_VALIDATION.idNumber].includes(
                    item?.validateType?.toLowerCase()
                  )
                    ? 'number-pad'
                    : 'default'
                }
                {...{ maxLength }}
              />
            )}
            {ATTRIBUTE_TYPE.textarea === type && <ICTextArea style={styles.textareaMark} />}
          </View>
          {maxLength > 0 && ATTRIBUTE_TYPE.textarea === type && (
            <AppText translate style={[styles.maxLength, { color: theme?.text?.secondary }]}>
              {`${value?.length || 0}/${maxLength}`}
            </AppText>
          )}
        </>
      ) : [ATTRIBUTE_TYPE.price, ATTRIBUTE_TYPE.number, ATTRIBUTE_TYPE.decimal].includes(type) ? (
        <View style={[styles.container, style]}>
          {title && !hideTitle ? (
            <View style={styles.row}>
              <AppText
                translate={translateTitle || translate}
                style={[
                  styles.title,
                  // { color: theme.text.primary },
                  (errorText || item?.error) && { color: TEXT_COLOR.Flamingo }
                ]}>
                {title}
              </AppText>
              <Text
                style={[
                  styles.title,
                  (errorText || item?.error) && { color: TEXT_COLOR.Flamingo }
                ]}>
                {RequireCharacter}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={() => priceRef?.current?.focus()}
            activeOpacity={1}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1
              // paddingVertical: SPACING.Normal
            }}>
            {type === ATTRIBUTE_TYPE.price && !!prefix && (
              <Text
                style={{
                  color: CUSTOM_COLOR.GreenPea,
                  fontSize: FONT_SIZE.BodyText,
                  fontFamily: theme?.fonts?.REGULAR,
                  marginRight: SPACING.Small
                }}>
                {prefix}
              </Text>
            )}
            <TextInput
              ref={priceRef}
              editable
              multiline={multiline}
              blurOnSubmit={false}
              placeholder={translatePlaceholder || translate ? placeholderTxt : placeholder}
              value={formatNumberNoZero(value)}
              onChangeText={newValue => {
                onChangeText(formatString(newValue.replace(suffix, '')));
              }}
              style={[
                styles.inputContainer,
                { color: theme?.text.primary },
                { borderColor: isFocus ? theme.app.primaryColor1 : CUSTOM_COLOR.grayBoder }
              ]}
              placeholderTextColor={theme.text.secondary}
              onFocus={onFocus}
              onBlur={onBlur}
              onEndEditing={onEndEditingWithValidate}
              autoCorrect={false}
              autoCapitalize={autoCapitalize}
              keyboardType={'number-pad'}
            />
            {type === ATTRIBUTE_TYPE.price && !!suffix && (
              <Text
                style={{
                  color: theme?.text.primary,
                  fontSize: FONT_SIZE.BodyText,
                  fontFamily: theme?.fonts?.REGULAR,
                  marginLeft: SPACING.Normal
                }}>
                {suffix}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : [ATTRIBUTE_TYPE.date, ATTRIBUTE_TYPE.datetime, ATTRIBUTE_TYPE.time].includes(type) ? (
        <View style={[styles.container, style]}>
          {title && !hideTitle ? (
            <View style={styles.row}>
              <AppText
                translate={translateTitle || translate}
                style={[
                  styles.title,
                  { color: theme.text.primary },
                  (errorText || item?.error) && { color: TEXT_COLOR.Flamingo }
                ]}>
                {title}
              </AppText>
              <Text
                style={[
                  styles.title,
                  (errorText || item?.error) && { color: TEXT_COLOR.Flamingo }
                ]}>
                {RequireCharacter}
              </Text>
            </View>
          ) : null}

          <View style={styles.rowContainer}>
            <DatePicker
              style={{
                flex: 1,
                height: scale(45),
                borderWidth: 1,
                paddingTop: 1,
                paddingHorizontal: 10,
                borderColor: CUSTOM_COLOR.grayBoder,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              date={value ? moment(value) : ''}
              mode={type}
              androidMode={'spinner'}
              placeholder={translatePlaceholder || translate ? placeholderTxt : placeholder}
              format={DATE_FORMAT[type]}
              confirmBtnText={Translate('common.confirm')}
              cancelBtnText={Translate('common.cancel')}
              customStyles={{
                dateInput: {
                  borderWidth: 0,
                  alignItems: 'flex-start',
                  justifyContent: 'center'
                },
                dateText: {
                  ...styles.dateInput,
                  color: theme.text.primary,
                  fontFamily: theme?.fonts?.REGULAR
                },
                placeholderText: {
                  ...styles.dateInput,
                  color: theme.text.secondary,
                  fontFamily: theme?.fonts?.REGULAR
                },
                btnTextConfirm: {
                  color: theme?.app?.primaryColor1
                }
              }}
              onDateChange={date => {
                let dateValue = moment(date, DATE_FORMAT[type]).utc().format();
                onChangeText(dateValue);
              }}
              useNativeDriver={true}
              iconComponent={<ICCalendarBlank02 />}
              minDate={
                item?.datetimeMin
                  ? moment().add(item?.datetimeMin, 'days')
                  : minDate
                  ? minDate
                  : undefined
              }
              maxDate={
                item?.datetimeMax
                  ? moment().add(item?.datetimeMax, 'days')
                  : maxDate
                  ? maxDate
                  : undefined
              }
            />
          </View>
          {/*<Divider
            style={[
              styles.divider,
              isFocus
                ? { backgroundColor: CUSTOM_COLOR.GreenBold }
                : {
                    backgroundColor: borderBottomColor ? borderBottomColor : CUSTOM_COLOR.Envy
                  },
              (errorText || item?.error) && {
                backgroundColor: CUSTOM_COLOR.Red
              }
            ]}
          />*/}
        </View>
      ) : [ATTRIBUTE_TYPE.select].includes(type) ? (
        selectOptions?.length > 0 && selectOptions?.length < 4 && parseRadio ? (
          <View style={[styles.container, style]}>
            {title && !hideTitle ? (
              <View style={styles.row}>
                <AppText
                  translate={translateTitle || translate}
                  style={[
                    styles.title,
                    { color: theme.text.primary },
                    (errorText || item?.error) && { color: TEXT_COLOR.Flamingo }
                  ]}>
                  {title}
                </AppText>
                <Text
                  style={[
                    styles.title,
                    (errorText || item?.error) && { color: TEXT_COLOR.Flamingo }
                  ]}>
                  {RequireCharacter}
                </Text>
              </View>
            ) : null}

            <View style={styles.rowContainer}>
              <RadioBoxes
                translate
                checked={value}
                data={parseSelectOptionsToRadioData(selectOptions)}
                onChange={onChangeText}
                boxStyle={styles.radioBox}
                containerStyle={styles.radioBoxesContainer}
              />
            </View>
          </View>
        ) : (
          <DropDownList
            hideTitle={hideTitle}
            showSearch={showSearch}
            translateItem={translateItem}
            translateTitle={translateTitle || translate}
            style={[styles.container, style]}
            title={title}
            isRequired={isRequired}
            value={value}
            placeholder={translatePlaceholder || translate ? placeholderTxt : placeholder}
            data={selectOptions}
            onChangeValue={onChangeText}
            renderDropdownItem={renderDropdownItem}
            labelInput={labelInput}
            hasRightButton={hasRightButton}
            disable={disable}
            icDropdown={icDropdown}
            translateValue={translateValue}
          />
        )
      ) : [ATTRIBUTE_TYPE.media].includes(type) ? (
        <CustomFilePicker
          title={title}
          style={[styles.container, style]}
          isRequired={isRequired}
          itemRef={item}
          onChange={onChangeText}
        />
      ) : [ATTRIBUTE_TYPE.address].includes(type) ? (
        <LocationForm
          hideTitle={hideTitle}
          isRequired={isRequired}
          itemRef={item}
          title={title}
          onChangeValue={onChangeText}
          province={location?.province}
          district={location?.district}
          ward={location?.ward}
          addressDetail={location?.addressDetail}
          zipCode={location?.zipCode}
          display={location?.display}
          onEndEditing={onEndEditing}
        />
      ) : [ATTRIBUTE_TYPE.boolean].includes(type) ? (
        <View style={[styles.container, style]}>
          {title && !hideTitle ? (
            <View style={styles.row}>
              <AppText
                translate={translateTitle || translate}
                style={[
                  styles.title,
                  { color: theme.text.primary },
                  (errorText || item?.error) && { color: TEXT_COLOR.Flamingo }
                ]}>
                {title}
              </AppText>
              <Text
                style={[
                  styles.title,
                  (errorText || item?.error) && { color: TEXT_COLOR.Flamingo }
                ]}>
                {RequireCharacter}
              </Text>
            </View>
          ) : null}

          <View style={styles.rowContainer}>
            <RadioBoxes
              translate
              checked={value}
              onChange={onChangeText}
              data={data}
              boxStyle={styles.radioBox}
              containerStyle={styles.radioBoxesContainer}
            />
          </View>
        </View>
      ) : [ATTRIBUTE_TYPE.copy].includes(type) && !isAddedField ? (
        <View style={[styles.container, styles.rowSpaceBetween]}>
          <SubHead>{title || ''}</SubHead>
          <SwitchToggle
            switchOn={activeCopy?.isActive || false}
            onPress={onCopy}
            containerStyle={styles.switchToggleContainerStyle}
            circleStyle={styles.switchToggleCircleStyle}
            circleColorOff="#FFFFFF"
            circleColorOn="#FFFFFF"
            backgroundColorOn="#00B495"
            backgroundColorOff="#B1B3B6"
          />
        </View>
      ) : null}

      {!disable && (errorText || item?.error) ? (
        <View style={[styles.errorTextWrapper]}>
          <AppText translate style={styles.errorText}>
            {errorText || item?.error}
          </AppText>
        </View>
      ) : null}
    </>
  );
};

export default React.forwardRef(CustomInput);

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    marginTop: SPACING.Medium
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  switchToggleContainerStyle: {
    width: scale(40),
    height: scale(24),
    borderRadius: scale(25),
    padding: scale(5)
  },
  switchToggleCircleStyle: {
    width: scale(18),
    height: scale(18),
    borderRadius: 20
  },
  inputContainer: {
    borderRadius: 4,
    minHeight: scale(45),
    borderWidth: 1,
    fontSize: FONT_SIZE.BodyText,
    paddingHorizontal: 10,
    padding: 0,
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    textAlignVertical: 'center',
    flex: 1
  },
  dateInput: {
    fontSize: FONT_SIZE.BodyText,
    paddingLeft: 0,
    paddingVertical: 0,
    marginVertical: 0,
    textAlignVertical: 'center'
  },
  title: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    paddingBottom: SPACING.Normal
  },
  divider: {
    marginTop: SPACING.Normal
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  comboBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: LINE_HEIGHT.BodyText
  },
  textComboBox: {
    color: CUSTOM_COLOR.GreenPea,
    lineHeight: LINE_HEIGHT.BodyText,
    fontSize: FONT_SIZE.BodyText,
    paddingLeft: 0
  },
  placeholder: {
    color: CUSTOM_COLOR.RegentGray
  },
  errorText: {
    justifyContent: 'flex-start',
    color: TEXT_COLOR.Flamingo,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  errorTextWrapper: {
    marginTop: scale(2),
    width: '100%',
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row'
  },
  inputExtend: {
    marginBottom: 0
  },
  inputView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#fff'
  },
  textareaMark: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  maxLength: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginTop: SPACING.XNormal,
    textAlign: 'right'
  },
  radioBox: {
    paddingRight: SPACING.Medium,
    paddingTop: SPACING.XNormal
  },
  iconRequired: { color: CUSTOM_COLOR.Red },
  radioBoxesContainer: {},
  textAreaInput: { paddingTop: 10, minHeight: scale(120) }
});
