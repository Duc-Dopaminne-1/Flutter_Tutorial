import { useNavigation } from '@react-navigation/native';
import { ExpandView } from '../../../components/';
import CustomInput from '../../../components/custom_input';
import PrimaryButton from '../../../components/primary_button';
import { EVENT_TYPE } from '../../../constants/analyticEnums';
import { BACKGROUND_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import { handleTouch } from '../../../helpers/handleTouch';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import CreditSimulatorForm from './credit_simulator_form';

const CreditSimulatorWidget = props => {
  const navigation = useNavigation();
  const [data, setData] = useState({
    calculateType: 2,
    duration: '',
    incomeAmount: '',
    interestRate: '',
    loanAmount: '',
    paymentTerm: 1,
    spendAmount: ''
  });
  const onChangeValue = obj => {
    setData({ ...data, ...obj });
  };

  const topenId = useSelector(state => state.auth.topenId);

  return (
    <ExpandView
      translateTitle
      style={styles.container}
      title={'loan.loan_head'}
      center
      expanded={false}
      collapseChildren={
        <View style={styles.box}>
          <CustomInput
            translate
            type={'number'}
            placeholder={'loan.loan_amount_placeholder'}
            title={'loan.loan_amount'}
            value={data.loanAmount}
            onChangeText={value => {
              onChangeValue({ loanAmount: value });
            }}
          />
        </View>
      }>
      <View style={styles.box}>
        <CreditSimulatorForm data={data} onChange={onChangeValue} />
        <View style={{ ...styles.footer }}>
          <PrimaryButton
            translate
            title={'loan.loan_calc'}
            onPress={event => {
              navigation.navigate(SCREENS_NAME.LOAN_SIMULATION_SCREEN, {
                data
              });
              handleTouch(event, 'LOAN_SIMULATION', props?.route, topenId, EVENT_TYPE.LOAN_CALC);
            }}
            disabled={Object.values(data).includes('')}
            route={props?.route}
            name="LOAN_SIMULATION"
          />
        </View>
      </View>
    </ExpandView>
  );
};

export default CreditSimulatorWidget;

const styles = StyleSheet.create({
  container: {},
  box: {
    backgroundColor: BACKGROUND_COLOR.White
  },
  footer: {
    paddingTop: SPACING.Medium,
    alignItems: 'center'
  }
});
