import React from 'react';
import {StyleSheet, View} from 'react-native';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {small} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomCheckbox from '../../../../components/Checkbox/CustomCheckbox';
import ContactInfo from '../../../../components/ContactInfo';
import RequiredLabel from '../../../../components/RequiredLabel';

const styles = StyleSheet.create({
  userInfoInputsContainer: {
    marginTop: small,
  },
  contentScrollView: {
    flexGrow: 1,
  },
});

const OwnerInformationInput = ({
  errorState,
  ownerIsAuthor,
  ownerName,
  ownerEmail,
  ownerPhoneNumber,
  onChangeTextName,
  onChangeTextPhoneNumber,
  onChangeTextEmail,
  onCheckOwnerIsAuthor,
}) => {
  return (
    <View style={styles.contentScrollView}>
      <RequiredLabel
        title={translate(STRINGS.CONTACT_INFO)}
        titleStyle={commonStyles.blackTextBold24}
        isRequired={false}
      />
      <View style={commonStyles.rowCheckBox}>
        <CustomCheckbox
          images={['checkbox', 'checkbox-blank-outline']}
          customCheckedBox
          iconCheckedColor={COLORS.PRIMARY_A100}
          iconColor={COLORS.GRAY_C9}
          shouldGetValueOutSide
          parentCheckedValue={ownerIsAuthor}
          checkValue={onCheckOwnerIsAuthor}
          title={translate(STRINGS.I_AM_OWNER_OF_THIS_PROPERTY)}
          textStyle={commonStyles.blackText16}
        />
      </View>
      <View style={styles.userInfoInputsContainer}>
        <ContactInfo
          ownerIsAuthor={ownerIsAuthor}
          ownerName={ownerName}
          ownerPhoneNumber={ownerPhoneNumber}
          ownerEmail={ownerEmail}
          errorOwnerEmail={errorState?.ownerEmail}
          errorOwnerName={errorState?.ownerName}
          errorOwnerPhoneNumber={errorState?.ownerPhoneNumber}
          onChangeTextEmail={onChangeTextEmail}
          onChangeTextPhoneNumber={onChangeTextPhoneNumber}
          onChangeTextName={onChangeTextName}
        />
      </View>
    </View>
  );
};

export default OwnerInformationInput;
