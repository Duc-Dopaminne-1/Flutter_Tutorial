import React from 'react';
import styles from './styles';
import { Input } from 'react-native-elements';
import { View, Image } from 'react-native';
import { colors } from '@constants/vars';
import { CustomText } from '../CustomText';
import TextInputMask from 'react-native-text-input-mask';
import { CustomTouchable } from '../CustomTouchable';

const CustomInput = ({
  description,
  name,
  placeholder,
  value,
  secureTextEntry,
  isSecured,
  onPressRightIcon,
  rightIcon,
  rightIconStyle,
  inputRef,
  moreStyle,
  inputStyle,
  pointerEvents = 'auto',
  editable = true,
  mask,
  containerStyle = {},
  placeholderTextColor = colors.TEXT_PLACEHOLDER,
  multiline = false,
  ...rest
}: any) => (
  <View style={[{ alignItems: 'flex-start' }]}>
    {description ? <CustomText style={styles.description} text={description} /> : null}
    <View style={[styles.formBar, moreStyle]}>
      {mask ? (
        <View style={[styles.container, containerStyle, { width: '100%' }]}>
          <TextInputMask
            {...rest}
            refInput={inputRef}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={placeholderTextColor}
            name={name}
            value={value}
            mask={mask}
            placeholder={placeholder}
            allowFontScaling={false}
            editable={editable}
            style={[styles.inputStyle, inputStyle]}
            pointerEvents={pointerEvents}
            multiline={multiline}
          />
        </View>
      ) : (
        <Input
          {...rest}
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
        />
      )}
      {rightIcon ? (
        <CustomTouchable style={{ position: 'absolute', flexDirection: 'row', right: 0, marginRight: 17 }} onPress={onPressRightIcon}>
          <Image style={[styles.image, rightIconStyle]} resizeMode="cover" source={rightIcon} />
        </CustomTouchable>
      ) : null}
    </View>
  </View>
);

export default CustomInput;
