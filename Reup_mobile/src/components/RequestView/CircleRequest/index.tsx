import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from './style';
import IC_NEW from '@src/res/icons/new-request-icon/new-request-icon.png';
import TypeRequest from '@components/RequestView/enum';
import { CustomText } from '@src/components/CustomText';

interface Props {
  width?: number;
  height?: number;
  borderColor?: string;
  typeRequest?: TypeRequest;
  icon?: string;
  text?: string;
}

const CircleRequest = (props: Props) => {
  const { width, height, borderColor, icon = IC_NEW, text } = props;
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.circelView,
          {
            width: width ? width : 110,
            height: height ? height : 110,
            borderRadius: width ? width / 2 : 110 / 2,
            borderColor: borderColor,
          },
        ]}
      >
        {icon ? <Image source={icon} style={styles.icon} /> : <CustomText style={styles.icon} text={text ?? ''} />}
      </View>
    </View>
  );
};

export default CircleRequest;
