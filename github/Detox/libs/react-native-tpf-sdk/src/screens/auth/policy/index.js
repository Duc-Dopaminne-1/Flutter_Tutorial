import { useNavigation, useRoute } from '@react-navigation/native';
import { topen_fintech } from '../../../assets/images';
import { CheckBox, PrimaryButton, SubHead } from '../../../components/';
import AppText from '../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING, STATUS_BAR_HEIGHT } from '../../../constants/size';
import React, { useCallback, useContext, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const PolicyScreen = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const name = route.params?.name;
  const theme = useContext(themeContext);

  const [isAccept, setIsAccept] = useState(false);
  const [isAcceptAds, setIsAcceptAds] = useState(false);

  const onContinue = useCallback(() => {
    navigation.navigate(SCREENS_NAME.CONGRATULATION_SCREEN, { name });
  }, [navigation]);

  return (
    <View forceInset={{ bottom: 'never' }} style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
        <Image source={topen_fintech} resizeMode="stretch" style={[styles.image]} />
        <Text style={styles.decription}>
          <AppText translate>{'policy_auth.introduce_01'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <AppText translate>{'policy_auth.introduce_02'}</AppText>
        </Text>
        <Text style={[styles.textTitle, { fontFamily: theme?.fonts?.BOLD }]}>
          <AppText translate>{'policy_auth.title_01'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <AppText translate>{'policy_auth.content_01'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <AppText translate>{'policy_auth.content_02'}</AppText>
        </Text>
        <Text style={[styles.textTitle, { fontFamily: theme?.fonts?.BOLD }]}>
          <AppText translate>{'policy_auth.title_02'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <AppText translate>{'policy_auth.content_03'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <AppText translate>{'policy_auth.content_04'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <AppText translate>{'policy_auth.content_05'}</AppText>
        </Text>
      </ScrollView>
      {/*<View style={styles.checkboxAds}>
        <CheckBox
          style={styles.checkBoxView}
          labelNumberLine={2}
          checked={isAcceptAds}
          onChange={setIsAcceptAds}
          labelStyle={styles.label}
          iconStyle={styles.checkBoxIC}
        />
        <View style={styles.textContainer}>
          <AppText>
            <SubHead translate style={[styles.message, { fontFamily: theme?.fonts?.MEDIUM }]}>
              {'policy_auth.confirm_01'}
            </SubHead>{' '}
          </AppText>
        </View>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox
          style={styles.checkBoxView}
          labelNumberLine={2}
          checked={isAccept}
          onChange={setIsAccept}
          labelStyle={[styles.label, { fontFamily: theme?.fonts?.MEDIUM }]}
          iconStyle={styles.checkBoxIC}
        />
        <View style={styles.textContainer}>
          <AppText>
            <SubHead translate style={[styles.message, { fontFamily: theme?.fonts?.MEDIUM }]}>
              {'policy_auth.confirm_02'}
            </SubHead>{' '}
          </AppText>
        </View>
      </View>
      <View style={styles.btnContainer}>
        <PrimaryButton translate disabled={!isAccept} title={'common.begin'} onPress={onContinue} />
      </View>*/}
    </View>
  );
};

export default PolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  image: {
    width: scale(225),
    height: scale(32),
    alignSelf: 'center',
    marginTop: scale(84) - STATUS_BAR_HEIGHT,
    marginBottom: SPACING.XXLarge
  },
  textTitle: {
    marginBottom: SPACING.Large,
    lineHeight: LINE_HEIGHT.BodyText,
    fontSize: FONT_SIZE.BodyText,
    color: CUSTOM_COLOR.BlueStone,
    fontWeight: '700'
  },
  introduce: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.Heading,
    color: CUSTOM_COLOR.GreenBold,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.Large
  },
  wrapper: {
    paddingHorizontal: SPACING.Medium,
    paddingBottom: scale(60),
    marginTop: SPACING.XXLarge
  },
  sttText: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    fontWeight: '700',
    color: CUSTOM_COLOR.BlueStone
  },
  decription: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginBottom: SPACING.Large,
    fontWeight: '400',
    textAlign: 'justify'
  },
  noteText: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.BodyText,
    color: CUSTOM_COLOR.GreenBold,
    textAlign: 'justify'
  },
  label: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: CUSTOM_COLOR.BlueStone
  },
  checkBoxIC: {
    marginTop: scale(4)
  },
  checkboxAds: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.Medium,
    marginTop: scale(5)
  },
  checkboxContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.Fit
  },
  textContainer: {
    flex: 1
  },
  message: {
    marginStart: SPACING.Normal,
    lineHeight: LINE_HEIGHT.SubHead,
    fontSize: FONT_SIZE.BodyText
  },
  policyContainer: {
    marginBottom: scale(-3)
  },
  policy: {
    lineHeight: LINE_HEIGHT.SubHead,
    fontSize: FONT_SIZE.BodyText,
    textDecorationLine: 'underline'
  },
  checkBoxView: {
    paddingBottom: SPACING.Medium,
    alignItems: 'flex-start',
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  btnContainer: {
    marginHorizontal: SPACING.Medium,
    marginTop: scale(24)
  }
});
