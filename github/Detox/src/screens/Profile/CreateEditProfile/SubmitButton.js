import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {commonStyles} from '../../../assets/theme/styles';

const SubmitButton = ({disabled = false, onSubmit, submitTitle}) => {
  const onSubmitHandler = () => {
    onSubmit && onSubmit();
  };

  return (
    <TouchableOpacity disabled={disabled} onPress={onSubmitHandler}>
      <View style={disabled ? commonStyles.greyBorderContainer : commonStyles.confirmContainer}>
        <Text style={disabled ? commonStyles.greyText : commonStyles.confirmText}>
          {submitTitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SubmitButton;
