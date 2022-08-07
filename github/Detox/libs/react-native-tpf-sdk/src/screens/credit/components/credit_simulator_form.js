import CustomInput from '../../../components/custom_input';
import React from 'react';
import { View } from 'react-native';
import { CalculateTypeItems, TermItems } from '../../../global/loan';
import { translate } from '../../../i18n';

const CreditSimulatorForm = ({ data, onChange }) => {
  const onChangeValue = obj => {
    onChange({ ...data, ...obj });
  };

  return (
    <View>
      <CustomInput
        translatePlaceholder
        translateTitle
        type={'number'}
        placeholder={'loan.loan_amount_placeholder'}
        title={'loan.loan_amount'}
        value={data.loanAmount}
        onChangeText={value => {
          onChangeValue({ loanAmount: value });
        }}
      />
      <CustomInput
        translatePlaceholder
        translateTitle
        type={'number'}
        placeholder={'loan.time_term_placeholder'}
        title={'loan.time_term'}
        value={data.duration}
        onChangeText={value => {
          onChangeValue({ duration: value });
        }}
      />
      <CustomInput
        translatePlaceholder
        translateTitle
        type={'number'}
        placeholder={'loan.interest_rate_placeholder'}
        title={'loan.interest_rate'}
        value={data.interestRate}
        onChangeText={value => {
          onChangeValue({ interestRate: value });
        }}
      />
      <CustomInput
        translatePlaceholder
        translateTitle
        translateItem
        translateValue
        type={'select'}
        placeholder={'loan.compound_placeholder'}
        title={'loan.compound'}
        selectOptions={TermItems}
        value={data.paymentTerm}
        onChangeText={value => {
          onChangeValue({ paymentTerm: value });
        }}
      />
      <CustomInput
        translateTitle
        translatePlaceholder
        type={'number'}
        placeholder={'loan.monthly_income_placeholder'}
        title={'loan.monthly_income'}
        value={data.incomeAmount}
        onChangeText={value => {
          onChangeValue({ incomeAmount: value });
        }}
      />
      <CustomInput
        translateTitle
        translatePlaceholder
        type={'number'}
        placeholder={'loan.monthly_spending_placeholder'}
        title={translate('loan.monthly_spending') + ' ' + translate('loan.monthly_spending_note')}
        value={data.spendAmount}
        onChangeText={value => {
          onChangeValue({ spendAmount: value });
        }}
      />
      <CustomInput
        translateTitle
        translatePlaceholder
        translateValue
        translateItem
        type={'select'}
        title={'loan.type_loan.title'}
        placeholder={'loan.type_loan.title_placeholder'}
        selectOptions={CalculateTypeItems}
        value={data.calculateType}
        onChangeText={value => {
          onChangeValue({ calculateType: value });
        }}
      />
    </View>
  );
};

export default React.memo(CreditSimulatorForm);
