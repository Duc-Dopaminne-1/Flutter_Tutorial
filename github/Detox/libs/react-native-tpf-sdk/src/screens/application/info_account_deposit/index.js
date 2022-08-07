import React, { useMemo } from 'react';
import { View } from 'react-native';
import styles from './styles';
import AppText from '../../../components/app_text';
import { CustomInput } from '../../../components/';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import TextView from '../../../components/text_view';
import { formatNumber } from '../../../helpers/formatNumber';
import FloatFooter from '../../../components/float_footer';
import { PrimaryButton } from '../../../components/';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getShowAlertError } from '../../../redux/actions/system';
import { CONFIRM_REFUND_REQUEST } from '../../../constants/errors';
import { getProfileHandle } from '../../../redux/actions/member';
import { validateNumberic } from '../../../helpers/validate';
import __ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getDepositMoneyHandler } from '../../../redux/actions/deposit';
import SCREENS_NAME from '../../../constants/screens';
import { useRef } from 'react';

const InfoAccountDeposit = props => {
  const router = useRoute();
  const dispatch = useDispatch();
  const [err, setErr] = useState({});
  const navigation = useNavigation();
  const profile = useSelector(state => state.member.profile);
  const [currentProfile, setProfile] = useState(profile);
  const depositValue = router.params?.depositValue || '0';
  const form = router.params?.item || {};
  const bank = useSelector(state => state.masterData.bank);
  const memberId = useSelector(state => state.auth.memberId);
  const prevProfile = useRef(profile);

  const bankBranch = useMemo(() => {
    return bank.filter(item => item.parentCode === currentProfile.bank);
  }, [bank, currentProfile.bank]);

  React.useLayoutEffect(() => {
    dispatch(getDepositMoneyHandler());
    dispatch(getProfileHandle({ memberId: memberId }));
  }, []);

  React.useEffect(() => {
    setProfile(profile);
  }, [profile]);

  const onChangeValue = object => {
    setProfile(pro => {
      const newValue = { ...pro, ...object };
      return newValue;
    });
  };

  const onPressConfirm = () => {
    const rs = validate(currentProfile);
    currentProfile.accountHolder = currentProfile?.accountHolder?.toUpperCase();
    const objA = {
      ...prevProfile.current
    };
    const objB = {
      ...currentProfile,
    };
    const equal = __.isEqual(objA, objB);
    if (__.isEmpty(rs)) {
      if (!equal) {
        dispatch(
          getShowAlertError({
            ...CONFIRM_REFUND_REQUEST,
            confirmAction: () => {
              navigation.navigate(SCREENS_NAME.CONFIRM_REFUND_REQUEST, {
                currentProfile,
                depositValue,
                form
              });
            },
            cancelAction: () => {
              navigation.navigate(SCREENS_NAME.CONFIRM_REFUND_REQUEST, {
                currentProfile,
                depositValue,
                form
              });
            }
          })
        );
      } else {
        navigation.navigate(SCREENS_NAME.CONFIRM_REFUND_REQUEST, {
          currentProfile,
          depositValue,
          form
        });
      }
      return;
    }

    setErr(rs);
  };

  return (
    <View style={styles.contentWrapper}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.wrapper}
        showsVerticalScrollIndicator={false}>
        <AppText translate style={styles.title}>
          {'info_account_deposit.title'}
        </AppText>
        <CustomInput
          autoCapitalize={'characters'}
          required
          translateTitle
          style={styles.name}
          title="profile.bank_owner"
          errorText={err.accountHolder}
          value={currentProfile?.accountHolder || ''}
          onChangeText={text => onChangeValue({ accountHolder: text })}
        />
        <CustomInput
          required
          showSearch
          translateTitle
          type={'select'}
          selectOptions={bank.filter(item => !item.parentCode)}
          errorText={err.bank}
          translatePlaceholder
          value={currentProfile.bank}
          title={'profile.bank_name'}
          placeholder={'account_balance.bank_placeholder'}
          onChangeText={text => {
            onChangeValue({ bank: text, bankBranch: '' });
          }}
        />
        <CustomInput
          required
          showSearch={currentProfile?.bank !== null ? true : false}
          translateTitle
          type={'select'}
          selectOptions={currentProfile?.bank !== null ? bankBranch : []}
          errorText={err.bankBranch}
          translatePlaceholder
          value={currentProfile.bankBranch}
          title={'account_balance.bank_branch'}
          placeholder={'account_balance.select_bank_branch'}
          onChangeText={text => onChangeValue({ bankBranch: text })}
        />
        <CustomInput
          showSearch
          translateTitle
          translatePlaceholder
          value={currentProfile.bankProvince}
          title={'account_balance.town_city'}
          placeholder={'account_balance.add_town_city'}
          onChangeText={text => onChangeValue({ bankProvince: text })}
        />
        <CustomInput
          required
          translateTitle
          keyboardType={'number-pad'}
          errorText={err.bankAccount}
          value={currentProfile.bankAccount}
          title={'profile.bank_number'}
          translatePlaceholder
          placeholder={'account_balance.bank_number_placeholder'}
          onChangeText={text => onChangeValue({ bankAccount: text })}
        />
        <TextView
          translate
          title="info_account_deposit.deposit_amount"
          style={styles.money}
          value={
            <AppText translate>
              {formatNumber(depositValue) + ''}
              {'common.currency'}
            </AppText>
          }
        />
      </KeyboardAwareScrollView>
      <FloatFooter style={{ backgroundColor: '#FFF' }}>
        <PrimaryButton translate title={'policy_subscription.continue'} onPress={onPressConfirm} />
      </FloatFooter>
    </View>
  );
};

InfoAccountDeposit.propTypes = {
  // bla: PropTypes.string,
};

InfoAccountDeposit.defaultProps = {
  // bla: 'test',
};

export default InfoAccountDeposit;

const validate = data => {
  const result = {};

  if (!data.accountHolder) {
    result.accountHolder = 'validate.field_required';
  }
  if (!data.bank) {
    result.bank = 'validate.field_required';
  }
  if (!data.bankBranch) {
    result.bankBranch = 'validate.field_required';
  }
  if (!data.bankAccount) {
    result.bankAccount = 'validate.field_required';
  }

  if (!validateNumberic(data.bankAccount)) {
    result.bankAccount = 'validate.bank_account';
  }
  return result;
};
