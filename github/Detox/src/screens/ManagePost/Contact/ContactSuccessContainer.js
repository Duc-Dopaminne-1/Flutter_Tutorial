import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {HOTLINE_NUMBER_FORMAT} from '../../../assets/constants';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';

type ContactSuccessProps = {
  onPressContinue: () => {},
  onPressDetail: () => {},
  showContinueButton: Boolean,
  showDetailButton: Boolean,
  title: String,
  subTitle: String,
  includeHotLine: Boolean,
  continueTitle: String,
  detailButtonTitle: String,
};

export const ContactSuccessContainer = ({
  onPressContinue,
  onPressDetail,
  showContinueButton = true,
  showDetailButton = true,
  title = '',
  subTitle = '',
  includeHotLine = true,
  continueButtonTitle = '',
  detailButtonTitle = '',
}: ContactSuccessProps) => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <MaterialCommunityIcons
          style={styles.icon}
          size={128}
          name="check-bold"
          color={COLORS.PRIMARY_A100}
        />
        <Text style={styles.description}>
          {subTitle}
          {includeHotLine && <Text style={styles.hotline}>{HOTLINE_NUMBER_FORMAT}</Text>}
        </Text>
      </View>
      <View style={styles.buttons}>
        {showContinueButton && (
          <CustomButton
            style={[commonStyles.buttonNextConfirm, HELPERS.fill]}
            titleColor={COLORS.PRIMARY_A100}
            title={continueButtonTitle}
            onPress={onPressContinue}
          />
        )}
        {showDetailButton && (
          <CustomButton
            style={commonStyles.buttonConfirm}
            title={detailButtonTitle}
            onPress={onPressDetail}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    ...FONTS.semiBold,
    fontSize: 21,
    alignSelf: 'center',
    textAlign: 'center',
  },
  icon: {
    alignSelf: 'center',
  },
  description: {
    ...FONTS.regular,
    fontSize: 13,
    color: COLORS.PROJECT_DES,
    marginBottom: 15,
    alignSelf: 'center',
    textAlign: 'center',
  },
  hotline: {
    ...FONTS.bold,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.PRIMARY_A100,
  },
  buttons: {
    flexDirection: 'row',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: normal,
    alignItems: 'center',
  },
});
