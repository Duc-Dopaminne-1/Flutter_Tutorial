import React, { ReactElement, useState } from 'react';
import { StyleSheet, ViewStyle, View, TextStyle, Pressable } from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { SafeArea } from '@/components/SafeArea';
import DefaultText from '@/components/CustomText/DefaultText';
import QRCode from 'react-native-qrcode-svg';
import { GlobalProps } from '@/shared/Interface';
import IconBack from '@/components/SVG/BackSvg';
import IconRectangleBorderSVG from '@/components/SVG/IconRectangleBorderSVG';
import IconCircleCloseSVG from '@/components/SVG/IconCircleCloseSVG';

export default function ShowQRCodeScreen(props: GlobalProps): ReactElement {
  const [displayDescView, setDisplayDescView] = useState(true);
  const auction = props.route.params ? props.route.params?.auction : { id: '' };
  const display = displayDescView ? 'flex' : 'none';

  return (
    <View style={styles.root}>
      <SafeArea />
      <View style={styles.wrapperHeader}>
        <CustomHeader titleStyle={styles.titleText} title={language('qrCodeScreen.showQRtitle')} leftIcon={<IconBack />} />
      </View>
      <View style={styles.container}>
        <View style={styles.qrCodeWrapper}>
          <View style={styles.reactangleBorderWrapper}>
            <IconRectangleBorderSVG />
          </View>
          <QRCode value={auction.id} size={120} />
        </View>

        <View style={[styles.descriptionView, { display: display }]}>
          <View style={styles.textWrapper}>
            <DefaultText {...{ style: styles.textType }}>{language('qrCodeScreen.bidderShowQRCode')}</DefaultText>
          </View>

          <Pressable
            style={styles.iconCircleCloseWrapper}
            onPress={() => {
              setDisplayDescView(false);
            }}
          >
            <IconCircleCloseSVG />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.gray_600_alpha,
  } as ViewStyle,

  container: {
    flex: 1,
  } as ViewStyle,

  wrapperHeader: {} as ViewStyle,

  titleText: {
    marginVertical: 5,
    textAlign: 'center',
    fontSize: fonts.size.s20,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  } as TextStyle,

  textType: {
    fontSize: fonts.size.s14,
    color: colors.white,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  reactangleBorderWrapper: {
    position: 'absolute',
    alignSelf: 'center',
  } as ViewStyle,

  qrCodeWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    width: 250,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 14,
    marginTop: 50,
  } as ViewStyle,

  descriptionView: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: 250,
    borderRadius: 12,
    backgroundColor: colors.red_400,
    marginTop: 30,
  } as ViewStyle,

  textWrapper: {
    flex: 1,
    marginRight: 15,
  } as ViewStyle,

  iconCircleCloseWrapper: {
    width: 50,
    alignItems: 'center',
  } as ViewStyle,
});
