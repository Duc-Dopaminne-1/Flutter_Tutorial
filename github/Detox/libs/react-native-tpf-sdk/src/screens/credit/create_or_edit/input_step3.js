import { useNavigation } from '@react-navigation/native';
import {
  createFinaneDealOrderClear,
  createFinaneDealOrderHandle
} from '../../../redux/actions/credit';
import { getClearAlertError, getShowAlertError } from '../../../redux/actions/system';
import { CREDIT } from '../../../redux/actionsType';
import {
  DynamicInputForm,
  PrimaryButton,
  SecondaryButton,
  WithLoading
} from '../../../components/';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { CUSTOM_COLOR } from '../../../constants/colors';
import { ERROR_PROCESS_AND_TRY } from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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

const InputStep3 = props => {
  const role = useSelector(state => state.auth.role);
  const detailForm = useSelector(state => state.credit.financeDealOrderForm);
  const createOrEditResult = useSelector(state => state.credit.createOrEditResult);
  const { depositMoney } = useSelector(state => state.deposit);
  const navigation = useNavigation();
  const [listComponent, setListComponent] = useState();
  const dispatch = useDispatch();

  const { fonts } = useContext(themeContext) || {};

  useEffect(() => {
    setListComponent(detailForm.productForm?.listComponent?.filter(t => t?.step === 3) || []);
    const focusListener = navigation.addListener('focus', () => {
      dispatch(getClearAlertError());
    });
    return () => {
      focusListener();
    };
  }, [detailForm]);

  useEffect(() => {
    dispatch(createFinaneDealOrderClear());
    if (createOrEditResult?.isSuccess && createOrEditResult.step === 3) {
      if (createOrEditResult.action === 'continue') {
        emitEvent({ event_name: SDK_EVENT_NAME.CREDIT_APPLICATION_CREATE, data: detailForm });
        navigation.navigate(SCREENS_NAME.POLICY_CREDIT_ORDER_SCREEN, {
          form: detailForm
        });
      } else {
        // navigation.goBack();
      }
    } else if (createOrEditResult?.isError) {
      dispatch(getShowAlertError(ERROR_PROCESS_AND_TRY));
    }
  }, [dispatch, navigation, createOrEditResult, detailForm]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onChangeForm = components => {
    setListComponent([...components]);
  };

  const onContinue = useCallback(() => {
    const status =
      role === MEMBER_TYPE.Topener
        ? CREDIT_ORDER_STATUS.WaitingForOperatorAcceptance
        : depositMoney
        ? CREDIT_ORDER_STATUS.WaitingForPayment
        : CREDIT_ORDER_STATUS.WaitingForOperatorAcceptance;

    const step3Component = detailForm.productForm?.listComponent?.filter(t => t?.step === 2) || [];
    const step1Component = detailForm.productForm?.listComponent?.filter(t => t?.step === 1) || [];

    let submitForm = {
      ...detailForm,
      productForm: {
        ...detailForm.productForm,
        listComponent: [...step3Component, ...listComponent, ...step1Component]
      },
      status: status
    };

    dispatch(
      createFinaneDealOrderHandle({
        form: submitForm,
        action: 'continue',
        step: 3
      })
    );
  }, [detailForm, listComponent, dispatch, role]);

  const isFillAll = useEmptyForm(listComponent);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { fontFamily: fonts?.BOLD }]}>
          {detailForm?.ordersItem?.name}
        </Text>
        <ProgressPurchase
          style={styles.progressContainer}
          currentStepIndex={2}
          stepList={[
            'confirm_subscription.step_list_01',
            'confirm_subscription.step_list_02',
            'confirm_subscription.step_list_03'
          ]}
        />

        <View style={styles.formContainer}>
          <DynamicInputForm listComponent={listComponent} onChange={onChangeForm} />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={[styles.flex, { marginRight: SPACING.Medium }]}>
          <SecondaryButton translate title={'common.back'} onPress={goBack} />
        </View>
        <View style={styles.flex}>
          <PrimaryButton
            translate
            title={'common.continue'}
            onPress={onContinue}
            disabled={!isFillAll}
          />
        </View>
      </View>
    </View>
  );
};

export default WithLoading(InputStep3, [
  CREDIT.CREATE_FINANE_DEAL_ORDER.HANDLER,
  CREDIT.GET_FINANCEDEAL_ORDER_FORM.HANDLER
]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: CUSTOM_COLOR.White
  },
  formContainer: {
    marginTop: scale(24),
    marginHorizontal: scale(16)
  },
  title: {
    marginHorizontal: SPACING.Medium,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT.Heading,
    fontSize: FONT_SIZE.Heading,
    color: CUSTOM_COLOR.BlueStone,
    marginTop: scale(24),
    marginBottom: scale(20)
  },
  footer: {
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    borderTopWidth: 1,
    borderColor: CUSTOM_COLOR.GalleryDark,
    flexDirection: 'row'
  },
  flex: {
    flex: 1
  }
});
