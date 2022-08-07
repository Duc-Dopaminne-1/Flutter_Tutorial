import React, { ReactElement } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { language } from '@/i18n';
import DefaultText from '@/components/CustomText/DefaultText';

interface HeaderViewProps {
  title: string;
  viewAllOnPressed: () => void;
}

export default function HeaderView(props: HeaderViewProps): ReactElement {
  const { title = '', viewAllOnPressed = () => {} } = props;

  return (
    <View style={styles.headerView}>
      <DefaultText {...{ style: styles.titleText }}>{title}</DefaultText>
      <TouchableOpacity onPress={viewAllOnPressed}>
        <DefaultText {...{ style: styles.subTitleText }}>{language('myBidsScreen.viewAll')}</DefaultText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 24,
    marginTop: 24,
    marginBottom: 6,
    marginLeft: 24,
    flexWrap: 'wrap',
  } as ViewStyle,

  titleText: {
    color: colors.gray_900,
    fontSize: fonts.size.s18,
    fontFamily: fonts.family.PoppinsMedium,
  } as TextStyle,

  subTitleText: {
    color: colors.gray_600,
    fontSize: fonts.size.s15,
    fontFamily: fonts.family.PoppinsRegular,
    textDecorationLine: 'underline',
  } as TextStyle,
});
