import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {GENDER_ARRAY, KEY_BOARD_TYPE, MAX_LENGTH} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import DatePickerSection from '../../../components/Button/DatePickerSection';
import InputSection, {PasswordInputSection} from '../../../components/InputSection';
import RadioSelectionsView, {ITEM_TYPE} from '../../../components/RadioSelectionsView';
import {SizeBox} from '../../../components/SizeBox';
import {AuthScreenConstants} from './AuthScreenContants';
import {InputViewsProps} from './types';

function InputViewInfoAccount({state, validates, dispatch, ...props}: InputViewsProps) {
  const errors = validates.step1;

  return (
    <View style={styles.viewContainer}>
      <View style={styles.viewInputs}>
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
          isShowIcon={true}
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
          error={errors?.inviteCode}
        />
        <InputSection
          headerTitle={translate('signup.info.field.campaignCode')}
          inputStyle={styles.textInput}
          keyboardType={KEY_BOARD_TYPE.DEFAULT}
          value={state.campaignCode}
          onChangeText={props.setCampaignCode}
          placeholder={translate('signup.placeholders.campaignCode')}
          maxLength={MAX_LENGTH.campaignCode}
          error={errors?.campaignCode}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    // flex: 1,
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

export default InputViewInfoAccount;
