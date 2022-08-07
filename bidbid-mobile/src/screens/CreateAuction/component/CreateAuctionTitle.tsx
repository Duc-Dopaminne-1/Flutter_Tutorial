import React, { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';

interface Prop {
  title: string;
  subTitle?: string;
  isRequire?: boolean;
  children?: ReactElement;
}

export function CreateAuctionTitle(props: Prop): ReactElement {
  const { title, children, subTitle, isRequire = false } = props;
  return (
    <View>
      <View style={styles.wrapTitle}>
        <Text style={styles.textTitle}>{title}</Text>
        {isRequire ? <Text style={styles.textAsterisk}>* </Text> : null}
        {children}
      </View>
      {subTitle ? <Text style={styles.textSubTitle}>{subTitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  textAsterisk: {
    color: colors.red,
  },
  wrapTitle: {
    flexDirection: 'row',
  },
  textTitle: {
    fontSize: fonts.size.s16,
    fontWeight: '500',
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  },
  textSubTitle: {
    fontSize: fonts.size.s12,
    color: colors.gray_500,
    fontFamily: fonts.family.PoppinsRegular,
  },
});
