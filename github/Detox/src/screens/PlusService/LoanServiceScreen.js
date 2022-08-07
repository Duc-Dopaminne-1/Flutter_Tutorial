import React from 'react';

import {translate} from '../../assets/localize';
import PageScreen from '../../components/PageScreen';
import LoanServiceContainer from './LoanServiceContainer';

const LoanServiceScreen = ({navigation}) => {
  return (
    <PageScreen title={translate('LOANS_SCREEN.HEADER_LOAN_SCREEN')}>
      <LoanServiceContainer navigation={navigation} />
    </PageScreen>
  );
};

export default LoanServiceScreen;
