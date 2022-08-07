import { clearCreateOrEditTransaction } from '../../../../redux/actions/cashout';
import { getCommissionInformationHandle } from '../../../../redux/actions/member';
import { withdrawal_success } from '../../../../assets/images';
import AppText from '../../../../components/app_text';
import PrimaryButton from '../../../../components/primary_button';
import SCREENS_NAME from '../../../../constants/screens';
import React, { useCallback } from 'react';
import { Image, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../../utils/responsive';
import styles from './styles';

const WithdrawalSuccess = ({ navigation }) => {
  const member = useSelector(state => state.member.profile);

  const dispatch = useDispatch();
  const onPressButton = useCallback(() => {
    navigation.navigate(SCREENS_NAME.HOME_SCREEN);
    dispatch(clearCreateOrEditTransaction());
    dispatch(getCommissionInformationHandle({ Id: member?.id }));
  }, [dispatch, member?.id, navigation]);
  return (
    <View style={styles.container}>
      <Image
        source={withdrawal_success}
        style={styles.img}
        height={scale(115, false)}
        width={scale(112)}
      />
      <AppText translate style={styles.text} bold={true}>
        {'account_balance.request_success'}
      </AppText>
      <AppText translate style={styles.text} bold={true}>
        {'account_balance.processing'}
      </AppText>
      <View style={styles.btnView}>
        <PrimaryButton translate title={'common.backToHome'} onPress={onPressButton} />
      </View>
    </View>
  );
};

export default React.memo(WithdrawalSuccess);
