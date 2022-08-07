import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';

import {
  GENDER_ARRAY,
  IDENTIFY_TYPE,
  KEY_BOARD_TYPE,
  MAX_LENGTH,
} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {HELPERS} from '../../../../assets/theme/helpers';
import {normal, small} from '../../../../assets/theme/metric';
import DatePickerSection from '../../../../components/Button/DatePickerSection';
import InputSection from '../../../../components/InputSection';
import RadioSelectionsView, {ITEM_TYPE} from '../../../../components/RadioSelectionsView';
import NumberUtils from '../../../../utils/NumberUtils';
import {BookingContext} from '../../useBooking';

const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
});

const BasicInfo = ({state, errors, updateField}) => {
  const {state: bookingState, setState} = useContext(BookingContext);
  return (
    <>
      <InputSection
        headerTitle={translate(STRINGS.CUSTOMER_FULLNAME)}
        placeholder={translate(STRINGS.CUSTOMER_FULLNAME)}
        value={state?.customerFullName}
        onChangeText={text => {
          setState({...bookingState, customerFullName: text});
          updateField && updateField('customerFullName', text);
        }}
        inputStyle={styles.inputStyle}
        isRequired={true}
        error={errors?.customerFullName}
      />

      <InputSection
        headerTitle={translate(STRINGS.PHONE_NUMBER)}
        placeholder={translate(STRINGS.PHONE_NUMBER)}
        keyboardType={KEY_BOARD_TYPE.PHONE_NUMBER}
        value={state?.customerPhone}
        onChangeText={text => {
          if (NumberUtils.isValidIntNumber(text, MAX_LENGTH.phoneNumber)) {
            setState({...bookingState, customerPhone: text});
            updateField && updateField('customerPhone', text);
          }
        }}
        inputStyle={styles.inputStyle}
        isRequired={true}
        error={errors?.customerPhone}
      />

      <InputSection
        headerTitle={translate(STRINGS.EMAIL)}
        placeholder={translate(STRINGS.EMAIL)}
        value={state?.customerEmail}
        keyboardType={KEY_BOARD_TYPE.EMAIL}
        onChangeText={text => {
          setState({...bookingState, customerEmail: text});
          updateField && updateField('customerEmail', text);
        }}
        inputStyle={styles.inputStyle}
        isRequired={true}
        error={errors?.customerEmail}
      />

      <DatePickerSection
        headerTitle={translate(STRINGS.DAY_OF_BIRTH)}
        placeholder={translate(STRINGS.DAY_OF_BIRTH)}
        value={state?.customerBirthDay}
        onChosen={date => {
          updateField && updateField('customerBirthDay', date);
        }}
        customButtonStyle={{borderColor: COLORS.GREY_E4}}
        customStyle={{...HELPERS.fill, marginTop: small, marginRight: normal}}
        isRequired={true}
        error={errors?.customerBirthDay}
      />
      <RadioSelectionsView
        initValue={state?.customerGender === 'NA' ? null : state?.customerGender}
        data={GENDER_ARRAY}
        isRequired
        headerTitle={translate(STRINGS.GENDER)}
        type={ITEM_TYPE.DEFAULT}
        onChosen={item => updateField && updateField('customerGender', item.value)}
        headerStyle={{marginVertical: normal}}
        customStyle={{marginBottom: normal}}
        error={errors?.customerGender}
      />
      <RadioSelectionsView
        isRequired
        initValue={state?.nationalIdType}
        data={IDENTIFY_TYPE}
        headerTitle={translate('common.identifyType')}
        type={ITEM_TYPE.DEFAULT}
        onChosen={item => updateField && updateField('nationalIdType', item.value)}
        customStyle={{marginBottom: normal}}
        headerStyle={{marginBottom: normal}}
        error={errors?.nationalIdType}
      />
    </>
  );
};

export default BasicInfo;
