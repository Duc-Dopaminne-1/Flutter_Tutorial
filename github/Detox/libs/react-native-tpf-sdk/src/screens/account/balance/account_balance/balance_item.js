import { useNavigation } from '@react-navigation/native';
import { ICGreenQuestion, ICNextGreen02 } from '../../../../assets/icons';
import AppText from '../../../../components/app_text';
import PrimaryButton from '../../../../components/primary_button';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import SCREENS_NAME from '../../../../constants/screens';
import { BORDER_RADIUS, ICON_SIZE, SPACING } from '../../../../constants/size';
import React, { useCallback, useContext } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from '../../../../utils/responsive';
import themeContext from '../../../../constants/theme/themeContext';

const BalanceItem = props => {
  const { fonts, text, app, icon: iconTheme, button: buttonTheme } = useContext(themeContext) || {};
  const navigation = useNavigation();
  const {
    title,
    balance,
    buttonLabel,
    onPressBtn,
    icon,
    hasWithdrawalRequest,
    hasAdvanceRequest,
    availableBalance,
    creditBalance,
    disabled,
    transactionTab,
    onPressHelpBox
  } = props;
  const button = React.useRef(null);

  const onPress = useCallback(() => {
    button.current.measure((fx, fy, width, height, px, py) => {
      onPressHelpBox && onPressHelpBox(transactionTab, height, py);
    });
  }, [onPressHelpBox, transactionTab]);

  const onTransactionHistory = () => {
    navigation.navigate(SCREENS_NAME.TRANSACTION_HISTORY, {
      mainTab: 1,
      transactionTab
    });
  };

  return (
    <View style={styles.accountBalance}>
      <TouchableOpacity style={styles.iconContainer} onPress={onTransactionHistory}>
        {icon}
      </TouchableOpacity>
      <View style={styles.balances}>
        <View style={styles.rowContainer}>
          <TouchableOpacity onPress={onTransactionHistory}>
            <AppText translate medium style={[styles.accountTitle, { color: text?.secondary }]}>
              {title}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity ref={button} onPress={onPress}>
            <ICGreenQuestion color1={text?.secondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onTransactionHistory}>
          <Text style={[styles.balance, { fontFamily: fonts?.SEMIBOLD }]}>{balance}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.showDetailBtn} onPress={onTransactionHistory}>
          <AppText translate semiBold style={[styles.detailTxt, { color: app?.primaryColor1 }]}>
            account_balance.show_detail
          </AppText>
          <ICNextGreen02
            height={ICON_SIZE.TINY}
            width={ICON_SIZE.TINY}
            color1={app?.primaryColor1}
          />
        </TouchableOpacity>
      </View>
      <PrimaryButton
        translate
        title={buttonLabel}
        onPress={onPressBtn}
        style={styles.button}
        backgroundColor={buttonTheme.primary.background}
        titleStyle={[styles.titleBtn, { color: buttonTheme.primary.textColor }]}
        disabled={
          hasWithdrawalRequest ||
          availableBalance <= 0 ||
          hasAdvanceRequest ||
          disabled ||
          creditBalance <= 0
            ? true
            : false
        }
      />
    </View>
  );
};
export default React.memo(BalanceItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  wrapper: {
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  contentWrapper: {
    paddingBottom: SPACING.HasBottomButton
  },
  iconContainer: {
    width: scale(48),
    justifyContent: 'center',
    alignItems: 'center'
  },
  accountBalance: {
    backgroundColor: 'white',
    paddingHorizontal: SPACING.XXNormal,
    paddingTop: SPACING.XNormal,
    paddingBottom: SPACING.Normal,
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS,
    borderWidth: scale(1),
    borderColor: CUSTOM_COLOR.GreyDivider,
    alignItems: 'center',
    marginTop: SPACING.Medium
  },
  accountTitle: {
    fontSize: FONT_SIZE.Small,
    marginRight: SPACING.Small
  },
  balance: {
    marginTop: SPACING.Fit,
    marginBottom: SPACING.XSmall,
    color: CUSTOM_COLOR.BlueStone,
    fontSize: FONT_SIZE.BodyText
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    height: scale(32, false),
    width: scale(121)
  },
  balances: {
    flex: 1,
    marginLeft: scale(12),
    marginTop: SPACING.XSmall
  },
  titleBtn: {
    fontSize: FONT_SIZE.SubHead,
    paddingBottom: Platform.OS === 'android' ? SPACING.Tiny : null,
    paddingTop: Platform.OS === 'ios' ? scale(2) : null
  },
  detailTxt: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginRight: scale(6)
  },
  showDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
