import { useNavigation } from '@react-navigation/native';
import { clearUpdateOrderStatus } from '../../../../redux/actions/order';
import { ICTick } from '../../../../assets/icons';
import { Heading, PrimaryButton } from '../../../../components/';
import FloatFooter from '../../../../components/float_footer';
import { BACKGROUND_COLOR } from '../../../../constants/colors';
import SCREENS_NAME from '../../../../constants/screens';
import { SPACING } from '../../../../constants/size';
import React, { useCallback } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { scale } from '../../../../utils/responsive';

const CancelOrderSuccess = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onBack = useCallback(() => {
    navigation.navigate(SCREENS_NAME.APPLICATION_LIST_SCREEN);
  }, [navigation]);

  useEffect(() => {
    return () => {
      dispatch(clearUpdateOrderStatus());
    };
  }, [dispatch]);

  return (
    <View style={styles.successWrapper}>
      <ICTick />
      <Heading translate textAlign={'center'} numberOfLines={2} style={styles.successText}>
        {'insurance_record_details.cancel_contract'}
      </Heading>
      <FloatFooter style={styles.backToHome}>
        <PrimaryButton translate onPress={onBack} title={'insurance_screen.back_to_records_list'} />
      </FloatFooter>
    </View>
  );
};

export default CancelOrderSuccess;

const styles = StyleSheet.create({
  successWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: scale(53, false),
    backgroundColor: BACKGROUND_COLOR.White,
    paddingHorizontal: SPACING.Medium
  },
  successText: {
    alignSelf: 'center',
    marginTop: SPACING.Medium,
    textAlign: 'center'
  }
});
