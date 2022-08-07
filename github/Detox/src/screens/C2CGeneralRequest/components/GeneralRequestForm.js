import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {GLOBAL_ACTIONS, KEY_BOARD_TYPE} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal, smallNormal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomCheckbox from '../../../components/Checkbox/CustomCheckbox';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import HorizontalList from '../../../components/HorizontalList';
import InputSection from '../../../components/InputSection';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import Places from '../../../components/Place';
import RadioSelectionsView from '../../../components/RadioSelectionsView';
import {RangeInputSelect} from '../../../components/RangeInputSelect';
import RequiredLabel from '../../../components/RequiredLabel';
import {parseStringToJSON} from '../../../utils/StringUtils';
import {getUserFullName} from '../../../utils/UserAgentUtil';
import {aquareArray, ServiceType} from '../constants';
import useGeneralRequest, {GENERAL_REQUEST_ACTION} from '../hooks/useGeneralRequest';
import GeneralRequestBottomView from './GeneralRequestBottomView';
import SearchProjectDropdown from './SearchProjectDropdown';

export const initialState = {
  c2CDemandId: '',
  title: '',
  servicePostType: ServiceType.RENT,
  propertyTypeId: null,
  place: {
    city: null,
    districts: null,
  },
  price: {
    priceRangeFrom: null,
    priceRangeTo: null,
  },
  square: {
    squareRangeFrom: null,
    squareRangeTo: null,
  },
  direction: null,
  propertyLocation: null,
  numberOfBedrooms: 0,
  numberOfBathrooms: 0,
  projectId: null,
  requesterIsBuyer: false,
  requesterFullName: '',
  requesterPhone: '',
  requesterEmail: '',
  tokenCaptcha: '',
};

const mapC2CDemandToState = c2CDemand => {
  let servicePostType = c2CDemand?.forSale ? ServiceType.BUY : ServiceType.RENT;

  const directionJson = c2CDemand?.directionJson ? parseStringToJSON(c2CDemand?.directionJson) : [];

  const directions = directionJson?.map(d => d?.Direction);

  const priceRangeFrom = c2CDemand?.priceRangeDto?.priceFrom;
  const priceRangeTo = c2CDemand?.priceRangeDto?.priceTo;

  if (c2CDemand?.forSale === null) servicePostType = null;
  return {
    c2CDemandId: c2CDemand?.c2CDemandId ?? '',
    title: c2CDemand?.title ?? '',
    servicePostType,
    propertyTypeId: c2CDemand?.propertyTypeId ?? '',
    place: {
      city: {
        id: c2CDemand?.placeDto?.cityId,
        name: c2CDemand?.placeDto?.cityName,
      },
      districts: c2CDemand?.placeDto?.districts?.map(d => ({
        id: d?.districtId,
        name: d?.districtName,
      })),
    },
    price: {
      priceRangeFrom: priceRangeFrom,
      priceRangeTo: priceRangeTo,
    },
    square: {
      squareRangeFrom: c2CDemand?.squareRangeDto?.squareFrom,
      squareRangeTo: c2CDemand?.squareRangeDto?.squareTo,
    },
    direction: directions,
    propertyLocation: c2CDemand?.propertyLocation ?? '',
    numberOfBedrooms: c2CDemand?.numberOfBedrooms ?? 0,
    numberOfBathrooms: c2CDemand?.numberOfBathrooms ?? 0,
    projectId: c2CDemand?.projectId ?? '',
    requesterIsBuyer: c2CDemand?.requesterIsBuyer ?? false,
    requesterFullName: '',
    requesterPhone: '',
    requesterEmail: '',
    tokenCaptcha: '',
  };
};

const GeneralRequestForm = ({isUpdate = false, userInfo, captchaRef, c2CDemand}) => {
  const {
    dispatch,
    state,
    errors,
    onBack,
    onSubmit,
    listPropertyType,
    listServicePostType,
    directions,
    listPriceRange,
    locations,
    listRooms,
    validationOnSubmit,
  } = useGeneralRequest({
    isUpdate,
    initialState: isUpdate ? mapC2CDemandToState(c2CDemand) : initialState,
  });

  const onChangeFieldValue = (value, fieldName) => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName, payload: value});
  };

  const onChangeServicePostType = service => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'servicePostType', payload: service?.id});
  };

  const onChangePropertyTypeId = propertyType => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'propertyTypeId', payload: propertyType?.id});
  };

  const onChangePrice = range => {
    const price = {
      priceRangeTo: range?.[1] ?? 0,
      priceRangeFrom: range?.[0] ?? 0,
    };
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'price', payload: price});
  };

  const onChangeSquare = range => {
    const square = {
      squareRangeTo: range?.[1] ?? 0,
      squareRangeFrom: range?.[0] ?? 0,
    };
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'square', payload: square});
  };

  const onChangeDirection = (list = []) => {
    const ids = list?.map(d => d?.id);
    dispatch({
      type: GLOBAL_ACTIONS.FIELD,
      fieldName: 'direction',
      payload: ids,
    });
  };

  const onRemoveDirection = (ids = []) => {
    dispatch({
      type: GLOBAL_ACTIONS.FIELD,
      fieldName: 'direction',
      payload: ids,
    });
  };

  const onChangeNumberOfBathrooms = value => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'numberOfBathrooms', payload: value?.id});
  };

  const onChangeNumberOfBedrooms = value => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'numberOfBedrooms', payload: value?.id});
  };

  const onChangePropertyLocation = location => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'propertyLocation', payload: location?.id});
  };

  const onChangeProject = project => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'projectId', payload: project?.id});
  };

  const onPressIsMe = value => {
    const {lastName, firstName, phoneNumber, email} = userInfo;
    const fullName = getUserFullName({firstName, lastName});
    if (value) {
      dispatch({
        type: GENERAL_REQUEST_ACTION.CHECK_IS_BUYER,
        payload: {
          requesterFullName: fullName,
          requesterPhone: phoneNumber,
          requesterEmail: email,
        },
      });
    } else {
      dispatch({
        type: GENERAL_REQUEST_ACTION.UNCHECK_IS_BUYER,
      });
    }
  };

  const goBack = () => {
    onBack();
  };

  const onPressSubmit = () => {
    if (validationOnSubmit()) {
      if (isUpdate) {
        onSubmit();
      } else {
        captchaRef?.current?.show(captcha => {
          onSubmit(captcha);
        });
      }
    }
  };

  const lstBathRooms = listRooms.map(r => ({
    ...r,
    checked: r.id === state.numberOfBathrooms ? true : false,
  }));

  const lstBedRooms = listRooms.map(r => ({
    ...r,
    checked: r.id === state.numberOfBedrooms ? true : false,
  }));

  return (
    <View style={[HELPERS.fill, {backgroundColor: COLORS.BACKGROUND}]}>
      <KeyboardScrollView contentStyle={[METRICS.horizontalPadding, METRICS.paddingBottom]}>
        <InputSection
          headerTitle={translate(STRINGS.TITLE)}
          placeholder={translate('c2CGeneralRequest.form.titlePlaceholder')}
          inputStyle={styles.inputContainer}
          value={state.title}
          onChangeText={onChangeFieldValue}
          isRequired={true}
          name="title"
          error={errors?.title}
        />
        <RadioSelectionsView
          headerTitle={translate(STRINGS.TRANSACTION_TYPE)}
          headerStyle={styles.label}
          data={listServicePostType}
          chosenItemId={state.servicePostType}
          onChosen={onChangeServicePostType}
        />
        <DropdownWithTitle
          title={translate('c2CGeneralRequest.form.propertyTypeTitle')}
          style={styles.dropdown}
          inputStyle={commonStyles.dropdownInput}
          dropdownTitle={translate('c2CGeneralRequest.form.propertyTypeDropdownTitle')}
          isSelectSingle={true}
          isRequiredAtLeastOne={false}
          items={listPropertyType}
          onChosen={onChangePropertyTypeId}
          onRemoveItem={() => {}}
        />
        <RequiredLabel
          style={[METRICS.marginTop]}
          title={translate(STRINGS.AREA)}
          titleStyle={{...FONTS.bold, color: COLORS.TEXT_BLACK}}
          isRequired={true}
        />
        <Places
          place={state?.place}
          dispatch={dispatch}
          cities={state?.itemsData?.cities}
          onDuplicateCity={() => {}}
          inputStyle={commonStyles.dropdownInput}
          errors={errors}
          isSingleDistrict
        />
        <RangeInputSelect
          {...listPriceRange}
          placeHolder={[
            translate('c2CGeneralRequest.common.lowest'),
            translate('c2CGeneralRequest.common.highest'),
          ]}
          defaultValue={[state.price?.priceRangeFrom, state.price?.priceRangeTo]}
          onValueChange={onChangePrice}
          title={translate(STRINGS.PRICE_RANGE_OF_INTEREST)}
          isRequired
          error={errors?.price}
        />
        <RangeInputSelect
          arrayRange={aquareArray}
          placeHolder={[
            translate('c2CGeneralRequest.common.lowest'),
            translate('c2CGeneralRequest.common.highest'),
          ]}
          defaultValue={[state.square?.squareRangeFrom, state.square?.squareRangeTo]}
          onValueChange={onChangeSquare}
          title={translate(STRINGS.ACREAGE)}
          isRequired
          error={errors?.square}
        />

        <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          dropdownPlaceHolderStyle={commonStyles.dropdownPlaceHolder}
          style={METRICS.marginTop}
          inputStyle={commonStyles.inputBorderWithIcon}
          headerStyles={[commonStyles.blackTextBold14, METRICS.resetPadding]}
          title={translate(STRINGS.HOUSE_DIRECTION)}
          dropdownTitle={translate(STRINGS.ALL)}
          popupTitle={translate(STRINGS.HOUSE_DIRECTION)}
          items={directions}
          showSearchBox={false}
          onChosen={onChangeDirection}
          onRemoveItem={onRemoveDirection}
          isSelectSingle={false}
          isRequired
        />
        <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          style={METRICS.marginTop}
          inputStyle={commonStyles.inputBorderWithIcon}
          title={translate(STRINGS.LOCATION)}
          placeholder={translate('newPost.locationPlaceholder')}
          headerStyles={[commonStyles.blackTextBold14, METRICS.resetPadding]}
          popupTitle={translate(STRINGS.LOCATION)}
          items={locations}
          showSearchBox={false}
          onChosen={onChangePropertyLocation}
          dropdownPlaceHolderStyle={commonStyles.dropdownPlaceHolder}
        />
        <View style={commonStyles.separatorRow12} />
        <HorizontalList
          titleStyle={styles.titleStyle}
          title={translate(STRINGS.NUMBER_OF_BEDROOM)}
          items={lstBedRooms}
          onSelectedItem={onChangeNumberOfBedrooms}
          showsHorizontalScrollIndicator={false}
        />
        <View style={commonStyles.separatorRow12} />
        <HorizontalList
          titleStyle={styles.titleStyle}
          title={translate(STRINGS.NUMBER_OF_BATHROOM)}
          items={lstBathRooms}
          onSelectedItem={onChangeNumberOfBathrooms}
          showsHorizontalScrollIndicator={false}
        />
        <View style={commonStyles.separatorRow12} />

        <SearchProjectDropdown state={state} onChosen={onChangeProject} />

        <View style={commonStyles.separatorRow12} />
        <View style={commonStyles.separatorRow12} />
        {!isUpdate && (
          <View>
            <Text style={styles.buyerInfoTitle}>{translate(STRINGS.REQUEST_BUYER_INFO)}</Text>
            <CustomCheckbox
              parentCheckedValue={state?.requesterIsBuyer}
              checkValue={onPressIsMe}
              title={translate('c2CGeneralRequest.requesterIsBuyerTitle')}
            />

            <InputSection
              headerTitle={translate('c2CGeneralRequest.form.requesterFullName')}
              placeholder={translate('c2CGeneralRequest.form.enterRequesterFullName')}
              value={state?.requesterFullName}
              onChangeText={onChangeFieldValue}
              inputStyle={styles.inputContainer}
              isRequired={true}
              name="requesterFullName"
              editable={!state?.requesterIsBuyer}
              error={errors?.requesterFullName}
            />
            <InputSection
              headerTitle={translate(STRINGS.PHONE_NUMBER)}
              placeholder={translate(STRINGS.ENTER_PHONE_NUMBER)}
              keyboardType={KEY_BOARD_TYPE.PHONE_NUMBER}
              value={state?.requesterPhone}
              onChangeText={onChangeFieldValue}
              inputStyle={styles.inputContainer}
              isRequired={true}
              name="requesterPhone"
              editable={!state?.requesterIsBuyer}
              error={errors?.requesterPhone}
            />
            <InputSection
              headerTitle={translate(STRINGS.EMAIL)}
              placeholder={translate(STRINGS.FILL_EMAIL)}
              value={state?.requesterEmail}
              keyboardType={KEY_BOARD_TYPE.EMAIL}
              onChangeText={onChangeFieldValue}
              inputStyle={styles.inputContainer}
              name="requesterEmail"
              editable={!state?.requesterIsBuyer}
              error={errors?.requesterEmail}
            />
          </View>
        )}
      </KeyboardScrollView>
      <GeneralRequestBottomView
        state={state}
        isAgree={true}
        onCancel={goBack}
        onConfirm={onPressSubmit}
        isUpdate={isUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.GREY_E4,
    marginTop: smallNormal,
    paddingHorizontal: SIZES.PADDING_8,
    paddingVertical: 0,
  },
  label: {
    ...FONTS.bold,
    color: COLORS.TEXT_BLACK,
    marginTop: SIZES.MARGIN_8,
  },
  dropdown: {
    marginTop: normal,
  },
  titleStyle: {...FONTS.bold, color: COLORS.TEXT_BLACK},
  buyerInfoTitle: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_20,
    color: COLORS.TEXT_BLACK,
    marginVertical: SIZES.MARGIN_8,
  },
});

export default GeneralRequestForm;
