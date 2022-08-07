import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { CustomText } from '@/components/CustomText';

type Props = {
  title?: string;
  note?: string;
  container?: ViewStyle;
  titleStyle?: TextStyle;
  noteStyle?: TextStyle;
  wrapContentStyle?: StyleProp<ViewStyle>;
};
function CustomHeaderTitle(prop: Props) {
  const { title, note, container, titleStyle, noteStyle, wrapContentStyle } = prop;

  return (
    <View style={container}>
      {title ? (
        <CustomText titleStyle={Object.assign({}, styles.title, titleStyle)} containerStyle={styles.wrapTitle} title={title} />
      ) : null}
      {note ? (
        <CustomText
          titleStyle={Object.assign({}, styles.note, noteStyle)}
          containerStyle={[styles.wrapContent, wrapContentStyle]}
          title={note}
        />
      ) : null}
    </View>
  );
}

export default React.memo(CustomHeaderTitle);

const styles = StyleSheet.create({
  note: {
    color: colors.gray_500,
    fontSize: fonts.size.s16,
  },
  title: {
    fontSize: fonts.size.s22,
    fontFamily: fonts.family.PoppinsBold,
    color: colors.gray_900,
  },
  wrapContent: {
    justifyContent: 'flex-start',
    marginTop: 16,
  },
  wrapTitle: {
    justifyContent: 'flex-start',
  },
});
