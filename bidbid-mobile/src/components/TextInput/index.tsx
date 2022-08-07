import {
  View,
  TextInput,
  Text,
  Image,
  TextStyle,
  ImageRequireSource,
  ImageStyle,
  ViewStyle,
  TextInputProps as RNTextInputProps,
  StyleProp,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '@/vars';
import TextInputMask from 'react-native-text-input-mask';
import styles from './styles';
import { TextInputMask as TextInputMasked } from 'react-native-masked-text';
import ErrorMessage from '@/components/ErrorMessage';

export interface TextInputProps extends RNTextInputProps {
  inputRef?: (ref: any) => void;
  icon?: any;
  isMasked?: boolean;
  isPrefix?: boolean;
  keyboardType?: any;
  styleConfig?: TextStyle;
  styleContainerConfig?: StyleProp<ViewStyle>;
  textTitleStyle?: ViewStyle;
  placeholder?: string;
  value?: string;
  onChangeText?: (formatted: string, extracted?: string) => void;
  secureTextEntry?: boolean;
  iconLeft?: ImageRequireSource;
  iconRight?: ImageRequireSource;
  iconStyleConfig?: ImageStyle;
  styleFormConfig?: ViewStyle;
  maxLength?: number;
  selectionColor?: string;
  multiline?: boolean;
  inputId?: string;
  textTitle?: string;
  isTitleAsterisk?: boolean;
  isError?: boolean;
  errorText?: string;
  editable?: boolean;
  showSeparatorLine?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  mask?: any;
  onInitValue?: () => void;
  onBlur?: () => void;
  refs?: any;
  precision?: number;
}

export function TextInputComponent(props: TextInputProps) {
  const [secureTextEntry, setSecureTextEntry] = useState(props.secureTextEntry);

  const {
    styleConfig,
    styleContainerConfig,
    textTitleStyle,
    value,
    onChangeText,
    styleFormConfig,
    placeholder,
    maxLength,
    selectionColor,
    multiline,
    textTitle = '',
    isTitleAsterisk,
    isError,
    errorText,
    editable,
    autoCapitalize = 'none',
    keyboardType,
    inputRef,
    refs,
    mask,
    inputId,
    isMasked,
    precision = 2,
  } = props;

  useEffect(() => {
    const { onInitValue } = props;
    onInitValue && onInitValue();
  });

  // function onPress() {
  //   setSecureTextEntry(!secureTextEntry);
  // }

  function onBlur() {
    const { onBlur } = props;
    onBlur && onBlur();
  }

  function renderErrorView(errorText: string) {
    return <ErrorMessage errorValue={errorText} />;
  }

  function renderContent() {
    return (
      <>
        {props.icon && <Image source={props.icon} style={styles.icon} />}
        {props.isPrefix && <Text style={[styles.iconPrefix, props.value ? {} : styles.iconPrefixStyle]}>{props.value ? '$' : ''}</Text>}
        {isMasked ? (
          <TextInputMasked
            refInput={inputRef}
            key={inputId}
            type={'money'}
            options={{
              precision,
              separator: '.',
              delimiter: ',',
              unit: '',
              suffixUnit: '',
            }}
            placeholder={placeholder}
            style={[styles.inputChat, styleConfig]}
            value={value}
            keyboardType={keyboardType}
            editable={editable}
            onChangeText={onChangeText}
            placeholderTextColor={colors.gray_500}
            onBlur={onBlur}
            maxLength={maxLength}
            selectionColor={selectionColor}
            multiline={multiline}
            {...props}
            autoCapitalize={autoCapitalize}
          />
        ) : mask ? (
          <TextInputMask
            refInput={(_ref: any) => {
              inputRef && inputRef(_ref);
            }}
            mask={mask}
            allowFontScaling={false}
            placeholder={placeholder}
            style={[styles.inputChat, styleConfig]}
            value={value}
            keyboardType={keyboardType}
            editable={editable}
            onChangeText={onChangeText}
            placeholderTextColor={colors.gray_500}
            onBlur={onBlur}
            maxLength={maxLength}
            selectionColor={selectionColor}
            multiline={multiline}
            {...props}
            autoCapitalize={autoCapitalize}
          />
        ) : (
          <TextInput
            ref={refs}
            allowFontScaling={false}
            placeholder={placeholder}
            style={[styles.inputChat, styleConfig]}
            value={value}
            keyboardType={keyboardType}
            editable={editable}
            onChangeText={onChangeText}
            placeholderTextColor={colors.gray_500}
            onBlur={onBlur}
            maxLength={maxLength}
            selectionColor={selectionColor}
            multiline={multiline}
            autoCapitalize={autoCapitalize}
            {...props}
            secureTextEntry={secureTextEntry}
          />
        )}

        {/*<TouchableOpacity onPress={onPress} style={styles.wrapIcon}>*/}
        {/*  {secureTextEntry ? (*/}
        {/*    <Image source={secureTextEntry ? images.eyeClosed : images.eye} style={[styles.iconStyle, iconStyleConfig]} />*/}
        {/*  ) : null}*/}
        {/*</TouchableOpacity>*/}
      </>
    );
  }

  return (
    <View style={styleContainerConfig}>
      {textTitle ? (
        <View style={styles.wrapTitle}>
          <Text style={[styles.textTitle, textTitleStyle]} numberOfLines={2}>
            {textTitle}
          </Text>
          {isTitleAsterisk ? <Text style={styles.textAsterisk}>*</Text> : null}
        </View>
      ) : null}

      <View style={[styles.formBar, styleFormConfig]}>{renderContent()}</View>
      {isError ? renderErrorView(errorText!) : null}
    </View>
  );
}
