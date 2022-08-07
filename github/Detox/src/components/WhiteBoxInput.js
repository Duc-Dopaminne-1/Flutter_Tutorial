import PropTypes from 'prop-types';
import React, {forwardRef, useRef} from 'react';
import {Platform, StyleSheet, TextInput, View, ViewPropTypes} from 'react-native';

import {CONSTANTS, MAX_LENGTH} from '../assets/constants';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS} from '../assets/theme/metric';
import {getColorStyleTextEditable} from '../utils/UiUtils';
import ErrorText from './ErrorText';
import TextEditor from './TextEditor';

const styles = StyleSheet.create({
  textInput: {
    ...FONTS.regular,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    fontSize: 14,
    paddingVertical: CONSTANTS.INPUT_PADDING_VERTICAL,
    paddingLeft: CONSTANTS.INPUT_PADDING_HORIZONTAL,
  },
  inputWithEditor: {
    ...HELPERS.absoluteFill,
    backgroundColor: COLORS.TRANSPARENT,
  },
  cursorTopPosition: {textAlignVertical: 'top'},
  setViewOnBack: {zIndex: -1},
});

const WhiteBoxInput = forwardRef(
  (
    {
      style,
      textInputStyle,
      error,
      alignTop,
      editable = true,
      maxLength = MAX_LENGTH.default,
      useEditor = false,
      outerScrollViewRef,
      scrollViewProps,
      ...textInputProps
    },
    ref,
  ) => {
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const isFocused = useRef();

    const textColorStyle = getColorStyleTextEditable(editable);
    const inputStyle = [styles.textInput, textColorStyle, textInputStyle];

    const onFocusInput = () => {
      textInputProps.onFocus && textInputProps.onFocus();
      if (useEditor) {
        setTimeout(() => {
          isFocused.current = true;
          Platform.OS === 'android' && forceUpdate();
          ref?.current?.focusContentEditor();
        }, 100);
      }
    };

    const onBlurInput = () => {
      if (!useEditor) {
        textInputProps.onBlur && textInputProps.onBlur();
      }
    };

    const onBlurEditor = () => {
      textInputProps.onBlur && textInputProps.onBlur();
      isFocused.current = false;
      Platform.OS === 'android' && forceUpdate();
    };

    return (
      <View style={style}>
        {useEditor && (
          <TextEditor
            ref={ref ?? null}
            style={[textInputStyle, METRICS.resetPadding]}
            placeholder={textInputProps?.placeholder}
            onChange={textInputProps?.onChangeText}
            onFocus={textInputProps?.onFocus}
            onBlur={onBlurEditor}
            initialContentHTML={textInputProps?.value}
            // fix on Android, nested ScrollViews can not catch user's touch
            outerScrollViewRef={outerScrollViewRef}
            scrollViewProps={scrollViewProps}
          />
        )}
        <TextInput
          style={[
            inputStyle,
            alignTop && styles.cursorTopPosition,
            useEditor && styles.inputWithEditor,
            isFocused.current && useEditor && styles.setViewOnBack,
          ]}
          autoCorrect={false}
          autoCapitalize="none"
          editable={isFocused.current && useEditor ? false : editable}
          maxLength={maxLength}
          {...textInputProps}
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          value={useEditor ? '' : textInputProps?.value}
          pointerEvents={isFocused.current ? 'none' : 'auto'}
          placeholder={useEditor ? '' : textInputProps?.placeholder}
        />
        <ErrorText errorText={error} />
      </View>
    );
  },
);

WhiteBoxInput.propTypes = {
  style: ViewPropTypes.style,
  textInputStyle: ViewPropTypes.style,
  error: PropTypes.string,
  alignTop: PropTypes.bool,
};

export default WhiteBoxInput;
