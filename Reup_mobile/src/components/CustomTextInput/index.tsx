import React from 'react';
import styles from './styles';
import { View } from 'react-native';
import { CustomText } from '../CustomText';

const CustomTextInput = ({
  text,
  description,
  moreStyle,
  containerStyle,
  ...rest
}: any) => (
    <View style={[{ alignItems: 'flex-start' }]}>
      {description ? <CustomText style={styles.description} text={description} /> : null}
      <View style={[styles.formBar, moreStyle]}>
        <View style={[styles.container, containerStyle, { width: '100%' }]}>
          <CustomText
            text={text}
            style={{ alignSelf: 'flex-start' }}
          />
        </View>
      </View>
    </View>
  );

export default React.memo(CustomTextInput);
