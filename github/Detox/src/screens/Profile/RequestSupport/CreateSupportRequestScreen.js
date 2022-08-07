import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, {useContext, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

import {
  CreateServiceTicketForFrontOfficeResponse,
  TransactionType,
  useCreateServiceTicketMutation,
  useGetC2CPropertyPostByIdPublicLastVersionFoLazyQuery,
  useGetSupportServiceTypesForFrontOfficeLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {getUserId} from '../../../appData/user/selectors';
import {
  FETCH_POLICY,
  ITEM_TYPE,
  MAX_LENGTH,
  TIME_OFFSET_IN_MINUTE,
} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomButton from '../../../components/Button/CustomButton';
import DatePickerSection from '../../../components/Button/DatePickerSection';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import InputSection from '../../../components/InputSection';
import PropertyItemGuarantee from '../../../components/PropertyItem/PropertyItemGuarantee';
import {RequestSupportContext} from '../../../hooks/useRequestSupport';
import NumberUtils from '../../../utils/NumberUtils';
import {getPriceWithCurrency} from '../../../utils/RenderUtil';
import {useMount} from '../../commonHooks';
import {mapPropertyC2CGuarantee} from '../../Home/TopenerOfMonth/types';
import {useFormatPrice} from '../../Home/useFormatPrice';
import AgentInfomation from '../../ManagePost/ReviewPropertyPost/AgentInfomation';
import {usePayWithWebView} from '../../Payment/hooks/usePayWithWebView';
import ScreenIds from '../../ScreenIds';
import {usePaySupportService} from './hooks';
import {GetPaymentInfoInput} from './type';

const SelectDateTime = ({onChangeDateTime, disabled, state}) => {
  const date = moment(state?.appointmentDatetime).format('DD/MM/YYYY');
  const time = moment(state?.appointmentDatetime).format('HH:mm');
  const isIos = Platform.OS === 'ios';
  const display = isIos ? 'inline' : 'default';
  return (
    <>
      <Text style={styles.label}>{'Thời gian hẹn'}</Text>
      <View style={styles.datetimeView}>
        <View style={styles.dateInput}>
          <DatePickerSection
            timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
            isShowLabel={false}
            customButtonStyle={commonStyles.input}
            placeholder={date}
            maximumDate={null}
            disabled={disabled}
            value={state?.appointmentDatetime}
            minimumDate={new Date()}
            pickerMode={'datetime'}
            display={display}
            isShowIcon
            onChosen={dateTime => onChangeDateTime(dateTime)}
          />
        </View>
        <View>
          <DatePickerSection
            isShowLabel={false}
            customButtonStyle={commonStyles.input}
            pickerMode={'datetime'}
            timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
            display={display}
            value={state?.appointmentDatetime}
            disabled={disabled}
            dateOnView={time}
            minimumDate={new Date()}
            maximumDate={null}
            placeholder={time}
            onChosen={dateTime => onChangeDateTime(dateTime)}
          />
        </View>
      </View>
    </>
  );
};

const CreateSupportRequestScreen = ({navigation, route}) => {
  const {propertyPostId} = route?.params ?? {};
  const [types, setTypes] = useState([]);
  const [propertyDetail, setPropertyDetail] = useState(null);
  const {state, setState, resetState} = useContext(RequestSupportContext);
  const isCreate = !isEmpty(state?.consultantInfo) ? true : false;
  const userId = useSelector(getUserId);
  const {formatPrice} = useFormatPrice();
  const {payWithWebView} = usePayWithWebView();

  const {getPayTransactionInfo} = usePaySupportService();

  const payTransaction = ticketId => {
    const info: GetPaymentInfoInput = {
      ticketId: ticketId,
      propertyPostId,
      executorId: state?.consultantInfo?.topenerId,
      userId,
      amount: state.requestType?.price,
      supportTypeId: state.requestType?.id,
    };

    const onSuccessGetPaymentInfo = payTransactionResponse => {
      const onDonePayment = transactionId => {
        navigation.navigate(ScreenIds.SupportRequestPaymentSuccess, {
          transactionId,
          propertyPostId,
        });
      };

      // navigate to payment screen
      payWithWebView({
        payTransactionResponse,
        onPaymentSuccess: onDonePayment,
      });
    };

    // get transaction info before proceed to payment
    getPayTransactionInfo({
      info,
      onSuccess: onSuccessGetPaymentInfo,
    });
  };

  const proceedToPayment = ticketId => {
    navigation.navigate(ScreenIds.CommonSelectPaymentMethod, {
      transactionType: TransactionType.Supportservice,
      price: getPriceWithCurrency(state.requestType?.price),
      onPayByEWallet: () => payTransaction(ticketId),
    });
  };

  const {startApi: getTypes} = useGraphqlApiLazy({
    graphqlApiLazy: useGetSupportServiceTypesForFrontOfficeLazyQuery,
    queryOptions: {},
    dataField: 'getSupportServiceTypesForFrontOffice',
    onSuccess: data => {
      const items = data.requestTypes.map(item => ({
        id: item.requestTypeId,
        key: item.requestTypeName,
        name: item.requestTypeDescription,
        price: item?.price,
      }));
      setTypes(items);
    },
  });

  const {startApi: getPropertyPost} = useGraphqlApiLazy({
    graphqlApiLazy: useGetC2CPropertyPostByIdPublicLastVersionFoLazyQuery,
    queryOptions: {
      variables: {
        propertyPostId,
      },
      ...FETCH_POLICY.NETWORK_ONLY,
    },
    dataField: 'getC2CPropertyPostByIdPublicLastVersionFO',
    onSuccess: response => {
      const data = response.propertyPostDto ?? {};
      const postDetail = mapPropertyC2CGuarantee(data, formatPrice, true);
      setPropertyDetail(postDetail);
    },
  });

  const {startApi: createSupportRequest} = useGraphqlApiLazy({
    graphqlApiLazy: useCreateServiceTicketMutation,
    dataField: 'createServiceTicketForFrontOffice',
    onSuccess: (data: CreateServiceTicketForFrontOfficeResponse) => {
      const ticketId = data?.supportServiceTicketId;
      if (ticketId) {
        proceedToPayment(ticketId);
      }
    },
  });

  // useEffect(() => {
  //   return () => {
  //     resetState();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const onPressNext = () => {
    if (isCreate) {
      createSupportRequest({
        variables: {
          input: {
            appointmentDatetime: moment(state?.appointmentDatetime).valueOf(),
            executorId: state?.consultantInfo?.topenerId,
            propertyPostCode: propertyDetail?.propertyCode,
            propertyPostId,
            supportServiceId: state?.requestType?.id,
            ticketNote: state.note,
          },
        },
      });
    } else {
      navigation.navigate(ScreenIds.SelectTopener, {
        isChangeTopener: false,
        propertyPostId: propertyPostId,
        supportServiceId: state?.requestType?.id,
      });
    }
  };

  useMount(() => {
    getTypes();
    getPropertyPost();
    return () => {
      resetState();
    };
  });

  const changeState = (value, field) => {
    setState({...state, [field]: value});
  };

  const onGoBack = () => {
    navigation.goBack();
  };

  const disableState = isEmpty(state?.requestType)
    ? {
        disableBtn: true,
        style: {...commonStyles.disabledButtonNext, ...METRICS.resetMargin},
      }
    : {
        disableBtn: false,
        style: commonStyles.buttonNext,
      };

  const viewOnly = isEmpty(state?.consultantInfo) ? false : true;

  return (
    <BaseScreen title={translate('supportRequest.create.title')}>
      <ScrollView>
        <View
          style={{
            paddingHorizontal: normal,
            marginBottom: small,
            backgroundColor: COLORS.NEUTRAL_WHITE,
          }}>
          <DropdownWithTitle
            inputStyle={{
              ...styles.dropdown,
              ...{backgroundColor: viewOnly ? COLORS.GRAY_ED : COLORS.NEUTRAL_WHITE},
            }}
            dropdownTitle={translate('supportRequest.dropdownTitle')}
            isSelectSingle={true}
            headerStyles={styles.headerStyles}
            items={types}
            disabled={viewOnly}
            isRequired
            title={translate('supportRequest.create.requestType')}
            onChosen={e => changeState(e, 'requestType')}
          />
          <InputSection
            customStyle={{...METRICS.resetMargin, ...METRICS.smallMarginTop}}
            headerTitle={translate('supportRequest.create.serviceFee')}
            editable={false}
            headerStyles={styles.headerStyles}
            inputContainerStyle={commonStyles.input}
            value={`${state.requestType?.price ?? 0}`}
            customRightComponent={
              <View style={styles.inputRightContainer}>
                <Text style={styles.txtInput}>{'VND'}</Text>
              </View>
            }
            formatValue={value => NumberUtils.formatNumberToCurrencyNumber(value, 0)}
          />
          <SelectDateTime
            state={state}
            disabled={viewOnly}
            onChangeDateTime={e => changeState(e, 'appointmentDatetime')}
          />
          <View style={commonStyles.separatorRow8} />
          <InputSection
            headerTitle={translate(STRINGS.NOTE)}
            headerStyles={commonStyles.blackText14}
            inputStyle={commonStyles.multilineInput}
            value={state.note}
            editable={!viewOnly}
            onChangeText={e => changeState(e, 'note')}
            showMultilineInputView
            showLimitedLength
            maxLength={MAX_LENGTH.NOTE}
          />
        </View>
        {!isEmpty(state?.consultantInfo) && (
          <View
            style={{padding: normal, marginBottom: small, backgroundColor: COLORS.NEUTRAL_WHITE}}>
            <Text style={styles.section}>{translate('supportRequest.executor')}</Text>
            <AgentInfomation
              viewOwner={true}
              navigation={navigation}
              state={state?.consultantInfo}
              showContactButtons={true}
            />
          </View>
        )}
        <View style={{padding: normal, backgroundColor: COLORS.NEUTRAL_WHITE}}>
          <Text style={styles.section}>{translate('supportRequest.create.supportPost')}</Text>
          <PropertyItemGuarantee
            {...propertyDetail}
            showBrokenInfo={false}
            itemType={ITEM_TYPE.full}
            isShowFollowButton={false}
          />
        </View>
      </ScrollView>
      <View style={commonStyles.footerContainer}>
        <CustomButton
          style={{
            ...commonStyles.buttonNext,
            ...HELPERS.fill,
            backgroundColor: COLORS.GRAY_ED,
            marginEnd: normal,
          }}
          onPress={onGoBack}
          titleColor={COLORS.BLACK_33}
          titleStyle={{...FONTS.bold}}
          title={translate('common.abort')}
        />
        <CustomButton
          style={[disableState.style, HELPERS.fill]}
          title={
            isCreate
              ? translate('supportRequest.create.payment')
              : translate('supportRequest.create.next')
          }
          disabled={disableState.disableBtn}
          titleStyle={{...FONTS.bold}}
          onPress={onPressNext}
        />
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    ...commonStyles.dropdownInput,
  },
  label: {
    marginTop: small,
    ...FONTS.regular,
    color: COLORS.BLACK_31,
    fontSize: 14,
  },
  headerStyles: {color: COLORS.BLACK_31, fontSize: 14},
  section: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.BLACK_31,
    marginBottom: small,
  },
  datetimeView: {height: 50, flexDirection: 'row'},
  dateInput: {flex: 1, marginRight: 12},
});

export default CreateSupportRequestScreen;
