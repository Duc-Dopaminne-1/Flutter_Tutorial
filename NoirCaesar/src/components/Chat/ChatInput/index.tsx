import React from 'react';
import styles from './styles';
import { Input } from 'react-native-elements';
import { View } from 'react-native';
import { colors } from '@constants/vars';

const ChatInput = ({
  name,
  placeholder,
  value,
  moreStyle,
  editable = true,
  placeholderTextColor = colors.TEXT_PLACEHOLDER,
  multiline = false,
  ...rest
}: any) => (
  <View style={[styles.formBar, moreStyle]}>
    <Input
      {...rest}
      placeholderTextColor={placeholderTextColor}
      name={name}
      value={value}
      placeholder={placeholder}
      allowFontScaling={false}
      editable={editable}
      inputStyle={[styles.inputStyle]}
      inputContainerStyle={styles.inputContainer}
      containerStyle={[styles.container]}
      multiline={multiline}
    />
  </View>
);

export default ChatInput;
