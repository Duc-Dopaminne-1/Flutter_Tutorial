import React from 'react';
import {StyleSheet, View} from 'react-native';

import {translate} from '../../../assets/localize';
import AgreementComponent from '../../../components/AgreementComponent';
import SubmitButton from './SubmitButton';

const styles = StyleSheet.create({
  body: {},
});

const SubmitAgentInfoComponent = ({showAgreement, onSubmit, submitTitle, agreePolicy}) => {
  const isDisable = () => {
    if (showAgreement) {
      return !agreePolicy.isAgree;
    }
    return false;
  };

  return (
    <View style={styles.body}>
      {showAgreement && (
        <AgreementComponent
          isAgree={agreePolicy.isAgree}
          checkValue={agreePolicy.setAgree}
          hyperlink={translate('agent.policyTitle')}
          onConfirm={agreePolicy.openModal}
        />
      )}
      <SubmitButton disabled={isDisable()} onSubmit={onSubmit} submitTitle={submitTitle} />
    </View>
  );
};

export default SubmitAgentInfoComponent;
