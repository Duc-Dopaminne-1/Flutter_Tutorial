import PrimaryButton from '../../../../components/primary_button';
import SCREENS_NAME from '../../../../constants/screens';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import RequestLetter from './components/RequestLetter';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRef } from 'react';
import AppText from '../../../../components/app_text';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGlobalCongifHandle } from '../../../../redux/actions/cashout';
import { getShowAlertError } from '../../../../redux/actions/system';
import { CONFIRM_UPDATE_PROFILE_WITHDRAWAL } from '../../../../constants/warnings';
import { updateProfileHandle } from '../../../../redux/actions/member';

const WithdrawalRequest = ({ navigation }) => {
  const ref = useRef();
  const profile = useSelector(state => state.member.profile);

  const [valid, setValid] = useState(false);
  const dispatch = useDispatch();
  const navigationAction = useCallback(() => {
    navigation.navigate(SCREENS_NAME.CONFIRM_WITHDRAWAL, {
      data: ref.current.onSubmit()
    });
  }, [navigation]);
  const onPressContinue = useCallback(() => {
    const data = ref.current.onSubmit();
    if (
      profile?.bankAccount !== data?.accountNumber ||
      profile?.bank !== data?.bank ||
      profile?.accountHolder !== data?.receiver ||
      profile.bankBranch !== data.bankBranch ||
      profile.bankProvince !== data.bankProvince
    ) {
      dispatch(
        getShowAlertError({
          ...CONFIRM_UPDATE_PROFILE_WITHDRAWAL,
          confirmAction: () => {
            dispatch(
              updateProfileHandle({
                params: {
                  ...profile,
                  memberId: profile?.id,
                  bank: data?.bank,
                  bankAccount: data?.accountNumber,
                  accountHolder: data?.receiver,
                  bankBranch: data.bankBranch,
                  bankProvince: data.bankProvince
                },
                callback: (err, res) => {
                  if (!err) {
                    navigationAction();
                  }
                }
              })
            );
          },
          cancelAction: () => {
            navigationAction();
          }
        })
      );
    } else {
      navigationAction();
    }
  }, [profile, dispatch, navigationAction]);

  const validForm = value => {
    setValid(value);
  };

  useEffect(() => {
    dispatch(getAllGlobalCongifHandle());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        extraHeight={80}
        keyboardOpeningTime={-1}
        enableResetScrollToCoords={false}
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <AppText translate style={styles.desc}>
          {'account_balance.desc'}
        </AppText>
        <RequestLetter ref={ref} validForm={validForm} />
      </KeyboardAwareScrollView>
      <View style={styles.btnView}>
        <PrimaryButton
          translate
          title={'common.continue_text'}
          onPress={onPressContinue}
          disabled={!valid}
        />
      </View>
    </View>
  );
};

export default React.memo(WithdrawalRequest);
