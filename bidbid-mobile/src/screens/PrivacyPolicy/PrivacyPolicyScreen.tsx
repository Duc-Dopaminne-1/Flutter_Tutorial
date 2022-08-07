import React, { ReactElement } from 'react';
import { StyleSheet, ViewStyle, View, TextStyle } from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { SafeArea } from '@/components/SafeArea';
import { WebView } from 'react-native-webview';
import CustomLoading from '@/components/CustomLoading';
import { useSelector } from 'react-redux';
import { AppInit } from '@/redux/app/reducer';
import IconBack from '@/components/SVG/BackSvg';
export default function PrivacyPolicyScreen(): ReactElement {
  const uri = useSelector((state: AppInit) => state.app.setting.FILE_PRIVACY_POLICY);
  const Spinner = () => <CustomLoading />;

  return (
    <View style={styles.root}>
      <SafeArea />
      <View style={styles.wrapperHeader}>
        <CustomHeader titleStyle={styles.titleText} title={language('privacyPolicyScreen.title')} leftIcon={<IconBack />} />
      </View>

      <WebView startInLoadingState={true} style={styles.container} renderLoading={Spinner} source={{ uri }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  } as ViewStyle,
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  } as ViewStyle,

  wrapperHeader: {} as ViewStyle,

  titleText: {
    marginVertical: 5,
    textAlign: 'center',
    fontSize: fonts.size.s20,
    color: colors.gray_900,
    fontFamily: fonts.family.SSPRegular,
  } as TextStyle,
});
