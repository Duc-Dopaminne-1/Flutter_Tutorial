import { useNavigation } from '@react-navigation/native';
import {
  createFinaneDealOrderClear,
  createFinaneDealOrderHandle,
  getCreateDealOrderFormHandle
} from '../../../redux/actions/credit';
import { deleteOrderClear, deleteOrderHandle } from '../../../redux/actions/order';
import { getShowAlertError } from '../../../redux/actions/system';
import { CREDIT } from '../../../redux/actionsType';
import {
  DynamicInputForm,
  PrimaryButton,
  SecondaryButton,
  WithLoading
} from '../../../components/';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import {
  CONFIRM_SAVE_DRAFT_INSURANCE_ORDER,
  ERROR_PROCESS_AND_TRY
} from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SafeAreaView from 'react-native-safe-area-view';
import { useDispatch, useSelector } from 'react-redux';
import { MEMBER_TYPE } from '../../../global/member_type';
import { CREDIT_ORDER_STATUS } from '../../../global/order_status';
import { useEmptyForm } from '../../../hooks/useEmptyForm';
import { scale } from '../../../utils/responsive';
import ProgressPurchase from '../../insurance/components/progress_purchase';
import { isIphoneX } from '../../../helpers/device';
import themeContext from '../../../constants/theme/themeContext';
import { emitEvent } from '../../../utils/eventEmit';
import { SDK_EVENT_NAME } from '../../../global/app';
import {
  ID_ATTRIBUTE_ARISTAS_STATUS,
  ID_GROUP_CUSTOMER_INFO,
  VALUES_HIDE_DEPENDENT_PAY
} from './constants';

const InputStep1 = props => {
  const { route } = props;
  const { leadId, contactId, form, productInfo, orderId, idCardInfo, isMyDeal } = route.params;
  const detailForm = useSelector(state => state.credit.financeDealOrderForm);
  const createOrEditResult = useSelector(state => state.credit.createOrEditResult);
  const memberId = useSelector(state => state.auth.memberId);
  const { depositMoney } = useSelector(state => state.deposit);
  const role = useSelector(state => state.auth.role);
  const [contactInfo, setContactInfo] = useState();
  const [productForm, setProductForm] = useState([]);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { text, fonts } = useContext(themeContext) || {};

  const formData = useMemo(() => {
    return {
      ...detailForm,
      productForm,
      contact: contactInfo
    };
  }, [detailForm, productForm, contactInfo]);

  useEffect(() => {
    dispatch(
      getCreateDealOrderFormHandle({
        leadId,
        contactId,
        orderId,
        idCardInfo,
        productId: productInfo.id,
        memberId,
        isTopener: role === MEMBER_TYPE.Topener ? true : false,
        loanAmount: form?.ordersItem?.loanAmount,
        isMyDeal
      })
    );
  }, [
    dispatch,
    leadId,
    contactId,
    orderId,
    idCardInfo,
    productInfo,
    role,
    memberId,
    form?.ordersItem?.loanAmount
  ]);

  useEffect(() => {
    const step1Component = detailForm.productForm?.listComponent?.filter(t => t?.step === 1);
    setProductForm(step1Component || []);
    setContactInfo(detailForm.contact);
  }, [detailForm]);
  useEffect(() => {
    dispatch(createFinaneDealOrderClear());
    if (createOrEditResult?.isSuccess && createOrEditResult.step === 1) {
      if (createOrEditResult.action === 'continue') {
        navigation.navigate(SCREENS_NAME.CREATE_CREDIT_STEP_2_SCREEN, {
          orderId: createOrEditResult?.orderId
        });
      } else if (createOrEditResult.action === 'back') {
        emitEvent({ event_name: SDK_EVENT_NAME.CREDIT_APPLICATION_CREATE, data: detailForm });
        navigation.goBack();
      }
    } else if (createOrEditResult?.isError) {
      dispatch(getShowAlertError(ERROR_PROCESS_AND_TRY));
    }
  }, [dispatch, navigation, createOrEditResult, detailForm]);

  const onChangeContact = listComponent => {
    setContactInfo({ ...contactInfo, listComponent });
  };
  const onChangeForm = listComponent => {
    setProductForm([...productForm]);
  };
  const onContinue = useCallback(() => {
    let submitForm = {};
    const step3Component = detailForm.productForm?.listComponent?.filter(t => t?.step === 3) || [];
    const step2Component = detailForm.productForm?.listComponent?.filter(t => t?.step === 2) || [];
    if (detailForm?.id > 0) {
      submitForm = {
        ...detailForm,
        contact: contactInfo,
        isMyDeal,
        isTopener: role === MEMBER_TYPE.Topener ? true : false,
        productForm: {
          listComponent: [...productForm, ...step3Component, ...step2Component]
        }
      };
    } else {
      submitForm = {
        ...detailForm,
        ...form,
        memberTopener: { ...detailForm.memberTopener, ...form.memberTopener },
        ordersItem: {
          ...detailForm.ordersItem,
          ...form.ordersItem
        },
        depositValue: depositMoney,
        contact: { ...contactInfo, memberId },
        productForm: {
          listComponent: [...productForm, ...step3Component, ...step2Component]
        },
        status: CREDIT_ORDER_STATUS.Draft,
        isMyDeal,
        depositStatus:
          role === MEMBER_TYPE.Member
            ? depositMoney
              ? 'DepositNotPayment'
              : 'NoDeposit'
            : 'NoDeposit',
        isTopener: role === MEMBER_TYPE.Topener ? true : false
      };
    }
    dispatch(
      createFinaneDealOrderHandle({
        form: submitForm,
        action: 'continue',
        step: 1
      })
    );
  }, [dispatch, contactInfo, detailForm, form, memberId, productForm]);

  const onSave = useCallback(() => {
    let submitForm = {};
    const step3Component = detailForm.productForm?.listComponent?.filter(t => t?.step === 3);
    const step2Component = detailForm.productForm?.listComponent?.filter(t => t?.step === 2);
    if (detailForm?.id > 0) {
      submitForm = {
        ...detailForm,
        contact: contactInfo,
        isMyDeal,
        isTopener: role === MEMBER_TYPE.Topener ? true : false,
        productForm: {
          listComponent: [...productForm, ...step3Component, ...step2Component]
        }
      };
    } else {
      submitForm = {
        ...detailForm,
        ...form,
        memberTopener: { ...detailForm.memberTopener, ...form.memberTopener },
        ordersItem: {
          ...detailForm.ordersItem,
          ...form.ordersItem
        },
        contact: { ...contactInfo, memberId },
        productForm: {
          listComponent: [...productForm, ...step3Component, ...step2Component]
        },
        depositValue: depositMoney,
        status: CREDIT_ORDER_STATUS.Draft,
        depositStatus:
          role === MEMBER_TYPE.Member
            ? depositMoney
              ? 'DepositNotPayment'
              : 'NoDeposit'
            : 'NoDeposit',
        isMyDeal,
        isTopener: role === MEMBER_TYPE.Topener ? true : false
      };
    }
    dispatch(
      createFinaneDealOrderHandle({
        form: submitForm,
        action: 'back',
        step: 1
      })
    );
  }, [contactInfo, detailForm, dispatch, form, memberId, productForm]);

  const onCancel = useCallback(() => {
    if (detailForm?.id) {
      dispatch(deleteOrderHandle({ Id: detailForm?.id }));
    }
    navigation.goBack();
  }, [dispatch, detailForm, navigation]);

  useEffect(() => {
    return () => {
      dispatch(deleteOrderClear({}));
    };
  }, [dispatch]);

  const checkGoback = useCallback(() => {
    if (isContactFillAll01) {
      dispatch(
        getShowAlertError({
          ...CONFIRM_SAVE_DRAFT_INSURANCE_ORDER,
          cancelAction: onCancel,
          confirmAction: onSave
        })
      );
    } else {
      // navigation.goBack();
      onCancel();
    }
  }, [dispatch, isContactFillAll01, onCancel, onSave]);

  useEffect(() => {
    navigation.setOptions({
      backAction: checkGoback
    });
  }, [dispatch, navigation, onCancel, onSave, checkGoback]);

  const isHideDependentPay = useMemo(() => {
    const groupCustomerInfo = productForm?.find(item => ID_GROUP_CUSTOMER_INFO.includes(item.code));
    const attributeAristasStatus = groupCustomerInfo?.listAttribute.find(item =>
      ID_ATTRIBUTE_ARISTAS_STATUS.includes(item.attributeCode)
    );
    const tmp = attributeAristasStatus?.optionData?.find(item => {
      if (
        VALUES_HIDE_DEPENDENT_PAY.includes(item?.code) &&
        attributeAristasStatus?.value?.toString() === item?.value?.toString()
      ) {
        return item;
      }
    });
    if (tmp) {
      return true;
    }
    return false;
  }, [productForm]);

  const isContactFillAll01 = useEmptyForm(contactInfo?.listComponent);
  const isFillProduct = useEmptyForm(productForm, isHideDependentPay);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        extraHeight={80}
        keyboardOpeningTime={-1}
        enableResetScrollToCoords={false}
        contentContainerStyle={styles.wrapper}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: text?.primary, fontFamily: fonts?.BOLD }]}>
          {detailForm?.ordersItem?.name || productInfo?.name}
        </Text>
        <ProgressPurchase
          style={styles.progressContainer}
          currentStepIndex={0}
          stepList={[
            'confirm_subscription.step_list_01',
            'confirm_subscription.step_list_02',
            'confirm_subscription.step_list_03'
          ]}
        />
        <View style={styles.formContainer}>
          <DynamicInputForm listComponent={contactInfo?.listComponent} onChange={onChangeContact} />
        </View>
        <View style={styles.formContainer}>
          <DynamicInputForm
            listComponent={productForm}
            onChange={onChangeForm}
            isHideDependentPay={isHideDependentPay}
            formData={formData}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <View style={[styles.flex, { marginRight: SPACING.Medium }]}>
          <SecondaryButton translate title={'common.back'} onPress={checkGoback} />
        </View>
        <View style={styles.flex}>
          <PrimaryButton
            translate
            disabled={!(isContactFillAll01 && isFillProduct)}
            title={'common.continue'}
            onPress={onContinue}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WithLoading(InputStep1, [
  CREDIT.CREATE_FINANE_DEAL_ORDER.HANDLER,
  CREDIT.GET_CREATE_DEAL_ORDER_FORM.HANDLER
]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: CUSTOM_COLOR.White
  },
  formContainer: {
    marginTop: SPACING.Large
  },
  title: {
    marginHorizontal: SPACING.Medium,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT.Heading,
    fontSize: FONT_SIZE.Heading,
    marginTop: scale(24),
    marginBottom: scale(20)
  },
  footer: {
    ...Shadow,
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    borderTopWidth: 1,
    borderColor: CUSTOM_COLOR.GalleryDark,
    backgroundColor: BACKGROUND_COLOR.White,
    flexDirection: 'row'
  },
  flex: {
    flex: 1
  },
  wrapper: {
    paddingHorizontal: SPACING.Medium,
    paddingBottom: SPACING.HtmlBottom
  }
});
