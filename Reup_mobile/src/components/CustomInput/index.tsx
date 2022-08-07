import React from 'react';
import styles from './styles';
import { Input } from 'react-native-elements';
import { View, Image } from 'react-native';
import { colors } from '@constants/vars';
import { CustomText } from '../CustomText';
import TextInputMask from 'react-native-text-input-mask';
import { CustomTouchable } from '../CustomTouchable';
import { CustomTextRequired } from '../CustomTextWithRequired';

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
  placeholderTextColor = colors.TEXT_PLACEHOLDER,
  multiline = false,
  isShowRequired = false,
  iconDescription,
  iconDescriptionStyle,
  containerDescriptionStyle,
  ...rest
}: any) => (
    <View style={[styles.wrapper, componentContainer]}>
      {description ?
        <View style={[styles.containerDescription, containerDescriptionStyle]}>
          {iconDescription ?
            <Image
              source={iconDescription}
              resizeMode={'contain'}
              style={[styles.iconDescription, iconDescriptionStyle]} />
            : null}
          {isShowRequired ?
            <CustomTextRequired style={[styles.description, titleStyle]} text={description} />
            : <CustomText style={[styles.description, titleStyle]} text={description} />}
        </View>
        : null}
      <View style={[styles.formBar, moreStyle]}>
        {mask ? (
          <View style={[styles.container, containerStyle, { width: '100%' }]}>
            <TextInputMask
              {...rest}
              refInput={inputRef}
              onFocus={onFocus}
              secureTextEntry={secureTextEntry}
              placeholderTextColor={placeholderTextColor}
              name={name}
              value={value}
              mask={mask}
              autoCorrect={false}
              placeholder={placeholder}
              allowFontScaling={false}
              editable={editable}
              style={[styles.inputStyle, inputStyle]}
              pointerEvents={pointerEvents}
              multiline={multiline}
              textAlignVertical={multiline ? 'top' : 'auto'}
            />
          </View>
        ) : (
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
              textAlignVertical={multiline ? 'top' : 'auto'}
              multiline={multiline}
              autoCorrect={false}
            />
          )}
        {rightIcon ? (
          <CustomTouchable
            style={[{ position: 'absolute', flexDirection: 'row', right: 0, marginRight: 17 }, rightIconContainer]}
            onPress={onPressRightIcon}
          >
            <Image style={[styles.image, rightIconStyle]} resizeMode="contain" source={rightIcon} />
          </CustomTouchable>
        ) : null}
      </View>
    </View >
  );

export default React.memo(CustomInput);
