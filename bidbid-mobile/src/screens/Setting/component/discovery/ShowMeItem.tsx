import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, Text, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import { Gender } from '@/models';
import { useLocalizeGenderName } from '@/shared/processing';
import IconBoxCheckedSVG from '@/components/SVG/IconBoxCheckedSVG';
import IconBoxUnCheckSVG from '@/components/SVG/IconBoxUnCheckSVG';

interface Props {
  item: Gender;
  index?: number;
  itemSelected?: Gender;
  boxCheckSelected?: (item: any, index: number) => void;
  isSelected: boolean;
}

export default function ShowMeItem(props: Props): ReactElement {
  const { item, index, boxCheckSelected, isSelected = false } = props;

  const boxView = isSelected ? IconBoxCheckedSVG : IconBoxUnCheckSVG;

  const getGenderName = useLocalizeGenderName();

  return (
    <Pressable style={styles.container} onPress={() => boxCheckSelected(item, index)}>
      <Text style={styles.textStyle}>{getGenderName(item)}</Text>
      <Pressable style={styles.boxWraapper} disabled={true}>
        {boxView}
      </Pressable>
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

  boxWraapper: {
    padding: 4,
    justifyContent: 'center',
  } as ViewStyle,

  textStyle: {
    textAlign: 'center',
    fontSize: fonts.size.s18,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,
});
