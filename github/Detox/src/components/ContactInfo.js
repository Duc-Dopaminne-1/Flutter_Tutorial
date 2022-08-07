import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {KEY_BOARD_TYPE, MAX_LENGTH} from '../assets/constants';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {commonStyles} from '../assets/theme/styles';
import InputSection from './InputSection';

const styles = StyleSheet.create({
  inputHeader: {
    ...commonStyles.blackTextBold16,
  },
  input: isFocused => ({
    ...commonStyles.inputBorderWithIcon,
    ...commonStyles.blackText16,
    ...(isFocused && {borderColor: COLORS.PRIMARY_A100}),
  }),
});

const ContactInfo = ({
  ownerIsAuthor,
  ownerName,
  ownerPhoneNumber,
  ownerEmail,
  errorOwnerEmail,
  errorOwnerName,
  errorOwnerPhoneNumber,
  onChangeTextEmail,
  onChangeTextPhoneNumber,
  onChangeTextName,
}) => {
  const [focusedViews, setFocusedViews] = useState({});
  const isEdit = !ownerIsAuthor;

  return (
    <View>
      <InputSection
        headerTitle={translate(STRINGS.LANDLORD_NAME)}
        headerStyles={styles.inputHeader}
        placeholder={translate('common.placeholderLandlordName')}
        inputStyle={styles.input(focusedViews?.ownerName)}
        maxLength={MAX_LENGTH.OWNER_NAME}
        value={ownerName}
        isRequired
        editable={isEdit}
        error={errorOwnerName}
        onChangeText={onChangeTextName}
        onFocus={() => setFocusedViews({...focusedViews, ownerName: true})}
        onBlur={() => setFocusedViews({...focusedViews, ownerName: false})}
      />
      <InputSection
        headerTitle={translate(STRINGS.PHONE_NUMBER)}
        headerStyles={styles.inputHeader}
        placeholder={translate('common.placeholderPhoneNumber')}
        inputStyle={styles.input(focusedViews?.ownerPhoneNumber)}
        value={ownerPhoneNumber}
        keyboardType={KEY_BOARD_TYPE.PHONE_NUMBER}
        isRequired
        editable={isEdit}
        error={errorOwnerPhoneNumber}
        onChangeText={onChangeTextPhoneNumber}
        onFocus={() => setFocusedViews({...focusedViews, ownerPhoneNumber: true})}
        onBlur={() => setFocusedViews({...focusedViews, ownerPhoneNumber: false})}
      />
      <InputSection
        headerTitle={translate(STRINGS.EMAIL)}
        headerStyles={styles.inputHeader}
        placeholder={translate('common.placeholderEmail')}
        inputStyle={styles.input(focusedViews?.ownerEmail)}
        keyboardType={KEY_BOARD_TYPE.EMAIL}
        value={ownerEmail}
        editable={isEdit}
        error={errorOwnerEmail}
        onChangeText={onChangeTextEmail}
        onFocus={() => setFocusedViews({...focusedViews, ownerEmail: true})}
        onBlur={() => setFocusedViews({...focusedViews, ownerEmail: false})}
      />
    </View>
  );
};

export default ContactInfo;
