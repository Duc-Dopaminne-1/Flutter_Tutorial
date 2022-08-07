import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {
  CONSTANTS,
  GENDER_ARRAY,
  IDENTIFY_TYPE,
  KEY_BOARD_TYPE,
  MAX_LENGTH,
} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CitiesDistrictsWards from '../../../components/CitiesDistrictsWards';
import CitiesDistrictsWardsContact from '../../../components/CitiesDistrictsWardsContact';
import CustomCheckbox from '../../../components/CustomCheckbox';
import DatePickerSection from '../../../components/DatePickerSection';
import InterestedAreaContainer from '../../../components/DropDown/InterestedAreaContainer';
import ErrorText from '../../../components/ErrorText';
import InputSection, {PasswordInputSection} from '../../../components/InputSection';
import RadioSelectionsView, {ITEM_TYPE} from '../../../components/RadioSelectionsView';
import {SizeBox} from '../../../components/SizeBox';
import RangeSlider2 from '../../../components/Slider/RangeSlider2';
import {ViewInfoIdentify} from '../../BookingDeposit/Confirm/Components/IDInfo';
import InterestedPropertyContainer from '../RegisterAgent/components/InterestedPropertyContainer';
import {AuthScreenConstants} from './AuthScreenContants';
import {InputViewsProps} from './types';

const Section = ({children, isFirst}) => {
  return <View style={styles.section(isFirst)}>{children}</View>;
};

const SubSection = ({children}) => {
  return <View style={styles.subSection}>{children}</View>;
};

function InputViews({state, errors, dispatch, ...props}: InputViewsProps) {
  return (
    <View style={styles.viewContainer}>
      <View style={styles.viewInputs}>
        <Section isFirst>
          <Text style={styles.titleSection}>{translate('signup.info.section.account')}</Text>
          <SizeBox height={8} />
          <InputSection
            isRequired
            headerTitle={translate(STRINGS.YOUR_NAME)}
            inputStyle={styles.textInput}
            value={state.name}
            error={errors?.name}
            onChangeText={props.setName}
            placeholder={translate('signup.placeholders.name')}
          />
          <InputSection
            isRequired
            headerTitle={translate(STRINGS.MIDDLE_AND_LAST_NAME)}
            inputStyle={styles.textInput}
            value={state.middleLastName}
            error={errors?.middleLastName}
            onChangeText={props.setMiddleLastName}
            placeholder={translate('signup.placeholders.middleAndLastName')}
          />
          <InputSection
            isRequired
            headerTitle={translate(STRINGS.PHONE_NUMBER)}
            inputStyle={styles.textInput}
            value={props.mobilePhone}
            editable={false}
            placeholder={translate('signup.placeholders.phoneNumber')}
          />
          <PasswordInputSection
            isRequired
            headerTitle={translate(STRINGS.PASSWORD)}
            inputContainerStyle={styles.textInput}
            value={state.password}
            error={errors?.password}
            onChangeText={props.setPassword}
            placeholder={translate('signup.placeholders.password')}
          />
          <Text style={styles.subInputPassword}>{translate('signup.subInput.password')}</Text>

          <PasswordInputSection
            isRequired
            headerTitle={translate(STRINGS.CONFIRM_PASSWORD)}
            inputContainerStyle={styles.textInput}
            value={state.confirmPassword}
            error={errors?.confirmPassword}
            onChangeText={props.setConfirmPassword}
            placeholder={translate('signup.placeholders.confirmPassword')}
          />
          <InputSection
            isRequired
            headerTitle={translate(STRINGS.EMAIL)}
            inputStyle={styles.textInput}
            keyboardType={KEY_BOARD_TYPE.EMAIL}
            value={state.email}
            error={errors?.email}
            onChangeText={props.setEmail}
            placeholder={translate('signup.placeholders.email')}
          />
          <DatePickerSection
            isRequired
            headerTitle={translate(STRINGS.DAY_OF_BIRTH)}
            headerStyle={styles.label}
            value={state.dob}
            error={errors?.dob}
            onChosen={date => {
              props.setDob(date.toISOString());
            }}
            placeholder={translate('signup.placeholders.birthday')}
          />
          <SizeBox height={10} />
          <RadioSelectionsView
            data={GENDER_ARRAY}
            isRequired
            initValue={state.gender}
            headerTitle={translate('signup.info.field.gender')}
            headerStyle={styles.label}
            type={ITEM_TYPE.DEFAULT}
            onChosen={props.onChangeGender}
          />
          <SizeBox height={10} />
          <InputSection
            headerTitle={translate(STRINGS.INVITE_CODE)}
            inputStyle={styles.textInput}
            keyboardType={KEY_BOARD_TYPE.PHONE_NUMBER}
            value={state.inviteCode}
            editable={isEmpty(props.inviteCodeLink)}
            onChangeText={props.setInviteCode}
            placeholder={translate('signup.placeholders.introducePhoneNumber')}
          />
        </Section>
        <Section>
          <Text style={[styles.titleSection]}>{translate('signup.info.section.topener')}</Text>
          <SubSection>
            <Text style={[styles.titleSubSection]}>
              {translate('signup.info.field.identifyType')}
            </Text>
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
            />
            <ViewInfoIdentify
              issueDate={state.nationalIdIssueDate}
              issuePlace={state.nationalIdIssuePlace}
              errorDate={errors?.errNationalIdIssueDate}
              errorPlace={errors?.errNationalIdIssuePlace}
              updateDate={date => {
                props.onChangeIdentifyDate(date.getTime());
              }}
              updatePlace={text => {
                props.onChangeIdentifyPlace(text);
              }}
            />
          </SubSection>
          <SubSection>
            <Text style={styles.titleSubSection}>
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
            />
          </SubSection>
          <SubSection>
            <Text style={styles.titleSubSection}>
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
        </Section>
        <Section>
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
          <SubSection>
            <Text style={styles.titleSubSection}>
              {translate('signup.info.subSection.interestedPrice')}
            </Text>
            <SizeBox height={16} />
            <RangeSlider2
              isRequired={false}
              showDescription={true}
              values={[state.preferPropertyPriceFrom, state.preferPropertyPriceTo]}
              unit={translate(STRINGS.BILLION)}
              max={CONSTANTS.MAX_PRICE_SLIDER}
              onValuesChangeFinish={props.onPriceInterestedChanged}
              showSlideHeader={false}
            />
          </SubSection>
        </Section>
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
  section: isFirst => ({
    marginTop: isFirst ? 20 : 40,
  }),
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
  textInput: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    paddingLeft: 10,
    borderColor: COLORS.NEUTRAL_BORDER,
  },
  label: {
    ...FONTS.bold,
    color: COLORS.TEXT_DARK_10,
    marginTop: 8,
  },
  subInputPassword: {
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_40,
    marginBottom: 8,
    fontSize: 12,
  },
});

export default InputViews;
