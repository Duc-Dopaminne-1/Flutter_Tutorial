import React from 'react'
import styles from './styles'
import { Input } from 'react-native-elements'
import { View } from 'react-native'
import { CustomTextRequired } from '@/components/CustomTextWithRequired'
import { CustomText } from '@/components/CustomText'

const CustomInput = ({
  componentContainer,
  description,
  name,
  placeholder,
  value,
  secureTextEntry,
  isSecured,
  onPressRightIcon,
  rightIcon,
  rightIconStyle,
  rightIconContainer,
  inputRef,
  onFocus,
  moreStyle,
  inputStyle,
  pointerEvents = 'auto',
  editable = true,
  mask,
  titleStyle,
  containerStyle = {},
  containerMainStyle = {},
  placeholderTextColor = '#999',
  multiline = false,
  isShowRequired = false,
  ...rest
}: any) => (
  <View style={[styles.wrapper, componentContainer]}>
    {description ? (
      isShowRequired ? (
        <CustomTextRequired
          style={[styles.description, titleStyle]}
          text={description}
        />
      ) : (
        <CustomText
          style={[styles.description, titleStyle]}
          text={description}
        />
      )
    ) : null}

    <View style={{ borderWidth: 1, height: 50 }}>
      <Input
        {...rest}
        onFocus={onFocus}
        ref={inputRef}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={placeholderTextColor}
        name={name}
        value={value}
        placeholder={placeholder}
        allowFontScaling={false}
        editable={editable}
        inputStyle={[styles.inputStyle, inputStyle]}
        inputContainerStyle={styles.inputContainer}
        containerStyle={[styles.container, containerStyle]}
        pointerEvents={pointerEvents}
        multiline={multiline}
        autoCorrect={false}
      />
    </View>
  </View>
)

export default React.memo(CustomInput)
