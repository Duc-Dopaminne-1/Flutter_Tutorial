import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, Text, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import { useLocalizeNameField } from '@/shared/processing';
import IconBoxCheckedSVG from '@/components/SVG/IconBoxCheckedSVG';
import IconBoxUnCheckSVG from '@/components/SVG/IconBoxUnCheckSVG';

interface Props {
  item: any;
  index?: number;
  dataSelectedList?: any[];
  boxCheckSelected?: (item: any, index: number) => void;
}

export default function CategoriesItem(props: Props): ReactElement {
  const { item, index, boxCheckSelected, dataSelectedList } = props;
  const localizeNameField = useLocalizeNameField();

  const boxView = dataSelectedList.some(obj => obj.id === item.id) ? IconBoxCheckedSVG : IconBoxUnCheckSVG;

  return (
    <Pressable style={styles.container} onPress={() => boxCheckSelected(item, index)}>
      <Text style={styles.textStyle}>{localizeNameField(item)}</Text>
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
