import React, {useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';

import {KEY_BOARD_TYPE} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {HELPERS} from '../../../assets/theme/helpers';
import {commonStyles} from '../../../assets/theme/styles';
import InputSection from '../../../components/InputSection';
import styles from './styles';

const CustomNumericView = ({
  onChangeText,
  value,
  headerTitle,
  headerStyles,
  error,
  onPlusPress,
  onMinorPress,
  style,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <InputSection
      customStyle={[styles.container, style]}
      headerTitle={headerTitle}
      headerStyles={[commonStyles.grayText14, headerStyles]}
      inputContainerStyle={styles.input(focused)}
      inputStyle={{...commonStyles.inputStyle, ...HELPERS.textCenter, ...commonStyles.blackText16}}
      keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
      checkOnlyNumber={true}
      editable={true}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={''}
      value={`${value}`}
      error={error}
      onChangeText={onChangeText}
      customRightComponent={
        <TouchableOpacity onPress={onPlusPress} style={commonStyles.componentInput}>
          <Image resizeMode="contain" source={IMAGES.IC_PLUS} />
        </TouchableOpacity>
      }
      customLeftComponent={
        <TouchableOpacity onPress={onMinorPress} style={commonStyles.componentInput}>
          <Image resizeMode="contain" source={IMAGES.IC_MINUS} />
        </TouchableOpacity>
      }
    />
  );
};

export default CustomNumericView;
