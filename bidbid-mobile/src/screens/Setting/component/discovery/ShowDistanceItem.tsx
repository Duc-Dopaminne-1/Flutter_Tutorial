import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View, Text, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import IconCheckedSVG from '@/components/SVG/IconCheckedSVG';

interface Props {
  item: any;
  index?: number;
  itemSelected?: any;
  checkOnPressed?: (item: any, index: number) => void;
}

export default function ShowDistanceItem(props: Props): ReactElement {
  const { item, index, checkOnPressed, itemSelected } = props;

  const icCheckedCompnent = itemSelected && itemSelected === item ? <IconCheckedSVG /> : <View />;
  const desc = item === 'Km' ? language('settingsScreen.kmDesc') : language('settingsScreen.miDesc');
  return (
    <Pressable style={styles.container} onPress={() => checkOnPressed(item, index)}>
      <Text style={styles.textStyle}>{desc}</Text>
      {icCheckedCompnent}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  } as ViewStyle,

  textStyle: {
    textAlign: 'center',
    fontSize: fonts.size.s18,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,
});
