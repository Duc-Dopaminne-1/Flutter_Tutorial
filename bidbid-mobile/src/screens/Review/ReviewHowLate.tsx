import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View, Pressable } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import { capitalizeAllWorks } from '@/shared/processing';
import DefaultText from '@/components/CustomText/DefaultText';
import { LateTimeEmum } from './ReviewScreen';
import RadioCheckedSVG from '@/components/SVG/RadioCheckedSVG';
import RadioUnCheckSVG from '@/components/SVG/RadioUnCheckSVG';
import { formatNameUser } from '@/shared/discovery';

// flag value
// -1:  Un-Selected
// 0:  NO
// 1:  YES

interface Props {
  reviewObject?: any;
  lateTimeSelected: string;
  lateTimeSelectedOnPressed?: (value: string) => void;
}

export default function ReviewHowLate(props: Props): ReactElement {
  const { reviewObject, lateTimeSelected, lateTimeSelectedOnPressed = () => {} } = props;
  const { user: reviewFor = {} } = reviewObject;
  const who = capitalizeAllWorks(formatNameUser(reviewFor) || 'Unknow');

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <DefaultText {...{ style: styles.textDesc }}>{language('auctionReview.howLateWereThey', { who: who })}</DefaultText>
      </View>

      {/* Raido Check View */}
      <View style={styles.radioCheckView}>
        <Pressable style={styles.radioRowView} onPress={() => lateTimeSelectedOnPressed(LateTimeEmum.UNDER_15_MIN)}>
          <View style={styles.radioWrapper}>
            {lateTimeSelected === LateTimeEmum.UNDER_15_MIN ? <RadioCheckedSVG /> : <RadioUnCheckSVG />}
          </View>
          <DefaultText {...{ style: styles.text }}>{language('auctionReview.under15Min')}</DefaultText>
        </Pressable>

        <View style={styles.spaceView} />

        <Pressable style={styles.radioRowView} onPress={() => lateTimeSelectedOnPressed(LateTimeEmum.BETWEEN_15_AND_30_MINN)}>
          <View style={styles.radioWrapper}>
            {lateTimeSelected === LateTimeEmum.BETWEEN_15_AND_30_MINN ? <RadioCheckedSVG /> : <RadioUnCheckSVG />}
          </View>
          <DefaultText {...{ style: styles.text }}>{language('auctionReview.between15And30Min')}</DefaultText>
        </Pressable>

        <View style={styles.spaceView} />

        <Pressable style={styles.radioRowView} onPress={() => lateTimeSelectedOnPressed(LateTimeEmum.OVER_30_MIN)}>
          <View style={styles.radioWrapper}>
            {lateTimeSelected === LateTimeEmum.OVER_30_MIN ? <RadioCheckedSVG /> : <RadioUnCheckSVG />}
          </View>
          <DefaultText {...{ style: styles.text }}>{language('auctionReview.over30Min')}</DefaultText>
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
    color: colors.gray_600,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  radioRowView: {
    marginVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  title: {
    justifyContent: 'flex-start',
  } as ViewStyle,

  radioCheckView: {
    marginLeft: 3,
    padding: 5,
    justifyContent: 'center',
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
