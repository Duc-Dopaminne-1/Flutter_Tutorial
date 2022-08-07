import {
  clearInsuranceDetail,
  getInsuranceDetailHandle,
  getInsuranceOrderFormForCreateHandle
} from '../../../redux/actions/insurance';
import { getShowAlertError } from '../../../redux/actions/system';
import { PrimaryButton, WithLoading } from '../../../components/';
import GroupView from '../../../components/dynamic_view_form/group_view';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { REQUIRE_ID, REQUIRE_LOGIN } from '../../../constants/errors';
import { SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import { parseToSelectData } from '../../../helpers/entityData';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MEMBER_TYPE } from '../../../global/member_type';
import { scale } from '../../../utils/responsive';
import { SelectionModal } from '../components/selection_modal_new';
import { partnerItemSelector } from '../../../redux/selectors/partner';
import InfoSection from './sections/info';
import { INSURANCE } from '../../../redux/actionsType';
import SCREENS_NAME from '../../../constants/screens';
import { handleTouch } from '../../../helpers/handleTouch';
import { EVENT_TYPE } from '../../../constants/analyticEnums';
import { isIphoneX } from '../../../helpers/device';
import { useNavigation } from '@react-navigation/native';
import { TpfSdkClient } from '../../../../index';

const InsuranceDetailScreen = props => {
  const {
    route: { params: screenState }
  } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { role, topenId, memberId } = useSelector(state => state?.auth);

  const { leadId, contactId } = useSelector(state => state.insurance);
  useEffect(() => {
    dispatch(getInsuranceDetailHandle({ Id: screenState?.item?.id }));
    return () => {
      dispatch(clearInsuranceDetail());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const insuranceProductDetail = useSelector(state => state?.insurance?.insuranceProductDetail);

  // const workflowData = useSelector(state => state.workflow?.workflowData);

  const onNavigatePurchaseInsurance = useCallback(
    event => {
      handleTouch(event, 'CREATE_INSURANCE', props?.route, topenId, EVENT_TYPE.CREATE_INSURANCE);
      if (role && role === MEMBER_TYPE.Guest) {
        dispatch(getShowAlertError(REQUIRE_LOGIN));
      }

      if (MEMBER_TYPE.Guest !== role) {
        /// TODO
        // if (!profile?.passport && !profile?.idCard) {
        //   dispatch(
        //     getShowAlertError({
        //       ...REQUIRE_ID,
        //       confirmAction: () => navigation.navigate('ProfileScreen')
        //     })
        //   );
        //   return;
        // }

        if (!isEmpty(insuranceProductDetail?.listChildProduct)) {
          onShowSelection();
        } else {
          TpfSdkClient?.requestLogin(SCREENS_NAME.INSURANCE_PURCHASE_SCREEN, null, () =>
            dispatch(
              getInsuranceOrderFormForCreateHandle({
                productId: screenState?.item?.id,
                leadId,
                contactId,
                memberId
              })
            )
          );
        }

        return;
      }
    },
    [
      props?.route,
      topenId,
      role,
      dispatch,
      profile,
      insuranceProductDetail?.listChildProduct,
      navigation,
      screenState?.item?.id,
      leadId,
      contactId
    ]
  );

  const { insuranceOrderFormCreate: insuranceOrderForm } = useSelector(state => state.insurance);
  const { profile, topenIdProfile } = useSelector(state => state.member);
  const partner = useSelector(state => partnerItemSelector(state, screenState?.item?.partnerId));

  useEffect(() => {
    if (insuranceOrderForm?.isSuccess) {
      navigation.navigate(SCREENS_NAME.INSURANCE_PURCHASE_SCREEN, {
        form: {
          ...insuranceOrderForm,
          productId: selectedProduct?.id || screenState?.item?.id,
          ...{
            ordersItem: {
              ...insuranceOrderForm.ordersItem,
              productId: screenState?.item?.id,
              name: insuranceProductDetail?.name,
              price: insuranceProductDetail?.price,
              childrenProductId: selectedProduct?.id,
              childrenSku: selectedProduct?.sku,
              ...(selectedProduct
                ? {
                    productPackage: selectedProduct?.name,
                    price: selectedProduct?.price
                  }
                : {})
            }
          },
          ...{
            partnerId: insuranceProductDetail?.partnerId || screenState?.item?.partnerId,
            partnerName: partner?.name,
            memberTopener: {
              ...insuranceOrderForm.memberTopener,
              memberTopenerId: profile?.id,
              memberTopenerLastName: topenIdProfile?.name || profile?.name
            }
          }
        },
        productInfo: insuranceProductDetail
      });
    }
  }, [
    insuranceOrderForm,
    insuranceProductDetail,
    insuranceProductDetail?.partnerName,
    navigation,
    profile,
    topenIdProfile?.name,
    screenState?.item?.id,
    screenState?.item?.partnerId,
    selectedProduct,
    partner
  ]);

  const [isVisible, setVisible] = useState(false);
  const onShowSelection = () => {
    setVisible(prevState => !prevState);
  };

  const [selectedProduct, setSelectedProduct] = useState();
  const onChangeProduct = useCallback(
    item => {
      setSelectedProduct({ ...item });
      TpfSdkClient?.requestLogin(SCREENS_NAME.INSURANCE_PURCHASE_SCREEN, null, () =>
        dispatch(
          getInsuranceOrderFormForCreateHandle({ productId: item?.id, leadId, contactId, memberId })
        )
      );
    },
    [contactId, dispatch, leadId]
  );
  console.log('insuranceProductDetail?.listChildProduct', insuranceProductDetail?.listChildProduct);
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        style={styles.list}
        contentContainerStyle={styles.wrapper}>
        <InfoSection {...{ item: insuranceProductDetail }} />
        {insuranceProductDetail?.listComponent?.map(component => {
          return (
            <GroupView
              key={'' + component.groupId}
              canExpand={false}
              style={styles.expandGroup}
              {...{
                group: {
                  name: component?.name,
                  eavAttribute: component?.listAttributeDetail
                }
              }}
            />
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          name={'INSURANCE_BUY_BUTTON'}
          route={props?.route}
          translate
          titleStyle={styles.whiteTitle}
          style={styles.comparationButton}
          onPress={onNavigatePurchaseInsurance}
          title={'insurance_record_details.buy_now'}
          backgroundColorDisabled={BACKGROUND_COLOR.Silver}
        />
      </View>
      <SelectionModal
        translate
        isVisible={isVisible}
        onChange={onChangeProduct}
        onChangeVisible={setVisible}
        title={'insurance_record_details.select_product_package'}
        data={parseToSelectData(insuranceProductDetail?.listChildProduct)}
      />
    </>
  );
};

export default WithLoading(InsuranceDetailScreen, [
  INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_CREATE.HANDLER,
  INSURANCE.GET_INSURANCE_DETAIL.HANDLER
]);

const styles = StyleSheet.create({
  footer: {
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    borderTopWidth: 1,
    borderColor: CUSTOM_COLOR.GalleryDark,
    backgroundColor: BACKGROUND_COLOR.White
  },
  wrapper: {
    paddingBottom: SPACING.HtmlBottom
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12)
  },
  totalTitle: {
    lineHeight: LINE_HEIGHT.Heading,
    fontSize: FONT_SIZE.Heading,
    color: CUSTOM_COLOR.BlueStone
  },
  total: {
    lineHeight: LINE_HEIGHT.Heading,
    fontSize: FONT_SIZE.Heading,
    color: CUSTOM_COLOR.BlueStone
  },
  list: {
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  expandGroup: {
    marginVertical: SPACING.Normal
  }
});
