import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import {
  createExtraServiceOrderHandle,
  getAddedOrderFormForCreateClear,
  getAddedOrderFormForCreateHandle
} from '../../../../../redux/actions/extraService';
import { DynamicInputForm, PrimaryButton } from '../../../../../components/';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../../../constants/colors';
import { SPACING } from '../../../../../constants/size';
import { partnerItemSelector } from '../../../../../redux/selectors/partner';
import { EXTRA_SERVICE_ORDER_STATUS } from '../../../../../global/order_status';
import { useEmptyForm } from '../../../../../hooks/useEmptyForm';
import { scale } from '../../../../../utils/responsive';
import { MEMBER_TYPE } from '../../../../../global/member_type';
import { useNavigation } from '@react-navigation/native';
import { store } from '../../../../../redux/store/configureStore';

const FormInput = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { fromCreateLead, productId, setSelectionPopup, setLoading } = props;
  const [listComponent, setListComponent] = useState();
  const [productForm, setProductForm] = useState();
  const profile = useSelector(state => state.member.profile);
  const topenIdProfile = useSelector(state => state.member.topenIdProfile);
  const orderForm = useSelector(state => state.extraService.orderForm);
  const { contactId, leadId } = useSelector(state => state.extraService.orderMemo);
  const memberId = useSelector(state => state.auth.memberId);
  const role = useSelector(state => state.auth.role);

  useEffect(() => {
    dispatch(
      getAddedOrderFormForCreateHandle({
        productId,
        leadId,
        contactId,
        memberId,
        callback: () => setLoading(false)
      })
    );
    return () => {
      dispatch(getAddedOrderFormForCreateClear());
    };
  }, []);

  useEffect(() => {
    setListComponent(orderForm?.contact?.listComponent);
    setProductForm(orderForm?.productForm?.listComponent);
  }, [orderForm]);

  const onChangeValue = components => {
    setListComponent([...components]);
  };
  const onChangeProductForm = components => {
    setProductForm([...components]);
  };
  const createExtraServiceOrder = paymentOption => {
    setLoading(true);
    const partner = partnerItemSelector(store.getState(), orderForm?.partnerId);
    const form = {
      ...orderForm,
      productId,
      paymentOption: paymentOption || orderForm?.paymentOption,
      ...{ ordersItem: { ...orderForm.ordersItem, productId } },
      ...{
        partnerId: orderForm?.partnerId,
        partnerName: partner?.name,
        memberTopener: {
          ...orderForm.memberTopener,
          memberTopenerId: profile?.id,
          memberTopenerLastName: topenIdProfile?.name || profile?.name
        },
        status: EXTRA_SERVICE_ORDER_STATUS.New
      },
      isTopener: role === MEMBER_TYPE.Topener
    };
    const data = {
      ...form,
      contact: { ...orderForm.contact, listComponent, memberId },
      productForm: { listComponent: productForm }
    };
    dispatch(
      createExtraServiceOrderHandle({
        ...data,
        fromCreateLead: fromCreateLead,
        navigation,
        callback: () => setLoading(false)
      })
    );
  };
  const handleConfirmPaymentOption = data => {
    setSelectionPopup({});
    createExtraServiceOrder(data.value);
  };
  const onPressConfirm = () => {
    if (orderForm?.paymentOption === 0) {
      // if product exist two payment options: online & offline
      setSelectionPopup({
        title: 'Chọn sản phẩm/dịch vụ',
        visible: true,
        height: scale(150),
        value: null,
        data: [
          { value: 1, title: 'Thanh toán Online' },
          { value: 2, title: 'Thanh toán OffLine' }
        ],
        onClose: () => setSelectionPopup({}),
        onConfirm: handleConfirmPaymentOption
      });
      return;
    }
    createExtraServiceOrder();
  };

  const isContactFillAll = useEmptyForm(listComponent);

  return (
    <>
      <KeyboardAwareScrollView
        extraHeight={scale(150, false)}
        keyboardOpeningTime={-1}
        enableResetScrollToCoords={false}
        style={styles.scrollViewControl}
        showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <DynamicInputForm listComponent={listComponent || []} onChange={onChangeValue} />
          <DynamicInputForm listComponent={productForm || []} onChange={onChangeProductForm} />
          <PrimaryButton
            style={{ marginTop: scale(30) }}
            translate
            disabled={!isContactFillAll}
            title="support.send_require"
            onPress={onPressConfirm}
          />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default React.memo(FormInput);

const styles = StyleSheet.create({
  headding: {
    textAlign: 'center'
  },
  wrapper: {
    paddingTop: scale(19, false),
    paddingBottom: scale(20),
    paddingHorizontal: scale(15)
  },
  box: {
    backgroundColor: BACKGROUND_COLOR.White
  },
  textTitle: {
    marginTop: scale(16)
    // color: TEXT_COLOR.Primary
  },
  textValue: {
    marginTop: scale(16)
  },
  textInput: {
    paddingTop: scale(2),
    borderBottomWidth: scale(2)
    // borderBottomColor: TEXT_COLOR.Primary
  },
  iconDropdown: {
    position: 'absolute',
    bottom: scale(0),
    right: scale(0),
    padding: scale(10)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  btnCalc: {
    marginTop: scale(16),
    marginBottom: scale(8),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(16)
  },
  textBtnCalc: {
    fontSize: 14,
    color: TEXT_COLOR.White
  },
  banner: {
    marginTop: scale(24)
  },
  imageBanner: {
    height: scale(100),
    width: '100%'
  },
  imgBtnCalc: {
    borderRadius: scale(6)
  },
  leftButton: {
    flex: 1,
    marginRight: SPACING.Normal
  },
  successText: {
    alignSelf: 'center',
    marginTop: SPACING.Medium
  },
  successWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: scale(53, false),
    backgroundColor: BACKGROUND_COLOR.White
  },
  customInputPadding: {
    // paddingTop: SPACING.Medium
  },
  backToHome: {
    paddingHorizontal: SPACING.Medium
  }
});
