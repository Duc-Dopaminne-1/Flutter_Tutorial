import { useNavigation, useRoute } from '@react-navigation/native';
import { getProfileHandle } from '../../../../redux/actions/member';
import { getShowAlertError } from '../../../../redux/actions/system';
import { CustomInput, PrimaryButton } from '../../../../components/';
import AppText from '../../../../components/app_text';
import FloatFooter from '../../../../components/float_footer';
import { CONFIRM_REFUND_REQUEST } from '../../../../constants/errors';
import SCREENS_NAME from '../../../../constants/screens';
import { validateNumberic } from '../../../../helpers/validate';
import __ from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';

const InfoAccountRefound = props => {
  const router = useRoute();
  const dispatch = useDispatch();
  const [err, setErr] = useState({});
  const navigation = useNavigation();
  const profile = useSelector(state => state.member.profile);
  const [currentProfile, setProfile] = useState(profile);
  const item = router.params?.item || {};
  const bank = useSelector(state => state.masterData.bank);
  const memberId = useSelector(state => state.auth.memberId);
  const prevProfile = useRef(profile);

  const bankBranch = useMemo(() => {
    return bank.filter(el => el.parentCode === currentProfile.bank);
  }, [bank, currentProfile.bank]);

  React.useLayoutEffect(() => {
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
    const objA = {
      ...prevProfile.current
    };
    const objB = {
      ...currentProfile
    };
    const equal = __.isEqual(objA, objB);
    if (__.isEmpty(rs)) {
      if (!equal) {
        dispatch(
          getShowAlertError({
            ...CONFIRM_REFUND_REQUEST,
            confirmAction: () => {
              navigation.navigate(SCREENS_NAME.CONFIRM_ACCOUNT_REFUND, {
                currentProfile,
                item
              });
            },
            cancelAction: () => {
              navigation.navigate(SCREENS_NAME.CONFIRM_ACCOUNT_REFUND, {
                currentProfile,
                item
              });
            }
          })
        );
      } else {
        navigation.navigate(SCREENS_NAME.CONFIRM_ACCOUNT_REFUND, {
          currentProfile,
          item
        });
      }
    }
    setErr(rs);
  };

  return (
    <View style={styles.contentWrapper}>
      <KeyboardAwareScrollView>
        <AppText translate style={styles.title}>
          {'info_account_refund.title'}
        </AppText>
        <CustomInput
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
          onChangeText={text => onChangeValue({ bank: text })}
        />
        <CustomInput
          required
          showSearch
          translateTitle
          type={'select'}
          selectOptions={currentProfile?.bank !== null ? bankBranch : []}
          errorText={err.bank}
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
      </KeyboardAwareScrollView>
      <FloatFooter>
        <PrimaryButton translate title={'policy_subscription.continue'} onPress={onPressConfirm} />
      </FloatFooter>
    </View>
  );
};

InfoAccountRefound.propTypes = {
  // bla: PropTypes.string,
};

InfoAccountRefound.defaultProps = {
  // bla: 'test',
};

export default InfoAccountRefound;

const validate = data => {
  const result = {};

  if (!data.accountHolder) {
    result.accountHolder = 'validate.bank_account';
  }

  if (!data.bank) {
    result.bank = 'validate.bank_account';
  }

  if (!data.bankAccount) {
    result.bankAccount = 'validate.bank_account';
  }

  if (!validateNumberic(data.bankAccount)) {
    result.bankAccount = 'validate.bank_account';
  }

  return result;
};
