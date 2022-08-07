import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {CONSTANTS, IDENTIFY_TYPE, KEY_BOARD_TYPE, MAX_LENGTH} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomCheckbox from '../../../components/Checkbox/CustomCheckbox';
import CitiesDistrictsWards from '../../../components/CitiesDistrictsWards';
import CitiesDistrictsWardsContact from '../../../components/CitiesDistrictsWardsContact';
import InterestedAreaContainer from '../../../components/DropDown/InterestedAreaContainer';
import ErrorText from '../../../components/ErrorText';
import InputSection from '../../../components/InputSection';
import RadioSelectionsView, {ITEM_TYPE} from '../../../components/RadioSelectionsView';
import {SizeBox} from '../../../components/SizeBox';
import RangeSlider2 from '../../../components/Slider/RangeSlider2';
import {ViewInfoIdentify} from '../../BookingDeposit/Confirm/Components/IDInfo';
import InterestedPropertyContainer from '../RegisterAgent/components/InterestedPropertyContainer';
import {AuthScreenConstants} from './AuthScreenContants';
import {InputViewsProps} from './types';

const SubSection = ({children}) => {
  return <View style={styles.subSection}>{children}</View>;
};

function InputViewInfoTopener({state, validates, dispatch, ...props}: InputViewsProps) {
  const errors = validates.step2;
  const onFocusField = (fieldName, path, parent) => () => {
    props.onFocusField({fieldName, path: path || fieldName, parent});
  };
  const onBlurField = (fieldName, path, parent) => () => {
    props.onBlurField({fieldName, path: path || fieldName, parent});
  };
  return (
    <View style={styles.viewContainer}>
      <View style={styles.viewInputs}>
        <SubSection>
          <Text style={[styles.titleSection]}>{translate('signup.info.field.identifyType')}</Text>
          <SizeBox height={16} />
          <RadioSelectionsView
            isRequired
            type={ITEM_TYPE.DEFAULT}
            data={IDENTIFY_TYPE}
            initValue={state.nationalIdType}
            onChosen={props.onChangeIdentificationType}
          />
          <InputSection
            isRequired={true}
            headerTitle={translate('common.identifyId')}
            headerStyles={styles.label}
            inputStyle={commonStyles.inputBorder}
            keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
            value={state.nationalId}
            error={errors?.errNationId}
            onChangeText={props.onIdTextChanged}
            placeholder={translate('signup.placeholders.code')}
            onFocus={onFocusField('nationalId')}
            onBlur={onBlurField('nationalId')}
          />
          <ViewInfoIdentify
            issueDate={state.nationalIdIssueDate}
            issuePlace={state.nationalIdIssuePlace}
            errorDate={errors?.errNationalIdIssueDate}
            errorPlace={errors?.errNationalIdIssuePlace}
            updateDate={date => {
              props.onChangeIdentifyDate(date);
            }}
            updatePlace={text => {
              props.onChangeIdentifyPlace(text);
            }}
            onFocusPlace={onFocusField('nationalIdIssuePlace')}
            onBlurPlace={onBlurField('nationalIdIssuePlace')}
          />
        </SubSection>
        <SubSection>
          <Text style={styles.titleSection}>
            {translate('signup.info.subSection.permanentAddress')}
          </Text>
          <CitiesDistrictsWards
            state={state}
            dispatch={dispatch}
            cities={props.addressCities}
            errors={errors}
          />
          <InputSection
            isRequired
            headerTitle={translate(STRINGS.PERMANENT_ADDRESS_PLACEHOLDER)}
            onChangeText={props.onAddressTextChanged}
            customStyle={{...METRICS.marginTop}}
            inputStyle={commonStyles.inputBorder}
            value={state.permanentAddress?.street}
            maxLength={MAX_LENGTH.default}
            error={errors?.errAddress}
            placeholder={translate('common.placeholders.street')}
            onFocus={onFocusField('street', 'permanentAddress.street', 'permanentAddress')}
            onBlur={onBlurField('street', 'permanentAddress.street', 'permanentAddress')}
          />
        </SubSection>
        <SubSection>
          <Text style={styles.titleSection}>
            {translate('signup.info.subSection.contactAddress')}
          </Text>
          <SizeBox height={5} />
          <CustomCheckbox
            images={['checkbox', 'checkbox-blank-outline']}
            customCheckedBox
            parentCheckedValue={state.isSameAddress}
            description={translate('signup.info.field.sameAddress')}
            checkValue={props.onCheckSameAddress}
          />
          {!state.isSameAddress && (
            <>
              <CitiesDistrictsWardsContact
                state={state}
                dispatch={dispatch}
                cities={props.contactCities}
                errors={errors}
              />
              <InputSection
                headerTitle={translate(STRINGS.PERMANENT_ADDRESS_PLACEHOLDER)}
                onChangeText={props.onContactAddressTextChanged}
                customStyle={{...METRICS.marginTop}}
                inputStyle={commonStyles.inputBorder}
                value={state.contactAddress?.street}
                maxLength={MAX_LENGTH.default}
                error={errors?.errContactAddress}
                placeholder={translate('common.placeholders.street')}
              />
            </>
          )}
          <View />
        </SubSection>
        <SizeBox height={30} />
        <Text style={styles.titleSection}>{translate('signup.info.section.interestedArea')}</Text>
        <SizeBox height={5} />
        <Text style={styles.description}>
          {translate('signup.info.field.interestedArea.description')}
        </Text>
        <SubSection>
          <Text style={styles.titleSubSection}>
            {translate('signup.info.subSection.workingArea')}
          </Text>
          <SizeBox height={5} />
          <Text style={styles.description}>
            {translate('signup.info.field.workingArea.description')}
          </Text>
          <SizeBox height={10} />
          <InterestedAreaContainer state={state} dispatch={dispatch} cities={props.areaCities} />
          <ErrorText errorText={errors?.errArea} />
        </SubSection>
        <SubSection>
          <InterestedPropertyContainer
            headerStyle={styles.titleSubSection}
            state={state}
            dispatch={dispatch}
            errorText={errors?.errProperty}
          />
        </SubSection>
        <RangeSlider2
          title={translate('signup.info.subSection.interestedPrice')}
          headerStyle={styles.titleSubSection}
          isRequired={false}
          showDescription={true}
          values={[state.preferPropertyPriceFrom, state.preferPropertyPriceTo]}
          unit={translate(STRINGS.BILLION)}
          max={CONSTANTS.MAX_PRICE_SLIDER}
          onValuesChangeFinish={props.onPriceInterestedChanged}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleSection: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.TEXT_DARK_10,
  },
  titleSubSection: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.TEXT_DARK_10,
  },
  subSection: {
    marginTop: 16,
  },
  description: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_40,
  },
  viewContainer: {
    flex: 1,
  },
  viewInputs: {
    marginRight: AuthScreenConstants.INPUTS_MARGIN_RIGHT,
    paddingTop: 0,
  },
  label: {
    ...FONTS.bold,
    color: COLORS.TEXT_DARK_10,
    marginTop: 8,
  },
});

export default InputViewInfoTopener;
