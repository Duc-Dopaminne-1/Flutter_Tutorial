import React, { ReactElement, memo } from 'react';
import { StyleSheet } from 'react-native';
import { colors, fonts } from '@/vars';
import DefaultText from '@/components/CustomText/DefaultText';

interface Prop {
  title: string;
}

function SettingTitle(props: Prop): ReactElement {
  const { title } = props;
  return <DefaultText {...{ style: styles.textTitle }}>{title}</DefaultText>;
}

export default memo(SettingTitle);

const styles = StyleSheet.create({
  textTitle: {
    fontSize: fonts.size.s18,
    marginHorizontal: 16,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsSemiBold,
  },
});
