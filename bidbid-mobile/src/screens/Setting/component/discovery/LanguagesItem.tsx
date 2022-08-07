import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, Text, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import IconBoxCheckedSVG from '@/components/SVG/IconBoxCheckedSVG';
import IconBoxUnCheckSVG from '@/components/SVG/IconBoxUnCheckSVG';

interface Props {
  item: any;
  index?: number;
  boxCheckSelected?: (item: any, index: number) => void;
  isSelected: boolean;
}

const LanguagesItemView = (props: Props): ReactElement => {
  const { item, index, boxCheckSelected, isSelected = false } = props;
  const boxView = isSelected ? IconBoxCheckedSVG : IconBoxUnCheckSVG;
  return (
    <Pressable style={styles.container} onPress={() => boxCheckSelected(item, index)}>
      <Text style={styles.textStyle}>{item.name}</Text>
      <Pressable style={styles.boxWraapper} disabled={true}>
        {boxView}
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  } as ViewStyle,

  boxWraapper: {
    padding: 5,
  } as ViewStyle,

  textStyle: {
    textAlign: 'left',
    flex: 1,
    fontSize: fonts.size.s18,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,
});

export default LanguagesItemView;
