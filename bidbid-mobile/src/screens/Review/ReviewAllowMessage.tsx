import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View, Pressable } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import { capitalizeAllWorks } from '@/shared/processing';
import DefaultText from '@/components/CustomText/DefaultText';
import RadioCheckedSVG from '@/components/SVG/RadioCheckedSVG';
import RadioUnCheckSVG from '@/components/SVG/RadioUnCheckSVG';
import { formatNameUser } from '@/shared/discovery';

// flag value
// -1:  Un-Selected
// 0:  NO
// 1:  YES

interface Props {
  reviewObject?: any;
  continueAllowingMessage: number;
  continueAllowingMessageOnPressed?: (flag: number) => void;
}

export default function ReviewAllowMessage(props: Props): ReactElement {
  const { reviewObject, continueAllowingMessage, continueAllowingMessageOnPressed = () => {} } = props;
  const { user: reviewFor = {} } = reviewObject;
  const who = capitalizeAllWorks(formatNameUser(reviewFor) || 'Unknow');

  return (
    <View style={styles.container}>
      <View style={styles.continueAllowingMessageView}>
        <DefaultText {...{ style: styles.textDesc }}>{language('auctionReview.continueAllowingMessage', { who: who })}</DefaultText>
      </View>

      {/* Raido Check View */}
      <View style={styles.radioCheckView}>
        <Pressable style={styles.radioRowView} onPress={() => continueAllowingMessageOnPressed(1)}>
          <View style={styles.radioWrapper}>{continueAllowingMessage === 1 ? <RadioCheckedSVG /> : <RadioUnCheckSVG />}</View>
          <DefaultText {...{ style: styles.text }}>{language('yes')}</DefaultText>
        </Pressable>

        <View style={styles.spaceView} />

        <Pressable style={styles.radioRowView} onPress={() => continueAllowingMessageOnPressed(0)}>
          <View style={styles.radioWrapper}>{continueAllowingMessage === 0 ? <RadioCheckedSVG /> : <RadioUnCheckSVG />}</View>
          <DefaultText {...{ style: styles.text }}>{language('no')}</DefaultText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  } as ViewStyle,

  textDesc: {
    textAlign: 'left',
    marginHorizontal: 10,
    fontSize: fonts.size.s15,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  radioRowView: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  continueAllowingMessageView: {
    padding: 2,
    marginVertical: 5,
    justifyContent: 'flex-start',
  } as ViewStyle,

  radioCheckView: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  radioWrapper: {
    padding: 10,
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  spaceView: {
    width: 30,
  } as ViewStyle,

  text: {
    marginLeft: 5,
    fontSize: fonts.size.s15,
    color: colors.gray_600,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,
});
