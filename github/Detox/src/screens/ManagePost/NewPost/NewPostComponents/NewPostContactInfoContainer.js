/* eslint-disable no-unused-vars */
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {GLOBAL_ACTIONS, NEWPOST_FIELD} from '../../../../assets/constants';
import {COLORS} from '../../../../assets/theme/colors';
import {METRICS, small} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import {getUserFullName} from '../../../../utils/UserAgentUtil';
import OwnerInformationInput from './OwnerInformationInput';

const styles = StyleSheet.create({
  viewContainer: {
    ...METRICS.horizontalPadding,
    paddingBottom: small,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
});

const NewPostContactInfoContainer = ({
  state,
  dispatch,
  userData,
  errorState,
  onChooseGuaranteedPackage,
}) => {
  const ownerName = state?.ownerIsAuthor ? getUserFullName(userData) : state?.ownerName;
  const ownerEmail = state?.ownerIsAuthor ? userData?.email : state?.ownerEmail;
  const ownerPhoneNumber = state?.ownerIsAuthor ? userData?.phoneNumber : state?.ownerPhoneNumber;

  const onChangeField = (fieldName, props) => {
    if (dispatch) {
      dispatch({
        type: GLOBAL_ACTIONS.FIELD,
        fieldName: fieldName,
        payload: props,
      });
    }
  };

  const onChangeTextName = text => {
    onChangeField(NEWPOST_FIELD.ownerName, text);
  };

  const onChangeTextPhoneNumber = text => {
    onChangeField(NEWPOST_FIELD.ownerPhoneNumber, text);
  };

  const onChangeTextEmail = text => {
    onChangeField(NEWPOST_FIELD.ownerEmail, text);
  };

  const onCheckBox = value => {
    dispatch({
      type: GLOBAL_ACTIONS.CHANGE_OWNER_INFO,
      payload: value,
    });
  };

  return (
    <View style={styles.viewContainer}>
      <View style={commonStyles.separatorRow24} />
      <OwnerInformationInput
        ownerIsAuthor={state?.ownerIsAuthor}
        ownerName={ownerName}
        ownerEmail={ownerEmail}
        ownerPhoneNumber={ownerPhoneNumber}
        errorState={errorState}
        onChangeTextName={onChangeTextName}
        onChangeTextPhoneNumber={onChangeTextPhoneNumber}
        onChangeTextEmail={onChangeTextEmail}
        onCheckOwnerIsAuthor={onCheckBox}
      />
    </View>
  );
};

export default NewPostContactInfoContainer;
