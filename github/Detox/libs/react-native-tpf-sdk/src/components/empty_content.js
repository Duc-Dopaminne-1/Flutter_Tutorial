import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import { TEXT_COLOR } from '../constants/colors';
import { scale } from '../utils/responsive';
import AppText from './app_text';

const EmptyContent = ({ image, title, loading = false, translate = false }) => {
  return !loading ? (
    <View style={styles.container}>
      <FastImage source={image} style={styles.image} resizeMode="contain" />
      <AppText translate={translate} style={styles.title}>
        {title}
      </AppText>
    </View>
  ) : (
    <ActivityIndicator />
  );
};

export default EmptyContent;

const styles = StyleSheet.create({
  container: {
    marginTop: scale(48),
    alignContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: TEXT_COLOR.ShuttleGray,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    textAlign: 'center',
    marginTop: scale(15)
  },
  image: { width: scale(115), height: scale(115) }
});
