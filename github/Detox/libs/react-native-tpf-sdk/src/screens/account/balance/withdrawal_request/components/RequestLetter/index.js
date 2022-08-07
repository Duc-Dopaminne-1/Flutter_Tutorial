import { CustomInput } from '../../../../../../components/';
import AppText from '../../../../../../components/app_text';
import { formatNumber } from '../../../../../../helpers/formatNumber';
import React, { useCallback, useContext, useImperativeHandle, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { bankSelector } from '../../../../../../redux/selectors/masterData';
import styles from './styles';
import { useEffect } from 'react';
import { isNumber } from 'lodash';
import themeContext from '../../../../../../constants/theme/themeContext';

const ItemView = React.memo(({ title, value, isBoldValue, translateTitle = false, taxRate }) => {
  const { fonts } = useContext(themeContext) || {};

  const _valueStyle = useMemo(() => {
    return [
      { ...styles.itemValue, fontFamily: fonts?.MEDIUM },
      isBoldValue && { fontFamily: fonts?.BOLD }
    ];
  }, [isBoldValue]);

  return (
    <View style={styles.itemView}>
      {isNumber(taxRate) ? (
        <AppText translate={translateTitle} style={styles.itemTitle}>
          {title}
          {`(${taxRate}%)`}
        </AppText>
      ) : (
        <AppText translate={translateTitle} style={styles.itemTitle}>
          {title}
        </AppText>
      )}
      <Text style={_valueStyle}>
        {typeof value === 'number' ? (
          <AppText translate>
            {formatNumber(value) + ''}
            {'common.currency'}
          </AppText>
        ) : (
          value
        )}
      </Text>
    </View>
  );
});

const RequestLetter = (props, ref) => {
  const { validForm } = props;
  const bankListSelecter = createSelector(bankSelector, bank => bank);

  const withdrawConfig = useSelector(state => state.cashout.withdrawConfig);
  const availableBalance = useSelector(state => state.member.availableBalance);
  const profile = useSelector(state => state.member.profile);
  const bank = useSelector(bankListSelecter) || [];
  const [bankSelected, setBankSelected] = useState(
    profile.bank || profile.bankBranch || (bank?.length > 0 ? bank[0].code : '')
  );
  const [bankBranchSelected, setBankBranchSelected] = useState(null);
  const bankBranch = useMemo(() => {
    return bank.filter(item => item.parentCode === bankSelected);
  }, [bank, bankSelected]);
  const [bankBranchErr, setBankBranchErr] = useState('');
  const [bankProvince, setBankProvince] = useState(null);

  const [receiver, setReceiver] = useState(profile.accountHolder);
  const [receiverError, setReceiverError] = useState('');
  const [accountNumber, setAccountNumber] = useState(profile.bankAccount);
  const [accountNumberError, setAccountNumberError] = useState('');
  const [tax, setTax] = useState(0);
  const [amount, setAmount] = useState(0);
  const [amountError, setAmountError] = useState('');
  const {
    taxRate = 0,
    baseWithdrawalUnit = 0,
    withdrawalMinimum = 0,
    withdrawalLimit = 0
  } = withdrawConfig || {};

  useEffect(() => {
    let valid = true;
    if (
      amount < withdrawalMinimum ||
      amount % baseWithdrawalUnit !== 0 ||
      availableBalance < amount ||
      amount > withdrawalLimit ||
      !receiver ||
      !accountNumber
    ) {
      valid = false;
    }
    validForm(valid);
  }, [
    amount,
    availableBalance,
    validForm,
    bankSelected,
    receiver,
    accountNumber,
    withdrawalMinimum,
    withdrawalLimit,
    baseWithdrawalUnit
  ]);

  const onChangeReceiver = useCallback(value => {
    if (!value) {
      setReceiverError('validation.required');
    } else {
      setReceiverError('');
    }
    setReceiver(value);
  }, []);

  const calReceived = useMemo(() => {
    const _received = Math.floor(parseInt(amount, 10) * (1 - taxRate / 100));
    return _received;
  }, [amount, taxRate]);

  const onChangeAccountNumber = useCallback(value => {
    if (!value) {
      setAccountNumberError('validation.required');
    } else {
      setAccountNumberError('');
    }
    setAccountNumber(value);
  }, []);

  const onChangeBank = useCallback(value => {
    setBankSelected(value);
  }, []);

  const onChangeBankBranch = useCallback(value => {
    if (!value) {
      setBankBranchErr('validation.required');
    } else {
      setBankBranchErr('');
    }
    setBankBranchSelected(value);
  }, []);

  const onChangeBankProvince = useCallback(value => {
    setBankProvince(value);
  }, []);

  const onChangeAmount = useCallback(
    value => {
      const amountValue = parseInt(value || '0', 10);
      const _tax = Math.floor(amountValue * (taxRate / 100));

      if (amountValue < withdrawalMinimum || amountValue % baseWithdrawalUnit !== 0) {
        setAmountError([
          'account_balance.invalid_min_amount',
          formatNumber(withdrawalMinimum),
          '' + 'common.currency' + '',
          'common.and' + '',
          'account_balance.invalid_multiples' + '',
          formatNumber(baseWithdrawalUnit)
        ]);
      } else if (availableBalance < amountValue || amountValue > withdrawalLimit) {
        setAmountError('account_balance.invalid_max_amount');
      } else {
        setAmountError('');
      }

      setAmount(amountValue);
      setTax(_tax);
    },
    [availableBalance, taxRate, withdrawalMinimum, withdrawalLimit, baseWithdrawalUnit]
  );

  const onSubmit = useCallback(() => {
    return {
      receiver,
      bank: bankSelected,
      bankBranch: bankBranchSelected || profile.bankBranch,
      bankProvince: bankProvince || profile.bankProvince,
      accountNumber,
      amount,
      tax,
      received: calReceived,
      taxRate
    };
  }, [
    receiver,
    bankSelected,
    bankBranchSelected,
    profile.bankBranch,
    profile.bankProvince,
    bankProvince,
    accountNumber,
    amount,
    tax,
    calReceived,
    taxRate
  ]);

  useImperativeHandle(ref, () => {
    return {
      onSubmit
    };
  });

  return (
    <View style={styles.container}>
      <CustomInput
        translateTitle
        required
        title={`${'account_balance.bank_owner'}`}
        placeholder={`${'account_balance.bank_owner_placeholder'}`}
        translatePlaceholder
        onChangeText={onChangeReceiver}
        value={receiver}
        errorText={receiverError}
        autoCapitalize={'characters'}
      />
      <CustomInput
        required
        translateTitle
        title={`${'account_balance.bank'}`}
        placeholder={`${'account_balance.bank_placeholder'}`}
        translatePlaceholder
        type="select"
        value={bankSelected}
        selectOptions={bank.filter(item => !item.parentCode)}
        showSearch
        onChangeText={onChangeBank}
      />
      <CustomInput
        required
        translateTitle
        title={`${'account_balance.bank_branch'}`}
        placeholder={`${'account_balance.select_bank_branch'}`}
        selectOptions={profile?.bank !== null ? bankBranch : []}
        value={bankBranchSelected || profile.bankBranch}
        translatePlaceholder
        onChangeText={onChangeBankBranch}
        errorText={bankBranchErr}
        type="select"
        showSearch={profile?.bank !== null ? true : false}
      />
      <CustomInput
        translateTitle
        title={`${'account_balance.town_city'}`}
        placeholder={`${'account_balance.add_town_city'}`}
        translatePlaceholder
        value={bankProvince !== null ? bankProvince : profile.bankProvince}
        onChangeText={onChangeBankProvince}
      />
      <CustomInput
        translateTitle
        required
        title={`${'account_balance.bank_number'}`}
        placeholder={`${'account_balance.bank_number_placeholder'}`}
        translatePlaceholder
        onChangeText={onChangeAccountNumber}
        value={accountNumber}
        errorText={accountNumberError}
      />
      <ItemView translateTitle title={'account_balance.withdrawal_limit'} value={withdrawalLimit} />
      <CustomInput
        translateTitle
        required
        title={`${'account_balance.input_amount'}`}
        placeholder={`${'account_balance.input_amount'}`}
        translatePlaceholder
        onChangeText={onChangeAmount}
        value={amount}
        type="number"
        errorText={amountError}
      />
      <ItemView translateTitle title={'account_balance.tax'} value={tax} taxRate={taxRate} />
      <ItemView
        translateTitle
        title={'account_balance.actually_received'}
        value={calReceived}
        isBoldValue
      />
    </View>
  );
};

export default React.memo(React.forwardRef(RequestLetter));
