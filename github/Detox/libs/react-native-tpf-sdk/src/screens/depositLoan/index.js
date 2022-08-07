import { useNavigation } from '@react-navigation/native';
import { clearLeadContactForCredit } from '../../redux/actions/credit';
import { ICNext, ICSuccess } from '../../assets/icons';
import { ExpandView, PrimaryButton, TextView } from '../../components/';
import AppText from '../../components/app_text';
import { EVENT_TYPE } from '../../constants/analyticEnums';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { CUSTOM_COLOR, BACKGROUND_COLOR } from '../../constants/colors';
import SCREENS_NAME from '../../constants/screens';
import { SPACING } from '../../constants/size';
import AppsFlyerService from '../../helpers/AppsFlyerService';
import React, { useEffect, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { useDispatch } from 'react-redux';
import { ATTRIBUTE_TYPE } from '../../global/entity_type';
import { scale } from '../../utils/responsive';

const appsFlyerInstance = AppsFlyerService.getInstance();

const DepositLoan = props => {
  const { route } = props;
  const { form, depositMoney } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    dispatch(clearLeadContactForCredit());
    navigation.setOptions({
      hideLeftHeader: true
    });
  }, [dispatch, navigation]);

  useLayoutEffect(() => {
    appsFlyerInstance.logRevenue(EVENT_TYPE.REVENUE, depositMoney);
  }, [depositMoney]);

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.header}>
          <ICSuccess />
        </View>
        <AppText translate bold={true} style={styles.message}>
          {'create_loan_profile.step_finish.title'}
        </AppText>
        <ExpandView
          translateTitle
          style={styles.expandView}
          title={'insurance_record_details.order_infor'}
          canExpand={false}>
          <>
            <TextView
              translate
              title={'profile_info.profile_code'}
              type={'text'}
              value={form?.code || ''}
              style={styles.inputContainer}
            />
            <TextView
              translate
              title={'insurance_screen.products_name'}
              type={ATTRIBUTE_TYPE.text}
              value={form?.ordersItem?.name || ''}
              style={styles.inputContainer}
            />
            <TextView
              translate
              title={'payment_result.supplier'}
              type={'text'}
              placeholder={''}
              value={form?.partnerName || ''}
            />
            <TextView
              translate
              type={ATTRIBUTE_TYPE.price}
              title={'payment_result.value_payment'}
              value={depositMoney || 0}
              suffix={'VND'}
              bold
              style={styles.inputContainer}
            />
            <TouchableOpacity
              style={styles.moreContainer}
              onPress={() =>
                navigation.navigate(SCREENS_NAME.CREDIT_ORDER_DETAIL_SCREEN, {
                  orderId: form.id,
                  item: form
                })
              }>
              <AppText translate bold={true} style={styles.more}>
                {'account_balance.show_detail'}
              </AppText>
              <ICNext color={CUSTOM_COLOR.PersianGreen} />
            </TouchableOpacity>
          </>
        </ExpandView>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          translate
          title={'common.back_to_main_screen'}
          onPress={() => navigation.navigate(SCREENS_NAME.MIDDLEWARE)}
        />
      </View>
    </SafeAreaView>
  );
};

export default DepositLoan;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  header: {
    marginTop: SPACING.Medium * 2,
    marginBottom: SPACING.Medium,
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    color: CUSTOM_COLOR.BlueStone,
    textAlign: 'center',
    marginBottom: scale(16)
  },
  expandView: {
    marginHorizontal: SPACING.Medium,
    marginVertical: SPACING.Normal
  },
  footer: {
    marginHorizontal: SPACING.Medium
  },
  moreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.Medium
  },
  more: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.PersianGreen,
    marginRight: SPACING.Normal
  }
});
