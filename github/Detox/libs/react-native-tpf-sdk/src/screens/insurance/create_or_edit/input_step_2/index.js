import { getInsuranceOrderFormForEditHandle } from '../../../../redux/actions/insurance';
import { WORKFLOW } from '../../../../redux/actionsType';
import { PrimaryButton, WithLoading } from '../../../../components/';
import AppText from '../../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import { Shadow } from '../../../../constants/stylesCSS';
import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../../utils/responsive';
import { DynamicViewForm } from '../../../../components/';

import ProgressPurchase from '../../components/progress_purchase';
import SCREENS_NAME from '../../../../constants/screens';
import { isIphoneX } from '../../../../helpers/device';
import SecondaryButton from '../../../../components/secondary_button';
import {
  attributeCopyCode,
  attributesAAACareerCode,
  attributesAAACareerDescCode,
  groupHaveDiffJob,
  groupsCopyCode,
  valuesAAADiffJobCode
} from '../constants';
import { cloneDeep } from 'lodash';

const InsuranceConfirmInfoScreen = props => {
  const {
    navigation,
    route: { params: screenState }
  } = props;
  const memberId = useSelector(state => state.auth.memberId);
  const dispatch = useDispatch();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    dispatch(getInsuranceOrderFormForEditHandle({ orderId: screenState?.data?.id, memberId }));
    const focusListener = navigation.addListener('focus', () => {
      dispatch(getInsuranceOrderFormForEditHandle({ orderId: screenState?.data?.id, memberId }));
    });
    return () => {
      focusListener();
    };
  }, [dispatch, screenState?.data?.id, navigation]);

  const itemDetail = useSelector(state => state.insurance.insuranceOrderFormEdit);
  const insuranceProductDetail = useSelector(state => state?.insurance?.insuranceProductDetail);

  // On Next Button Handle
  const onPress = useCallback(() => {
    navigation.navigate(SCREENS_NAME.INSURANCE_ORDER_INFO_PURCHASE_SCREEN, {
      form: itemDetail,
      productId: screenState?.form?.productId
    });
  }, [itemDetail, navigation, screenState?.form?.productId]);

  const itemDetailProcessed = useMemo(() => {
    let cloneData = cloneDeep(itemDetail);

    cloneData?.productForm?.listComponent?.forEach((item, index) => {
      if (groupHaveDiffJob.includes(item.code)) {
        let isDiffJob = false;
        item?.listAttribute.forEach((attr, idx) => {
          if (attributesAAACareerCode.includes(attr.attributeCode)) {
            attr?.optionData?.forEach((opt, i) => {
              if (opt?.value?.toString() === attr?.value?.toString()) {
                if (valuesAAADiffJobCode.includes(opt?.code)) {
                  isDiffJob = true;
                }
              }
            });
          }
        });
        if (!isDiffJob) {
          item?.listAttribute.forEach((attr, idx) => {
            if (attributesAAACareerDescCode.includes(attr.attributeCode)) {
              cloneData?.productForm?.listComponent[index].listAttribute.splice(idx, 1);
            }
          });
        }
      }
      if (groupsCopyCode.includes(item.code)) {
        item?.listAttribute.forEach((attr, idx) => {
          if (attributeCopyCode.includes(attr.attributeCode)) {
            cloneData?.productForm?.listComponent[index].listAttribute.splice(idx, 1);
          }
        });
      }
      if (item.listAttributeForm) {
        item.listAttributeForm.forEach((v, i) => {
          cloneData?.productForm?.listComponent?.splice(index + 1, 0, {
            ...item,
            listAttribute: v.attributeForm,
            listAttributeForm: null,
            groupId: new Date().getTime() + i
          });
        });
      }
    });
    return cloneData;
  }, [itemDetail]);

  // // Check status of data after call API Create with status Draft
  // const { insuranceCreateOrEditOrderResult } = useSelector(state => state.insurance);
  // useEffect(() => {
  //   if (insuranceCreateOrEditOrderResult?.isSuccess) {
  //     navigation.navigate(SCREENS_NAME.INSURANCE_ORDER_INFO_PURCHASE_SCREEN, {
  //       data: insuranceCreateOrEditOrderResult,
  //       action: screenState?.action,
  //       form: screenState.form
  //     });
  //     dispatch(clearInsuranceOrderResult());
  //     return;
  //   }
  //   if (insuranceCreateOrEditOrderResult?.isError) {
  //     dispatch(getShowAlertError(CREATE_OR_EDIT_INSURANCE_ORDER_ERROR));
  //   }
  //   return () => {
  //     dispatch(clearInsuranceOrderResult());
  //   };
  // }, [
  //   dispatch,
  //   insuranceCreateOrEditOrderResult,
  //   navigation,
  //   screenState?.action,
  //   screenState.productInfo,
  //   screenState.form
  // ]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        extraHeight={80}
        keyboardOpeningTime={-1}
        enableResetScrollToCoords={false}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}>
        <AppText translate bold={true} style={styles.title}>
          {insuranceProductDetail?.name || itemDetail?.ordersItem?.name || ''}
        </AppText>
        <ProgressPurchase
          style={styles.progressContainer}
          currentStepIndex={1}
          stepList={[
            'product_screen.progress_purchase_item_01',
            'product_screen.progress_purchase_item_02',
            screenState?.action === 'update' ? 'common.update' : 'common.payment'
          ]}
        />
        <>
          {/* Input Info Container */}
          <View style={{ marginHorizontal: SPACING.Medium }}>
            <DynamicViewForm listComponent={itemDetail?.contact?.listComponent} />
            <DynamicViewForm listComponent={itemDetailProcessed?.productForm?.listComponent} />
          </View>
        </>
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <View style={[styles.flex, { marginRight: scale(15) }]}>
          <SecondaryButton
            translate
            title={'common.back'}
            style={styles.backButton}
            // titleStyle={styles.backTitle}
            onPress={goBack}
            // backgroundColor={'rgba(240, 140, 49, 0.25)'}
            // backgroundColorDisabled={BACKGROUND_COLOR.Silver}
          />
        </View>
        <View style={styles.flex}>
          <PrimaryButton
            translate
            title={'common.continue_text'}
            style={styles.comparationButton}
            titleStyle={styles.whiteTitle}
            onPress={onPress}
            disabledText={styles.disabledText}
            backgroundColorDisabled={BACKGROUND_COLOR.Silver}
          />
        </View>
      </View>
    </View>
  );
};

export default WithLoading(InsuranceConfirmInfoScreen, [WORKFLOW.GET_NEW_ACTION.HANDLER]);

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    flex: 1
  },
  flex: {
    flex: 1
  },
  list: {
    paddingVertical: SPACING.Large
  },
  title: {
    marginHorizontal: SPACING.Medium,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT.Heading,
    fontSize: FONT_SIZE.Heading
  },
  progressContainer: {
    marginTop: SPACING.Large,
    marginBottom: SPACING.Medium
  },
  footer: {
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    borderTopWidth: 1,
    borderColor: CUSTOM_COLOR.GalleryDark,
    backgroundColor: BACKGROUND_COLOR.White,
    flexDirection: 'row'
  },
  backTitle: {
    color: CUSTOM_COLOR.Orange
  },
  disabledText: {
    color: CUSTOM_COLOR.White
  }
});
