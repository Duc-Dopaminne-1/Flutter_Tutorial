import { clearCreateOrEditAdvanceCommission } from '../../../../redux/actions/cashout';
import { withdrawal_success } from '../../../../assets/images';
import AppText from '../../../../components/app_text';
import PrimaryButton from '../../../../components/primary_button';
import SCREENS_NAME from '../../../../constants/screens';
import React, { useCallback } from 'react';
import { Image, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { scale } from '../../../../utils/responsive';
import { styles } from './styles';

const AdvanceSalarySuccess = props => {
  const { navigation } = props;

  const dispatch = useDispatch();
  const onPressButton = useCallback(() => {
    navigation.navigate(SCREENS_NAME.HOME_SCREEN);
    dispatch(clearCreateOrEditAdvanceCommission());
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={withdrawal_success}
        style={styles.img}
        height={scale(115, false)}
        width={scale(112)}
      />
      <AppText translate bold={true} style={styles.text}>
        {'confirm_advance_salary.request_success'}
      </AppText>
      <View style={styles.btnView}>
        <PrimaryButton translate title={'common.backToHome'} onPress={onPressButton} />
      </View>
    </View>
  );
};
export default AdvanceSalarySuccess;
