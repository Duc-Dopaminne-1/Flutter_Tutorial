import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import AppText from '../../components/app_text';
import { styles } from './styles';

const CustomButtonTab = props => {
  const { active, title, styleButton, styleText, onPress } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[styles.btnGroupButton, styleButton, active ? { opacity: 1 } : { opacity: 0.3 }]}>
        <AppText translate style={[styles.btnText, styleText]} bold={true}>
          {title}
        </AppText>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomButtonTab;
