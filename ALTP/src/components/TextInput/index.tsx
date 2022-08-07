import {
  View,
  TextInput,
  Text,
  Image,
  TextStyle,
  TouchableOpacity,
  ImageRequireSource,
  ImageStyle,
  ViewStyle,
  TextInputProps as RNTextInputProps
} from 'react-native'
import React, { Component, useEffect, useRef, useState } from 'react'
import styles from './styles'
import { images } from '@/vars'

export interface TextInputProps extends RNTextInputProps {
  icon: any
  keyboardType?: any
  styleConfig?: TextStyle
  styleContainerConfig?: TextStyle
  placeholder?: string
  value?: string
  onChangeText?: (formatted: string, extracted?: string) => void
  secureTextEntry?: boolean
  iconLeft?: ImageRequireSource
  iconRight?: ImageRequireSource
  iconStyleConfig?: ImageStyle
  styleFormConfig?: ViewStyle
  maxLength?: number
  selectionColor?: string
  multiline?: boolean
  textTitle?: string
  isError?: boolean
  errorText?: string
  editable?: boolean
  showSeparatorLine?: boolean
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  mask?: any
  onInitValue?: () => void
  onBlur?: () => void
  refs?: any
}

const textInputBorderStates = {
  NOMAL: 'NOMAL',
  FOCUSED: 'FOCUSED',
  ERROR: 'ERROR'
}

export function TextInputComponent(props: TextInputProps) {
  let ref = useRef(null)
  const [secureTextEntry, setSecureTextEntry] = useState(props.secureTextEntry)
  const [textInputBorderState, setTextInputBorderState] = useState(
    props.isError ? textInputBorderStates.ERROR : textInputBorderStates.NOMAL
  )
  const {
    styleConfig,
    styleContainerConfig,
    value,
    onChangeText,
    iconStyleConfig,
    styleFormConfig,
    placeholder,
    maxLength,
    selectionColor,
    multiline,
    textTitle = '',
    isError,
    errorText,
    editable,
    autoCapitalize = 'none',
    keyboardType,
    refs
  } = props

  useEffect(() => {
    const { onInitValue } = props
    onInitValue && onInitValue()
  })

  function onPress() {
    setSecureTextEntry(!secureTextEntry)
  }

  function focus() {
    ref && ref.current && ref.current.focus()
  }

  function onFocusChange() {
    var textInputBorderState = getTextInputBorderState(true)
    setTextInputBorderState(textInputBorderState)
  }

  function onBlur() {
    const { onBlur } = props
    onBlur && onBlur()
    var textInputBorderState = getTextInputBorderState(false)
    setTextInputBorderState(textInputBorderState)
  }

  function getTextInputBorderState(isFocused: boolean) {
    if (props.isError) {
      return textInputBorderStates.ERROR
    } else if (isFocused) {
      return textInputBorderStates.FOCUSED
    } else return textInputBorderStates.NOMAL
  }

  function getTextInputBoderColor() {
    if (props.isError) {
      return 'red'
    } else if (textInputBorderState === textInputBorderStates.FOCUSED) {
      return '#5C6AC4'
    } else {
      return '#adb5bd'
    }
  }

  function renderErrorView(errorText: string) {
    return (
      <View style={styles.errorContainer}>
        <Image source={images.invalid} style={styles.errorIconStyle} />
        <Text numberOfLines={2} style={[styles.errorText]}>
          {errorText}
        </Text>
      </View>
    )
  }

  function renderContent() {
    return (
      <>
        {props.icon && <Image source={props.icon} style={{ marginLeft: 10 }} />}
        <TextInput
          ref={re => refs && refs(re)}
          allowFontScaling={false}
          placeholder={placeholder}
          style={[styles.inputChat, styleConfig]}
          value={value}
          keyboardType={keyboardType}
          editable={editable}
          onChangeText={onChangeText}
          onFocus={onFocusChange}
          onBlur={onBlur}
          maxLength={maxLength}
          selectionColor={selectionColor}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
          {...props}
          secureTextEntry={secureTextEntry}
        />
        <TouchableOpacity onPress={onPress} style={{ marginEnd: 10 }}>
          {secureTextEntry ? (
            <Image
              source={secureTextEntry ? images.eyeClosed : images.eye}
              style={[styles.iconStyle, iconStyleConfig]}
            />
          ) : null}
        </TouchableOpacity>
      </>
    )
  }

  return (
    <View style={[styleContainerConfig]}>
      <Text style={styles.textTitle} numberOfLines={2}>
        {textTitle}
      </Text>
      <View
        style={[
          styles.formBar,
          styleFormConfig,
          { borderColor: getTextInputBoderColor() }
        ]}>
        {renderContent()}
      </View>
      {isError ? renderErrorView(errorText!) : null}
    </View>
  )
}
