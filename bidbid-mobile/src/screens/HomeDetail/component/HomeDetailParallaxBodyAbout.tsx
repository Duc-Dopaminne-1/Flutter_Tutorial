import React, { ReactElement, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { CustomText } from '@/components/CustomText';
import { language } from '@/i18n';
import { HomeDetailContext } from '@/screens/HomeDetail/HomeDetailContext';

export function HomeDetailParallaxBodyAboutMe(): ReactElement {
  const {
    profile: { description },
  } = useContext(HomeDetailContext);

  if (description) {
    return (
      <View style={styles.container}>
        <CustomText containerStyle={styles.wrapTitle} titleStyle={styles.title} title={language('aboutMe')} />
        <CustomText numberOfLines={10} containerStyle={styles.wrapContent} titleStyle={styles.content} title={description} />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 3,
  },
  wrapTitle: {
    justifyContent: 'flex-start',
  },
  wrapContent: {
    justifyContent: 'flex-start',
    marginTop: 3,
  },
  title: {
    fontSize: fonts.size.s18,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsMedium,
  },
  content: {
    fontSize: fonts.size.s16,
    color: colors.gray_700,
    fontFamily: fonts.family.RobotoRegular,
  },
});
