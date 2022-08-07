import { useNavigation } from '@react-navigation/native';
import { clearLeadContactForCredit } from '../../../redux/actions/credit';
import { ICNext, ICSuccess } from '../../../assets/icons';
import { ExpandView, PrimaryButton, TextView } from '../../../components/';
import AppText from '../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { useDispatch } from 'react-redux';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const ConfirmOrder = props => {
  const { route } = props;
  const { form } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const theme = useContext(themeContext);

  useEffect(() => {
    dispatch(clearLeadContactForCredit());
    navigation.setOptions({
      hideLeftHeader: true
    });
  }, [dispatch, navigation]);

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.flex}>
        <View style={styles.header}>
          <ICSuccess />
        </View>
        <AppText translate bold={true} style={styles.message}>
          {'create_loan_profile.create_application_success'}
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
              value={form?.code}
              style={styles.inputContainer}
            />
            <TextView
              translate
              title={'insurance_screen.products_name'}
              type={'text'}
              value={form?.ordersItem?.name}
              style={styles.inputContainer}
            />
            <TextView
              translate
              title={'insurance_screen.supplier'}
              type={'text'}
              value={form?.partnerName}
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
              <AppText
                translate
                bold={true}
                style={[styles.more, { color: theme?.app?.primaryColor1 }]}>
                {'common.view_detail_application'}
              </AppText>
              <ICNext color={theme?.icon?.color1} />
            </TouchableOpacity>
          </>
        </ExpandView>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          translate
          title={'insurance_screen.back_to_product_list'}
          onPress={() => navigation.navigate(SCREENS_NAME.MIDDLEWARE)}
        />
      </View>
    </SafeAreaView>
  );
};

export default ConfirmOrder;

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
    textAlign: 'center',
    marginBottom: scale(25)
  },
  expandView: {
    marginHorizontal: SPACING.Medium,
    marginVertical: SPACING.Normal
  },
  footer: {
    marginHorizontal: SPACING.Medium,
    paddingBottom: SPACING.Medium
  },
  moreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.Medium
  },
  more: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginRight: SPACING.Normal
  }
});
