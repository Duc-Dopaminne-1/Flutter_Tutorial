import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';

import {KEY_BOARD_TYPE, MAX_LENGTH} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {small} from '../../../../assets/theme/metric';
import DatePickerSection from '../../../../components/Button/DatePickerSection';
import InputSection from '../../../../components/InputSection';
import NumberUtils from '../../../../utils/NumberUtils';
import {BookingContext} from '../../useBooking';

const styles = StyleSheet.create({
  borderInput: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_BORDER,
  },
  viewId: {},
});

export const ViewInfoIdentify = ({
  issueDate,
  errorDate,
  updateDate,
  updatePlace,
  errorPlace,
  issuePlace,
  onFocusPlace,
  onBlurPlace,
}) => {
  return (
    <View style={styles.viewId}>
      <DatePickerSection
        headerTitle={translate(STRINGS.ID_ISSUE_DATE)}
        value={issueDate}
        onChosen={updateDate}
        customStyle={{marginTop: small}}
        isRequired={true}
        error={errorDate}
        placeholder={translate('common.placeholders.issueDate')}
        isShowIcon={true}
      />

      <InputSection
        headerTitle={translate(STRINGS.ID_ISSUE_PLACE)}
        value={issuePlace}
        onChangeText={updatePlace}
        inputStyle={styles.borderInput}
        customStyle={{marginTop: small}}
        isRequired={true}
        error={errorPlace}
        placeholder={translate('common.placeholders.issuePlace')}
        onFocus={() => {
          onFocusPlace && onFocusPlace();
        }}
        onBlur={() => {
          onBlurPlace && onBlurPlace();
        }}
      />
    </View>
  );
};

const IDInfo = ({state, errors, updateField}) => {
  const {state: bookingState, setState} = useContext(BookingContext);
  return (
    <>
      <InputSection
        headerTitle={translate(STRINGS.IDENTIFY)}
        placeholder={translate(STRINGS.IDENTIFY)}
        value={state?.customerNationalId}
        onChangeText={text => {
          if (NumberUtils.isValidIntNumber(text, MAX_LENGTH.identity)) {
            setState({...bookingState, customerNationalId: text});
            updateField && updateField('customerNationalId', text);
          }
        }}
        inputStyle={styles.borderInput}
        keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
        isRequired={true}
        error={errors?.customerNationalId}
      />
      <ViewInfoIdentify
        issueDate={state?.customerNationalIdIssueDate}
        errorDate={errors?.customerNationalIdIssueDate}
        updateDate={date => {
          updateField && updateField('customerNationalIdIssueDate', date.toISOString());
        }}
        updatePlace={text => {
          updateField && updateField('customerNationalIdIssuePlace', text);
        }}
        errorPlace={errors?.customerNationalIdIssuePlace}
        issuePlace={state?.customerNationalIdIssuePlace}
      />
    </>
  );
};

export default IDInfo;
