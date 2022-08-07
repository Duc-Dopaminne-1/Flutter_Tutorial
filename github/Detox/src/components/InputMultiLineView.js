import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

const styles = StyleSheet.create({
  multilineInput: {
    textAlignVertical: 'top',
  },
});

const InputMultiLineView = ({
  placeholderTextColor,
  placeholder,
  onChangeText,
  keyboardType,
  value,
  editable,
  customStyle,
  maxLength,
  multiline = true,
  ...textInputProps
}) => {
  return (
    <View>
      <TextInput
        placeholderTextColor={placeholderTextColor}
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        value={value}
        editable={editable}
        autoCorrect={false}
        autoCapitalize="none"
        maxLength={maxLength}
        multiline={multiline}
        {...textInputProps}
        style={[textInputProps.style, styles.multilineInput]}
      />
    </View>
  );
};

export default InputMultiLineView;
