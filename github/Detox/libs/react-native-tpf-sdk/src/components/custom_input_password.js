import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useContext,
  forwardRef
} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/size';
import { scale } from '../utils/responsive';
import AppText from './app_text';
import themeContext from '../constants/theme/themeContext';
import { IcEye, IcEyeSlash } from '../assets/icons';
import { translate as Translate } from '../i18n';

const selectText = createSelector(
  state => state.setting.lang,
  (_, children) => children,
  (_, children) => {
    return Translate(children);
  }
);

const CustomTextInput = forwardRef((props, ref) => {
  const {
    style,
    required = false,
    disable = false,
    translate,
    translateTitle,
    title = '',
    errorText = '',
    errorTextTranslate = true,
    translatePlaceholder,
    placeholder = '',
    value,
    onChangeText,
    onEndEditing,
    ...rest
  } = props;
  const { fonts, app, text } = useContext(themeContext);

  let fontFamily = fonts.REGULAR;

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

  const placeholderTxt = useSelector(state => selectText(state, placeholder));

  const [isFocus, setFocus] = useState(false);
  const [isShow, setShow] = useState(false);

  const isRequired = required;

  const onFocus = useCallback(() => {
    setFocus(true);
    inputRef.current.isFocus = true;
  }, []);

  const onBlur = useCallback(() => {
    setFocus(false);
    inputRef.current.isFocus = false;
  }, []);

  const onToggleShow = () => {
    setShow(!isShow);
  };

  const onHandleChangeText = text => {
    if (typeof onChangeText !== 'function') return;
    onChangeText(text);
  };

  const RequireCharacter = isRequired ? <Text style={styles.iconRequired}>{' *'}</Text> : null;

  const renderLabel = () => (
    <View style={styles.row}>
      <AppText translate={translateTitle || translate} style={styles.title}>
        {title}
      </AppText>
      <Text style={[styles.title, { color: TEXT_COLOR.Red }]}>{RequireCharacter}</Text>
    </View>
  );

  const renderErrorMessage = () => (
    <View style={[styles.errorTextWrapper]}>
      <AppText translate={errorTextTranslate} style={styles.errorText}>
        {errorText}
      </AppText>
    </View>
  );

  const renderIconPassword = () => (
    <TouchableOpacity onPress={onToggleShow} style={{ paddingHorizontal: scale(16) }}>
      {isShow ? <IcEye /> : <IcEyeSlash width={scale(24)} height={scale(24)} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderLabel()}
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: isFocus ? app.primaryColor1 : CUSTOM_COLOR.grayBoder
          },
          errorText ? { borderColor: TEXT_COLOR.Flamingo } : {},
          disable && { backgroundColor: CUSTOM_COLOR.disable }
        ]}>
        <TextInput
          blurOnSubmit={false}
          placeholder={translatePlaceholder || translate ? placeholderTxt : placeholder}
          value={value}
          onChangeText={onHandleChangeText}
          style={[styles.inputContainer, { color: text.primary, fontFamily }, style]}
          placeholderTextColor={text.secondary}
          onFocus={onFocus}
          onBlur={onBlur}
          onEndEditing={onEndEditing}
          autoCorrect={false}
          secureTextEntry={!isShow}
          editable={!disable}
          {...rest}
        />
        {renderIconPassword()}
      </View>
      {!disable && !!errorText && renderErrorMessage()}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    // marginTop: SPACING.XNormal
  },

  row: {
    flexDirection: 'row'
  },

  title: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.BodyText,
    paddingBottom: SPACING.Normal
  },

  iconRequired: {
    color: CUSTOM_COLOR.Red
  },

  errorText: {
    justifyContent: 'flex-start',
    color: CUSTOM_COLOR.Red,
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.SubHead
  },

  errorTextWrapper: {
    marginTop: scale(2),
    width: '100%',
    justifyContent: 'center'
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS / 2,
    minHeight: scale(40),
    borderWidth: 1
  },

  inputContainer: {
    fontSize: FONT_SIZE.BodyText,
    flex: 1,
    width: '100%',
    paddingHorizontal: scale(16),
    paddingRight: 0,
    paddingVertical: Platform.OS === 'ios' ? scale(16) : 0
  }
});

export default CustomTextInput;
