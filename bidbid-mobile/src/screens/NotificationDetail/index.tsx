import React, { ReactElement } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors, fonts } from '@/vars';
import { SafeArea } from '@/components/SafeArea';
import { GlobalProps } from '@/shared/Interface';
import HTML from 'react-native-render-html';
import { language } from '@/i18n';
import CustomHeader from '@/components/CustomHeader';
import IconBack from '@/components/SVG/BackSvg';

export function NotificationDetailScreen(props: GlobalProps): ReactElement {
  const html = props.route.params ? props.route.params?.content : '';
  const contentWidth = useWindowDimensions().width;

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} title={language('offerBidbid')} titleStyle={styles.textTitle} />
      <ScrollView style={styles.wrapHtml}>
        <HTML source={{ html }} contentWidth={contentWidth} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 0,
  },
  wrapHtml: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  textTitle: {
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  },
});
