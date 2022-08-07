import AppText from '../../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { scale } from '../../../../utils/responsive';
import themeContext from '../../../../constants/theme/themeContext';

const ReturnPolicy = () => {
  const theme = useContext(themeContext);
  const styleTitle = {
    ...styles.title,
    color: theme?.app?.primaryColor1
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <AppText translate bold={true} style={styleTitle}>
        {'return_policy.become_topener'}
      </AppText>
      <View style={styles.contentContainer}>
        <View style={styles.dot} />
        <AppText translate style={styles.content}>
          {'return_policy.content_01'}
        </AppText>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.dot} />
        <AppText translate style={styles.content}>
          {'return_policy.content_02'}
        </AppText>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.dot} />
        <AppText translate style={styles.content}>
          {'return_policy.content_03'}
        </AppText>
      </View>
      <AppText translate style={styleTitle}>
        {'return_policy.become_member'}
      </AppText>
      <View style={styles.contentContainer}>
        <View style={styles.dot} />
        <AppText translate style={styles.content}>
          {'return_policy.content_04'}
        </AppText>
      </View>
    </ScrollView>
  );
};

export default ReturnPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.White,
    paddingHorizontal: SPACING.Medium
  },
  title: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginTop: SPACING.Large,
    marginBottom: SPACING.Normal
  },
  contentContainer: {
    flexDirection: 'row',
    marginTop: SPACING.Normal,
    marginBottom: SPACING.Medium
  },
  dot: {
    width: scale(6),
    height: scale(6),
    backgroundColor: CUSTOM_COLOR.GreenBold,
    borderRadius: scale(32),
    marginTop: SPACING.Normal
  },
  content: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    textAlign: 'justify',
    marginLeft: SPACING.XNormal,
    flex: 1
  }
});
