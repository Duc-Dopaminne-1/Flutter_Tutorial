import { View } from 'react-native';
import styles from './styles';
import React from 'react';
import { CustomText } from '../CustomText';

interface Props {
  firstTitle: string;
  firstDetail: string;
  secondTitle: string;
  secondDetail: string;
  thirdTitle: string;
  thirdDetail: string;
}

const DetailInformation = (props: Props) => {
  const { firstTitle, firstDetail, secondTitle, secondDetail, thirdTitle, thirdDetail } = props;

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <CustomText style={styles.title} text={firstTitle} />
        <CustomText numberOfLines={2} style={styles.detail} text={firstDetail} />
      </View>
      <View style={styles.subContainer}>
        <CustomText style={styles.title} text={secondTitle} />
        <CustomText numberOfLines={2} style={styles.detail} text={secondDetail} />
      </View>
      <View style={styles.subContainer}>
        <CustomText style={styles.title} text={thirdTitle} />
        <CustomText numberOfLines={2} style={styles.detail} text={thirdDetail} />
      </View>
    </View>
  );
};

export { DetailInformation };
