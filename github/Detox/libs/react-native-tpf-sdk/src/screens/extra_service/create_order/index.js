import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getExtraServiceOrderFormClear,
  getExtraServiceOrderFormHandle
} from '../../../redux/actions/extraService';
import { EXTRA_SERVICE } from '../../../redux/actionsType';
import {
  BecomeTopener,
  DynamicInputForm,
  Heading,
  PrimaryButton,
  SecondaryButton,
  WithLoading
} from '../../../components/';
import { FONT_FAMILY } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { partnerItemSelector } from '../../../redux/selectors/partner';
import { EXTRA_SERVICE_ORDER_STATUS } from '../../../global/order_status';
import { useEmptyForm } from '../../../hooks/useEmptyForm';
import { scale } from '../../../utils/responsive';
import { isIphoneX } from '../../../helpers/device';
import { MEMBER_TYPE } from '../../../global/member_type';
import { getBecomeTopenerHandle } from '../../../redux/actions/masterData';

const CreateOrder = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { id, name, partnerId } = route.params;
  const [listComponent, setListComponent] = React.useState();
  const profile = useSelector(state => state.member.profile);
  const topenIdProfile = useSelector(state => state.member.topenIdProfile);
  const orderForm = useSelector(state => state.extraService.orderForm);
  ///const detailItem = useSelector(state => state.extraService.detail);
  const { contactId, leadId } = useSelector(state => state.extraService.orderMemo);
  const memberId = useSelector(state => state.auth.memberId);
  const partner = useSelector(state => partnerItemSelector(state, partnerId));
  const role = useSelector(state => state.auth.role);

  useEffect(() => {
    dispatch(getExtraServiceOrderFormHandle({ productId: id, leadId, contactId }));
    return () => {
      dispatch(getExtraServiceOrderFormClear());
    };
  }, [dispatch, leadId, contactId, id]);

  useEffect(() => {
    setListComponent(orderForm?.contact?.listComponent);
  }, [orderForm]);

  useEffect(() => {
    navigation.setOptions({
      backAction: goBackProductList
    });
  }, [goBackProductList, navigation]);

  useEffect(() => {
    dispatch(getBecomeTopenerHandle());
  }, [dispatch]);

  const goBackProductList = useCallback(() => {
    navigation.navigate(SCREENS_NAME.EXTRA_SERVICE_LIST_SCREEN);
  }, [navigation]);

  const onPressCancel = () => {
    navigation.goBack();
  };

  const onChangeValue = components => {
    setListComponent([...components]);
  };

  const onPressConfirm = () => {
    const form = {
      ...orderForm,
      ...{ ordersItem: { ...orderForm.ordersItem, productId: id } },
      ...{
        partnerId: partnerId,
        partnerName: partner?.name,
        memberTopener: {
          ...orderForm.memberTopener,
          memberTopenerId: profile?.id,
          memberTopenerLastName: topenIdProfile?.name || profile?.name
        },
        status: EXTRA_SERVICE_ORDER_STATUS.New
      },
      isTopener: role === MEMBER_TYPE.Topener,
      productId: id
    };
    const data = {
      ...form,
      contact: { ...orderForm.contact, listComponent, memberId }
    };
    navigation.navigate(SCREENS_NAME.EXTRA_SERVICE_POLICY_ORDER_SCREEN, {
      data: data,
      name,
      id
    });
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
          <Heading style={styles.headding}>{name}</Heading>
          <View style={styles.container}>
            <DynamicInputForm listComponent={listComponent || []} onChange={onChangeValue} />
          </View>
          <BecomeTopener />
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <SecondaryButton
          translate
          style={styles.leftButton}
          title={'common.cancel_02'}
          onPress={onPressCancel}
        />
        <PrimaryButton
          translate
          disabled={!isContactFillAll}
          style={styles.rightButton}
          title={'common.confirm'}
          onPress={onPressConfirm}
        />
      </View>
    </>
  );
};

export default WithLoading(CreateOrder, [
  EXTRA_SERVICE.CREATE_ORDER.HANDLER,
  EXTRA_SERVICE.GET_ORDER_FORM.HANDLER
]);

const styles = StyleSheet.create({
  headding: {
    textAlign: 'center'
  },
  scrollViewControl: {
    backgroundColor: BACKGROUND_COLOR.White
  },
  wrapper: {
    flex: 1,
    paddingTop: scale(19, false),
    backgroundColor: BACKGROUND_COLOR.White,
    paddingBottom: scale(100)
  },
  container: {
    marginHorizontal: SPACING.Medium,
    marginTop: scale(24),
    marginBottom: scale(24),
    borderRadius: BORDER_RADIUS,
    backgroundColor: BACKGROUND_COLOR.Primary
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
  footer: {
    flexDirection: 'row',
    backgroundColor: BACKGROUND_COLOR.White,
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    borderTopWidth: 1,
    borderColor: CUSTOM_COLOR.GalleryDark,
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  leftButton: {
    flex: 1,
    marginRight: SPACING.Normal
  },
  rightButton: {
    flex: 1,
    marginLeft: SPACING.Normal
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
