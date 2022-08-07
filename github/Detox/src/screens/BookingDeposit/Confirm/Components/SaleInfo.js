import cloneDeep from 'lodash/cloneDeep';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {GLOBAL_ACTIONS, MAX_LENGTH} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS, small} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import {getCities} from '../../../../components/AgentInfoContainer';
import CustomCheckbox from '../../../../components/Checkbox/CustomCheckbox';
import CitiesDistrictsWards from '../../../../components/CitiesDistrictsWards';
import CitiesDistrictsWardsContact from '../../../../components/CitiesDistrictsWardsContact';
import InputSection from '../../../../components/InputSection';
import RequiredLabel from '../../../../components/RequiredLabel';
import PropertyType from '../../../ManagePost/PropertyType';
import PoliciesList from '../../../PropertyChangeConfirm/PoliciesList';
import {ViewInfo} from '../../ConfirmProperty/ConfirmDepositScreen';
import BasicInfo from './BasicInfo';
import IDInfo from './IDInfo';

const PropertyInfo = ({propertyPost}) => {
  const isApartment = propertyPost?.propertyTypeName === PropertyType.apartment;
  const blockTitle = translate(isApartment ? STRINGS.BLOCK : STRINGS.SUB_AREA);
  return (
    <>
      <ViewInfo
        title={translate(STRINGS.PROJECT_NAME)}
        content={propertyPost?.projectName}
        containerStyle={styles.marginBlock}
      />
      <View style={HELPERS.row}>
        <ViewInfo
          title={translate(STRINGS.PRODUCT_CODE)}
          content={propertyPost?.propertyCode}
          containerStyle={styles.propertyCode}
        />
        <View style={styles.blockView}>
          {isApartment && (
            <ViewInfo
              title={translate(STRINGS.FLOOR)}
              content={propertyPost?.floor}
              containerStyle={HELPERS.fill}
            />
          )}
          <ViewInfo
            title={blockTitle}
            content={propertyPost?.blockName}
            containerStyle={{...HELPERS.fill, marginLeft: small}}
          />
        </View>
      </View>
    </>
  );
};

export const SaleInfoContainer = ({
  checkedBuyer,
  onCheckIsBuyer,
  state,
  errors,
  dispatch,
  updateField,
  saleAgentInfo,
  masterData,
  policies,
}) => {
  const [addressCities, setAddressCities] = React.useState([]);
  const [contactCities, setContactCities] = React.useState([]);
  const [isSameAddress, setIsSameAddress] = React.useState(false);
  const {propertyPost} = state;
  function loadCitiesDistricts() {
    if (masterData) {
      setAddressCities(getCities(masterData, state.permanentAddress?.city));
      setContactCities(getCities(masterData, state.contactAddress?.city));
    }
  }

  useEffect(() => {
    loadCitiesDistricts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.isBuyer]);

  const onPressCopyAddress = data => {
    setIsSameAddress(data);
    const listCities = cloneDeep(addressCities);
    setContactCities(listCities);
    dispatch({type: GLOBAL_ACTIONS.SET_COPY_SAME_ADDRESS, payload: state?.permanentAddress});
  };

  const onChangeContactStreet = text => {
    dispatch({type: GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_STREET, payload: text});
  };

  const onChangePermanentStreet = text => {
    dispatch({type: GLOBAL_ACTIONS.SET_ADDRESS_STREET, payload: text});
  };
  return (
    <>
      <PropertyInfo propertyPost={propertyPost} />
      {state?.consultantInfo ? (
        <ViewInfo
          avatar={state?.consultantInfo?.profilePhoto}
          showAvatar
          title={translate(STRINGS.CONSULTANT)}
          content={state?.consultantInfo?.name}
          containerStyle={styles.avatarContainer}
        />
      ) : null}
      <PoliciesList policies={policies} />
      <RequiredLabel
        title={translate(STRINGS.CUSTOMER_INFORMATION)}
        isRequired={false}
        titleStyle={styles.labelAddress}
        style={METRICS.tinyMarginBottom}
      />
      <CustomCheckbox
        parentCheckedValue={checkedBuyer}
        checkValue={onCheckIsBuyer}
        title={translate(STRINGS.IS_BUYER)}
      />
      <View>
        <BasicInfo
          state={state}
          errors={errors}
          updateField={updateField}
          saleAgentInfo={saleAgentInfo}
        />
        <IDInfo
          state={state}
          errors={errors}
          updateField={updateField}
          saleAgentInfo={saleAgentInfo}
        />

        <RequiredLabel
          title={translate(STRINGS.PERMANENT_ADDRESS)}
          titleStyle={styles.labelAddress}
          isRequired={false}
        />
        <CitiesDistrictsWards
          state={state}
          dispatch={dispatch}
          cities={addressCities}
          errors={errors}
        />
        <InputSection
          headerTitle={translate(STRINGS.PERMANENT_ADDRESS_PLACEHOLDER)}
          onChangeText={onChangePermanentStreet}
          customStyle={{...METRICS.marginTop}}
          inputStyle={commonStyles.inputBorder}
          value={state.permanentAddress?.street}
          maxLength={MAX_LENGTH.default}
          error={errors?.errAddress}
          multiline={true}
        />
        <RequiredLabel
          title={translate(STRINGS.CONTACT_ADDRESS)}
          titleStyle={styles.labelAddress}
          isRequired={false}
        />
        <CustomCheckbox
          title={translate('project.confirmTransaction.copyPermanentAddressTitle')}
          onChange={onPressCopyAddress}
        />
        {isSameAddress ? null : (
          <>
            <CitiesDistrictsWardsContact
              state={state}
              dispatch={dispatch}
              cities={contactCities}
              errors={errors}
            />
            <InputSection
              headerTitle={translate(STRINGS.PERMANENT_ADDRESS_PLACEHOLDER)}
              onChangeText={onChangeContactStreet}
              customStyle={{...METRICS.marginTop}}
              inputStyle={commonStyles.inputBorder}
              value={state.contactAddress?.street}
              maxLength={MAX_LENGTH.default}
              error={errors?.errContactAddress}
              multiline={true}
            />
          </>
        )}
      </View>
    </>
  );
};

const SaleInfo = ({
  state,
  updateField,
  errors,
  checkedBuyer,
  onCheckIsBuyer,
  dispatch,
  saleAgentInfo,
  masterData,
  policies,
}) => {
  return (
    <SaleInfoContainer
      policies={policies}
      checkedBuyer={checkedBuyer}
      onCheckIsBuyer={onCheckIsBuyer}
      state={state}
      masterData={masterData}
      dispatch={dispatch}
      errors={errors}
      updateField={updateField}
      saleAgentInfo={saleAgentInfo}
    />
  );
};

export default SaleInfo;

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.MARGIN_16,
  },
  propertyCode: {
    flex: 2,
  },
  blockView: {flex: 2, flexDirection: 'row', marginLeft: small},
  labelAddress: {
    marginTop: SIZES.MARGIN_16,
    fontSize: SIZES.FONT_24,
    ...FONTS.bold,
    color: COLORS.TEXT_DARK_10,
  },
});
