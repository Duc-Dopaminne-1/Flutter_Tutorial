import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '@components/Charts/LineChart/component/styles';
import { CustomText } from '@components/CustomText';
import translate from '@src/localize';

interface Props {
  backgroundColor: string;
  text: string;
}
export const Note = (props: Props) => {
  const { backgroundColor, text } = props;
  return (
    <View style={styles.container}>
      <View style={[styles.wrapText, { backgroundColor: backgroundColor }]} />
      <CustomText style={styles.text} text={' ' + translate('chart.year') + ' ' + text} />
    </View>
  );
};
