import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import DefaultText from '@/components/CustomText/DefaultText';

export default function ReviewTitle(): ReactElement {
  return (
    <View style={styles.container}>
      <DefaultText {...{ style: styles.text }}>{language('auctionReview.reviewTitle')}</DefaultText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 2,
    marginVertical: 5,
  } as ViewStyle,

  text: {
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsSemiBold,
  } as TextStyle,
});
