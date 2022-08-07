import React, {useContext, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SupportRequestInfoDto} from '../../api/graphql/generated/graphql';
import {AppContext} from '../../appData/appContext/appContext';
import {UNIT_PERCENT} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {normal, small} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import BaseScreen from '../../components/BaseScreen';
import CustomButton from '../../components/Button/CustomButton';
import ModalWithModalize from '../../components/Modal/ModalWithModalize';
import ScrollViewRefresh from '../../components/ScrollViewRefresh';
import {getImageBySizeFromServer, IMAGE_SIZES} from '../../utils/ImageUtil';
import MeasureUtils from '../../utils/MeasureUtils';
import {getTransactionDateTimeString} from '../../utils/TimerCommon';
import {getUserFullName} from '../../utils/UserAgentUtil';
import ScreenIds from '../ScreenIds';
import CancelPopup from './components/CancelPopup';
import ConsultantInfo from './components/ConsultantInfo';
import TimeLine from './components/TimeLine';
import {useGetDetailContactAdvice} from './hooks/useGetDetailContactAdvice';
import {IRequestData} from './type';
import {getDataByStatusName} from './utils/getDataByStatusName';

const PRODUCT_TYPE_PROJECT = 1;
const PRODUCT_TYPE_POST = 2;
const SourceTypeName = {
  TPF: 'TPF',
};

const DetailContactAdviceScreen = ({route, navigation}) => {
  const {id} = route?.params ?? {};
  const {showAppModal, showErrorAlert} = useContext(AppContext);
  const {data, loading, onRefresh}: {data: SupportRequestInfoDto} = useGetDetailContactAdvice(id);
  const cancelModalRef = useRef();

  const requestData: IRequestData = JSON.parse(data?.requestData ?? '{}');

  const lastestDate =
    data?.closeDatetime ||
    data?.completeDatetime ||
    data?.processingDatetime ||
    data?.assignedDatetime ||
    null;
  const disabledCancel =
    getDataByStatusName(data?.supportRequestStatusName).disabledCancel ||
    data?.sourceTypeName === SourceTypeName.TPF;
  const {backgroundColor: statusColor} = getDataByStatusName(data?.supportRequestStatusName);

  const onPressProduct = () => {
    const type = data?.productType;
    const productId = data?.productId;
    if (type === PRODUCT_TYPE_PROJECT) {
      navigation.navigate(ScreenIds.ProjectDetail, {
        projectId: productId,
      });
    } else if (type === PRODUCT_TYPE_POST) {
      navigation.navigate(ScreenIds.ViewPropertyPost, {
        propertyPostId: productId,
        viewByOtherMode: true,
      });
    }
  };

  const onPressCancel = () => {
    cancelModalRef?.current?.open();
  };

  const handleCancelError = () => {
    showErrorAlert(translate(Message.NTW_UNKNOWN_ERROR));
  };

  const handleCancelSuccess = () => {
    cancelModalRef?.current?.close();
    showAppModal({
      isVisible: true,
      title: translate('contactAdvice.detail.cancel'),
      message: translate('contactAdvice.detail.cancelSuccess'),
      okText: translate(STRINGS.CLOSE),
      onOkHandler: () => {
        onRefresh();
      },
    });
  };

  const renderModals = () => {
    return (
      <ModalWithModalize getModalRef={cancelModalRef}>
        <CancelPopup
          supportRequestId={id}
          onSuccess={handleCancelSuccess}
          onError={handleCancelError}
        />
      </ModalWithModalize>
    );
  };

  return (
    <BaseScreen
      testID={ScreenIds.DetailContactAdvice}
      title={translate('contactAdvice.detail.title')}
      modals={renderModals()}>
      <ScrollViewRefresh loading={loading} onRefresh={onRefresh}>
        <View style={styles.container}>
          <TimeLine data={data} />

          {!!data?.assigneeEmail && (
            <>
              <View style={styles.separator} />
              <Text style={styles.section}>
                {translate('contactAdvice.detail.section.consultant')}
              </Text>
              <ConsultantInfo
                fullName={getUserFullName({
                  firstName: data?.assigneeFirstName,
                  lastName: data?.assigneeLastName,
                })}
                phoneNumber={data?.assigneePhoneNumber}
                avatar={getImageBySizeFromServer(
                  data?.assigneeProfilePhotos,
                  IMAGE_SIZES.LARGE,
                  data?.assigneeProfilePhoto,
                )}
                groupName={data?.assigneeStaffGroupDescription}
                rating={data?.assigneeStaffRating}
                navigation={navigation}
              />
            </>
          )}

          <View style={styles.separator} />
          <Text style={styles.section}>
            {translate('contactAdvice.detail.section.requestInfo')}
          </Text>
          <RowItem label={translate('contactAdvice.detail.id')} value={data?.supportRequestCode} />
          <RowItem
            label={translate('contactAdvice.detail.type')}
            value={data?.requestTypeDescription}
          />
          {requestData?.bankCode && (
            <>
              <RowItem
                label={translate('contactAdvice.detail.bank.name')}
                value={requestData.bankCode}
              />
              <RowItem
                label={translate('contactAdvice.detail.bank.amount')}
                value={MeasureUtils.getPriceDescriptionNoUnitInput(requestData.loanAmount)}
              />
              <RowItem
                label={translate('contactAdvice.detail.bank.period')}
                value={`${requestData.loanPeriod} ${translate('common.year')}`}
              />
              <RowItem
                label={translate('contactAdvice.detail.bank.rate')}
                value={requestData.interestRate + UNIT_PERCENT}
              />
            </>
          )}
          <RowItem
            label={translate('contactAdvice.detail.status')}
            value={getDataByStatusName(data?.supportRequestStatusName).description}
            valueStyle={{color: statusColor}}
          />
          <RowItem
            label={translate('contactAdvice.detail.date')}
            value={getTransactionDateTimeString(data?.createdDatetime)}
          />
          {lastestDate && (
            <RowItem
              label={translate('contactAdvice.detail.lastestDate')}
              value={getTransactionDateTimeString(lastestDate)}
            />
          )}

          <View style={styles.separator} />
          <Text style={styles.section}>{translate('contactAdvice.detail.section.content')}</Text>
          <Text style={styles.content}>{data?.requestDescription}</Text>

          <View style={styles.separator} />
          <Text style={styles.section}>
            {translate('contactAdvice.detail.section.releatedProduction')}
          </Text>
          <View style={rowStyles.row}>
            <Text style={rowStyles.label}>{translate('contactAdvice.detail.product')}</Text>
            <TouchableOpacity style={HELPERS.fill} onPress={onPressProduct}>
              <Text style={[rowStyles.value, rowStyles.productValue]} numberOfLines={1}>
                {data?.productName}
              </Text>
            </TouchableOpacity>
          </View>
          {data?.productType === PRODUCT_TYPE_POST && (
            <>
              <RowItem
                label={translate('contactAdvice.detail.agent')}
                value={data?.propertyPostCreatedUserFullName}
              />
              <RowItem
                label={translate('contactAdvice.detail.phone')}
                value={data?.propertyPostCreatedUserPhoneNumber}
              />
              <RowItem
                label={translate('contactAdvice.detail.email')}
                value={data?.propertyPostCreatedUserEmail}
              />
            </>
          )}
        </View>
      </ScrollViewRefresh>
      <View style={commonStyles.footerContainer}>
        <CustomButton
          disabled={disabledCancel}
          style={[
            styles.cancelButton,
            {borderColor: disabledCancel ? COLORS.TEXT_DARK_40 : COLORS.PRIMARY_A100},
          ]}
          titleColor={disabledCancel ? COLORS.TEXT_DARK_40 : COLORS.PRIMARY_A100}
          title={translate('contactAdvice.detail.cancel')}
          onPress={onPressCancel}
        />
      </View>
    </BaseScreen>
  );
};

const RowItem = ({label, value, valueStyle}) => {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={[rowStyles.value, valueStyle]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
};

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: small,
  },
  label: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BRAND_GREY,
    marginRight: small,
  },
  value: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
    textAlign: 'right',
    flex: 1,
  },
  productValue: {
    color: COLORS.PRIMARY_A100,
    marginLeft: normal,
  },
});

export default DetailContactAdviceScreen;

const styles = StyleSheet.create({
  container: {
    padding: normal,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.SEPARATOR_LINE,
    marginVertical: normal,
  },
  section: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.BLACK_31,
    marginBottom: small,
  },
  content: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BLACK_31,
  },
  cancelButton: {
    ...commonStyles.buttonOutline,
    flex: 1,
    borderColor: COLORS.PRIMARY_A100,
  },
});
