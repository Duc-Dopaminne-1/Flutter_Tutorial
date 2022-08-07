import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import DefaultText from '@/components/CustomText/DefaultText';
import NextSVG from '@/components/SVG/NextSVG';

interface Props {
  title: string;
  icon: ReactElement;
}

export function ProfileEditInfoItem(props: Props): ReactElement {
  const { title, icon = null } = props;
  return (
    <View style={styles.container}>
      <View style={styles.wrapIcon}>
        <View style={styles.iconHead}>{icon && icon}</View>
        <DefaultText {...{ style: styles.title }}>{title}</DefaultText>
      </View>
      <NextSVG />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray_100,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  wrapIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 5,
  },
  iconHead: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: colors.blue_700,
  },
  title: {
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    marginLeft: 10,
  },
});
