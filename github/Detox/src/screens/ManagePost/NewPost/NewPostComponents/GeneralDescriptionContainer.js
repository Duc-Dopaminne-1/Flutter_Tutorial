import isEmpty from 'lodash/isEmpty';
import React, {useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux/lib/hooks/useSelector';

import {isAgent} from '../../../../appData/user/selectors';
import {
  APP_CURRENCY,
  CommissionCurrencyUnit,
  GLOBAL_ACTIONS,
  KEY_BOARD_TYPE,
} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS, normal, small} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CitiesDistrictsWardsStreet from '../../../../components/CitiesDistrictsWardsStreet';
import ImageViewer from '../../../../components/Image/ImageViewer';
import InputSection from '../../../../components/InputSection';
import RequiredLabel from '../../../../components/RequiredLabel';
import {usePhotoViewer} from '../../../../hooks/usePhotoViewer';
import NumberUtils from '../../../../utils/NumberUtils';
import {useMount} from '../../../commonHooks';
import DetailPropertyPostComponent from '../../DetailPropertyPost/DetailPropertyPostComponent';
import PropertyPostUtils, {RENT_PERIOD_LIST} from '../../PropertyPostUtils';
import PropertyType from '../../PropertyType';
import {useGetProjects} from '../../usePropertyPostActions';
import {mappingDetailInfo} from '../NewPostUtils';
import CommissionPieChartContainer from './CommisionPieChartContainer';
import CommissionComponent from './CommissionComponent';
import {NewPostStyles} from './NewPostConstant';
import PriceComponent from './PriceComponent';
import PricePerSquare from './PricePerSquareInput';
import ProjectComponent from './ProjectComponent';
import PropertyTypeComponent from './PropertyTypeComponent';
import RentalTimeComponent from './RentalTimeComponent';

const IMAGE_BANNER = IMAGES.DANGTIN_MOB;
const GeneralDescriptionContainer = ({
  state,
  dispatch,
  masterData,
  errorState,
  showPopup = () => {},
  showCommissionPopup = () => {},
  isTesting = false,
  onPressPolicy,
}) => {
  const bannerViewer = usePhotoViewer();
  const isAgentUser = useSelector(isAgent);

  const onChangeAddress = address => {
    dispatch({type: GLOBAL_ACTIONS.CHANGE_ADDRESS, payload: address});
  };

  const onChangeCoordinateText = text => {
    dispatch({type: GLOBAL_ACTIONS.CHANGE_COORDINATE_TEXT, payload: {coordinateText: text}});
  };

  const onCheckNegotiatePrice = isChecked => {
    dispatch({
      type: GLOBAL_ACTIONS.CHANGE_DATA,
      payload: {negotiable: isChecked},
    });
  };

  const [projects, setProjects] = useState([]);
  const rentalTimeList = useMemo(() => RENT_PERIOD_LIST.map(e => ({...e})), []);

  const onSuccessGetProjects = allProjects => {
    setProjects(allProjects ?? []);
  };
  const onErrorGetProjects = () => {
    setProjects([]);
  };

  const onChangePrice = price => {
    dispatch({
      type: GLOBAL_ACTIONS.CHANGE_PRICE,
      payload: {price: price},
    });
  };

  const onChangeRentPrice = price => {
    dispatch({
      type: GLOBAL_ACTIONS.CHANGE_RENTAL_PRICE,
      payload: {rentPrice: price},
    });
  };

  const onChangeCommission = value => {
    dispatch({
      type: GLOBAL_ACTIONS.SELLING_COMMISSION,
      payload: {commission: value},
    });
  };

  const onChangeRentCommission = value => {
    dispatch({
      type: GLOBAL_ACTIONS.RENTAL_COMMISSION,
      payload: {rentCommission: value},
    });
  };

  const onSelectCommissionType = item => {
    if (!isEmpty(item)) {
      const selected = item[0];
      dispatch({
        type: GLOBAL_ACTIONS.SELLING_COMMISSION,
        payload: {commission: {id: selected.id, value: ''}},
      });
    }
  };

  const onSelectRentCommissionType = item => {
    if (!isEmpty(item)) {
      const selected = item[0];
      dispatch({
        type: GLOBAL_ACTIONS.RENTAL_COMMISSION,
        payload: {rentCommission: {id: selected.id, value: ''}},
      });
    }
  };

  const onSelectPropertyType = item => {
    if (!isEmpty(item)) {
      const updatedDetailInfo = mappingDetailInfo({
        propertyType: item.type || PropertyType.apartment,
        detailInfo: state?.detailInfo,
        masterData,
      });
      dispatch({type: GLOBAL_ACTIONS.CHANGE_PROPERTY_DETAIL, payload: updatedDetailInfo});
      dispatch({
        type: GLOBAL_ACTIONS.CHANGE_PROPERTY_TYPE,
        payload: item,
      });
    }
  };

  const onChangeProject = projectInfo => {
    dispatch({
      type: GLOBAL_ACTIONS.CHANGE_PROJECT,
      payload: projectInfo,
    });
  };

  const onChangeAreaDetail = data => {
    dispatch({type: GLOBAL_ACTIONS.CHANGE_PROPERTY_DETAIL, payload: data});
  };

  const onPressBanner = () => {
    bannerViewer.onPressImage(0);
  };

  const {getAllProjects} = useGetProjects({
    onSuccess: onSuccessGetProjects,
    onError: onErrorGetProjects,
  });

  useEffect(() => {
    getAllProjects(state.freeTextProject, state.propertyTypeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.propertyTypeId]);

  return renderGeneralDescriptionView({
    state,
    errorState,
    dispatch,
    masterData,
    projects,
    rentalTimeList,
    onChangeAddress,
    showPopup,
    onChangeCoordinateText,
    onCheckNegotiatePrice,
    onChangePrice,
    onChangeRentPrice,
    onChangeCommission,
    onChangeRentCommission,
    onChangeAreaDetail,
    onSelectCommissionType,
    onSelectRentCommissionType,
    onSelectPropertyType,
    onChangeProject,
    showCommissionPopup,
    isTesting,
    onPressPolicy,
    onPressBanner,
    bannerViewer,
    isAgentUser,
  });
};

const AreaDetails = ({
  propertyTypeName,
  errors,
  LAND_ACREAGE,
  USAGE_ACREAGE,
  LENGTH,
  WIDTH,
  onDataDetailChange,
  focusedViews,
  setFocusedViews,
}) => {
  const showUsageArea =
    propertyTypeName !== PropertyType.land && propertyTypeName !== PropertyType.apartment;
  const isPropertyApartment = propertyTypeName === PropertyType.apartment;

  const getInputStyle = useMemo(
    () => isFocused => ({
      ...commonStyles.inputBorderWithIcon,
      fontSize: SIZES.FONT_16,
      ...(isFocused && {borderColor: COLORS.PRIMARY_A100}),
    }),
    [],
  );

  const onAreaDetailsChange = item => {
    if (item) {
      const key = Object.keys(item)[0];
      const refreshErrors = {errors, ...{[key]: ''}};
      onDataDetailChange({...item, ...{errors: refreshErrors}});
    }
  };

  return (
    <>
      <View style={HELPERS.fillRowSpaceBetween}>
        <InputSection
          isRequired={true}
          customStyle={HELPERS.fill}
          inputStyle={getInputStyle(focusedViews?.[STRINGS.LAND_ACREAGE])}
          headerStyles={commonStyles.blackTextBold16}
          headerTitle={
            isPropertyApartment
              ? translate('newPost.apartmentAcreage')
              : translate(STRINGS.LAND_ACREAGE)
          }
          placeholder={translate(STRINGS.PLACEHOLDER_ACREAGE)}
          placeHolderColor={COLORS.TEXT_DARK_40}
          onChangeText={text =>
            PropertyPostUtils.onFloatNumberChange(text, STRINGS.LAND_ACREAGE, onAreaDetailsChange)
          }
          value={`${LAND_ACREAGE}`}
          keyboardType={KEY_BOARD_TYPE.FLOAT_NUMBER}
          error={errors?.[STRINGS.LAND_ACREAGE]}
          checkOnlyNumber={true}
          editable={true}
          onFocus={() => setFocusedViews({...focusedViews, [STRINGS.LAND_ACREAGE]: true})}
          onBlur={() => setFocusedViews({...focusedViews, [STRINGS.LAND_ACREAGE]: false})}
        />
        {showUsageArea && (
          <>
            <View style={commonStyles.separatorColumn16} />
            <InputSection
              customStyle={HELPERS.fill}
              inputStyle={getInputStyle(focusedViews?.[STRINGS.USAGE_ACREAGE])}
              headerStyles={commonStyles.blackTextBold16}
              headerTitle={translate(STRINGS.USAGE_ACREAGE)}
              placeholder={translate(STRINGS.PLACEHOLDER_ACREAGE)}
              placeHolderColor={COLORS.TEXT_DARK_40}
              onChangeText={text =>
                PropertyPostUtils.onFloatNumberChange(
                  text,
                  STRINGS.USAGE_ACREAGE,
                  onAreaDetailsChange,
                )
              }
              value={`${USAGE_ACREAGE}`}
              keyboardType={KEY_BOARD_TYPE.FLOAT_NUMBER}
              error={errors?.[STRINGS.USAGE_ACREAGE]}
              checkOnlyNumber={true}
              editable={true}
              onFocus={() => setFocusedViews({...focusedViews, [STRINGS.USAGE_ACREAGE]: true})}
              onBlur={() => setFocusedViews({...focusedViews, [STRINGS.USAGE_ACREAGE]: false})}
            />
          </>
        )}
      </View>
      <View style={{...HELPERS.fillRowSpaceBetween}}>
        <InputSection
          placeholder={translate(STRINGS.PLACEHOLDER_LENGTH)}
          placeHolderColor={COLORS.TEXT_DARK_40}
          customStyle={HELPERS.fill}
          inputStyle={getInputStyle(focusedViews?.[STRINGS.LENGTH])}
          headerStyles={commonStyles.blackTextBold16}
          headerTitle={translate(STRINGS.LENGTH)}
          onChangeText={text =>
            PropertyPostUtils.onFloatNumberChange(text, STRINGS.LENGTH, onAreaDetailsChange)
          }
          value={`${LENGTH}`}
          keyboardType={KEY_BOARD_TYPE.FLOAT_NUMBER}
          error={errors?.[STRINGS.LENGTH]}
          checkOnlyNumber={true}
          editable={true}
          onFocus={() => setFocusedViews({...focusedViews, [STRINGS.LENGTH]: true})}
          onBlur={() => setFocusedViews({...focusedViews, [STRINGS.LENGTH]: false})}
        />
        <View style={commonStyles.separatorColumn16} />
        <InputSection
          placeholder={translate(STRINGS.PLACEHOLDER_WIDTH)}
          placeHolderColor={COLORS.TEXT_DARK_40}
          customStyle={HELPERS.fill}
          inputStyle={getInputStyle(focusedViews?.[STRINGS.WIDTH])}
          headerStyles={commonStyles.blackTextBold16}
          headerTitle={translate(STRINGS.WIDTH)}
          onChangeText={text =>
            PropertyPostUtils.onFloatNumberChange(text, STRINGS.WIDTH, onAreaDetailsChange)
          }
          value={`${WIDTH}`}
          keyboardType={KEY_BOARD_TYPE.FLOAT_NUMBER}
          error={errors?.[STRINGS.WIDTH]}
          checkOnlyNumber={true}
          editable={true}
          onFocus={() => setFocusedViews({...focusedViews, [STRINGS.WIDTH]: true})}
          onBlur={() => setFocusedViews({...focusedViews, [STRINGS.WIDTH]: false})}
        />
      </View>
    </>
  );
};

export const GeneralDescriptionView = ({
  state,
  errorState,
  dispatch,
  masterData,
  projects,
  rentalTimes,
  onChangeAddress,
  showPopup,
  onCheckNegotiatePrice,
  onChangePrice,
  onChangeRentPrice,
  onChangeCommission,
  onChangeRentCommission,
  onChangeAreaDetail,
  onSelectCommissionType,
  onSelectRentCommissionType,
  onSelectPropertyType,
  onChangeCoordinateText,
  onChangeProject,
  showCommissionPopup,
  onPressPolicy,
  onPressBanner,
  bannerViewer,
  isAgentUser,
  isTesting = false,
}) => {
  const [focusedViews, setFocusedViews] = useState({});

  const {
    propertyTypeName,
    commission: {id: commissionTypeId, value: commission},
    price,
  } = state ?? {};

  const {
    errors: detailInfoErrors,
    LAND_ACREAGE = '',
    USAGE_ACREAGE = '',
    LENGTH = '',
    WIDTH = '',
  } = state?.detailInfo ?? {};

  const totalCommission =
    commissionTypeId === CommissionCurrencyUnit.PERCENTAGE
      ? (price * commission) / 100
      : commission;

  return (
    <>
      <TouchableOpacity onPress={onPressBanner}>
        <Image source={IMAGE_BANNER} style={HELPERS.fullWidth} resizeMode="stretch" />
      </TouchableOpacity>
      <View style={styles.viewContainer}>
        <RequiredLabel
          title={translate(STRINGS.BASIC_INFO)}
          titleStyle={NewPostStyles.headerTitle}
          isRequired={false}
        />

        <PropertyTypeComponent
          style={METRICS.smallMarginTop}
          state={state}
          onSelectPropertyType={onSelectPropertyType}
          data={masterData?.propertyTypes}
          error={errorState?.propertyType}
        />

        <ProjectComponent
          projectId={state?.projectId}
          propertyAddress={state?.propertyAddress}
          freeTextProject={state?.freeTextProject}
          projectName={state?.projectInfo?.projectName}
          onChangeProject={onChangeProject}
          data={projects}
          error={errorState?.freeTextProject}
        />
        {!isTesting && (
          <CitiesDistrictsWardsStreet
            colorTheme={COLORS.PRIMARY_A100}
            onChangeAddress={onChangeAddress}
            placeHolderStreetInput={translate(STRINGS.ADDRESS)}
            error={errorState}
            address={state.propertyAddress}
            disabled={false}
            showCoordinateInput
            onChangeCoordinateText={onChangeCoordinateText}
            coordinateText={state.coordinateText}
            customTitleStyle={commonStyles.blackTextBold16}
            styleTextInput={styles.inputWithIcon}
            selectedStyle={commonStyles.blackText16}
            dropdownPlaceHolderStyle={commonStyles.placeholderText16}
          />
        )}
        <AreaDetails
          propertyTypeName={propertyTypeName}
          errors={detailInfoErrors}
          LAND_ACREAGE={LAND_ACREAGE}
          USAGE_ACREAGE={USAGE_ACREAGE}
          LENGTH={LENGTH}
          WIDTH={WIDTH}
          onDataDetailChange={onChangeAreaDetail}
          focusedViews={focusedViews}
          setFocusedViews={setFocusedViews}
        />
        {state?.forSale && (
          <>
            <PriceComponent
              title={translate(STRINGS.PROPERTY_PRICE_VND)}
              value={price}
              error={errorState?.price}
              unitText={APP_CURRENCY}
              negotiable={state?.negotiable}
              onChangePrice={onChangePrice}
              onCheckNegotiatePrice={onCheckNegotiatePrice}
              reverse={true}
            />
            <PricePerSquare price={state?.price} squareLength={state.detailInfo?.LAND_ACREAGE} />
          </>
        )}
        {state?.forRent && (
          <PriceComponent
            title={translate(STRINGS.RENTAL_PRICE_PER_MONTH)}
            placeholder={translate(STRINGS.RENTAL_PRICE_PER_MONTH)}
            value={state.rentPrice}
            error={errorState?.rentPrice}
            unitText={APP_CURRENCY}
            onChangePrice={onChangeRentPrice}
          />
        )}
        <InputSection
          customStyle={{...METRICS.resetMargin}}
          headerTitle={translate('newPost.input.title.commissionTpl')}
          titleDescription={translate('newPost.input.title.commissionTplDescription')}
          titleDescriptionStyle={[commonStyles.placeholderText14, METRICS.smallMarginTop]}
          placeholder={translate('common.unitPrice')}
          headerStyles={commonStyles.blackTextBold16}
          inputContainerStyle={commonStyles.inputBorderWithIcon}
          inputStyle={styles.inputWithRightComponent}
          value={`${(state.commissionTpl * state.price) / 100 || '0'}`}
          keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
          editable={false}
          customRightComponent={
            <View style={styles.inputRightContainer}>
              <Text style={styles.txtInput}>{APP_CURRENCY}</Text>
            </View>
          }
          formatValue={value => NumberUtils.formatNumberToCurrencyNumber(value, 0)}
        />
      </View>

      <View style={styles.commissionViewContainer}>
        {state.forSale && (
          <CommissionComponent
            placeholder="0"
            title={translate('newPost.input.title.commissionShare')}
            titleDescription={translate('newPost.input.title.commissionShareDescription')}
            value={state.commission}
            onChangeCommission={onChangeCommission}
            error={errorState?.commission}
            onSelectType={onSelectCommissionType}
            style={METRICS.smallMarginBottom}
          />
        )}
        {state.forRent && (
          <>
            <CommissionComponent
              title={translate(STRINGS.RENTAL_COMMISSION)}
              value={state.rentCommission}
              onChangeCommission={onChangeRentCommission}
              error={errorState?.rentCommission}
              onSelectType={onSelectRentCommissionType}
              defaultValue={CommissionCurrencyUnit.VND}
            />
            <RentalTimeComponent
              state={state}
              dispatch={dispatch}
              data={rentalTimes}
              error={errorState?.rentPeriod}
            />
          </>
        )}
        <CommissionPieChartContainer
          totalAmount={totalCommission}
          topenlandPercentage={state.commissionTpl}
          buyerPercentage={state.commissionBuyer}
          sellerPercentage={state.commissionSeller}
          onPressConfigurePercentage={showCommissionPopup}
          onPressPolicy={onPressPolicy}
          hideCautionText={isAgentUser}
        />
      </View>
      <View style={styles.viewContainer}>
        <RequiredLabel
          title={translate(STRINGS.DESCRIPTION_INFO)}
          titleStyle={NewPostStyles.headerTitle}
          isRequired={false}
        />
        <DetailPropertyPostComponent state={state} dispatch={dispatch} showPopup={showPopup} />
      </View>

      {isTesting || (
        <ImageViewer
          visible={bannerViewer?.state?.visible}
          images={[{url: '', props: {source: IMAGE_BANNER}}]}
          hideStatusBar={false}
          initialIndex={bannerViewer?.state?.index}
          onDismiss={bannerViewer?.onDismissImageViewer}
          hideShareButton={true}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    padding: normal,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  commissionViewContainer: {
    padding: normal,
    paddingTop: small,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
  },
  inputWithRightComponent: {
    fontSize: SIZES.FONT_16,
    width: '80%',
    height: '100%',
  },
  txtInput: {
    ...commonStyles.txtFontSize16,
    ...FONTS.regular,
    color: COLORS.BLACK_33,
  },
  inputWithIcon: {
    ...commonStyles.inputBorderWithIcon,
    fontSize: SIZES.FONT_16,
  },
  inputRightContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});

const renderGeneralDescriptionView = ({
  state,
  errorState,
  dispatch,
  masterData,
  projects,
  rentalTimeList,
  onChangeAddress,
  showPopup,
  onChangeCoordinateText,
  onCheckNegotiatePrice,
  onChangePrice,
  onChangeRentPrice,
  onChangeCommission,
  onChangeRentCommission,
  onChangeAreaDetail,
  onSelectCommissionType,
  onSelectRentCommissionType,
  onSelectPropertyType,
  onChangeProject,
  showCommissionPopup,
  isTesting,
  onPressPolicy,
  onPressBanner,
  bannerViewer,
  isAgentUser,
}) => {
  return (
    <GeneralDescriptionView
      state={state}
      errorState={errorState}
      dispatch={dispatch}
      masterData={masterData}
      projects={projects}
      rentalTimes={rentalTimeList}
      onChangeAddress={onChangeAddress}
      showPopup={showPopup}
      onChangeCoordinateText={onChangeCoordinateText}
      onCheckNegotiatePrice={onCheckNegotiatePrice}
      onChangePrice={onChangePrice}
      onChangeRentPrice={onChangeRentPrice}
      onChangeCommission={onChangeCommission}
      onChangeRentCommission={onChangeRentCommission}
      onChangeAreaDetail={onChangeAreaDetail}
      onSelectCommissionType={onSelectCommissionType}
      onSelectRentCommissionType={onSelectRentCommissionType}
      onSelectPropertyType={onSelectPropertyType}
      onChangeProject={onChangeProject}
      showCommissionPopup={showCommissionPopup}
      isTesting={isTesting}
      onPressPolicy={onPressPolicy}
      onPressBanner={onPressBanner}
      bannerViewer={bannerViewer}
      isAgentUser={isAgentUser}
    />
  );
};

export default GeneralDescriptionContainer;
