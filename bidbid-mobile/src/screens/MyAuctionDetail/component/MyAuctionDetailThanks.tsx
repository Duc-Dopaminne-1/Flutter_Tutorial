import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import DefaultText from '@/components/CustomText/DefaultText';
import IconThankCharitySVG from '@/components/SVG/IconThankCharitySVG';

interface MyAuctionDetailThanksProps {
  data: any;
}
export function MyAuctionDetailThanks(props: MyAuctionDetailThanksProps): ReactElement {
  const { data } = props;
  const charityName = data?.charity ? data.charity?.name?.trim() : '';
  const description = language('stichtingFoundationThankYou', { charityName });

  return (
    <View style={styles.container}>
      <IconThankCharitySVG />
      <DefaultText {...{ style: styles.charityText }}>{description}</DefaultText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    flexDirection: 'row',
  },

  charityText: {
    flex: 1,
    marginLeft: 12,
    textAlign: 'left',
    fontSize: fonts.size.s15,
    color: colors.gray_900,
  } as TextStyle,
});
