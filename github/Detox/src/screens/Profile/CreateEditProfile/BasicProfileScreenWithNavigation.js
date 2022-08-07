import React from 'react';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import BaseScreen from '../../../components/BaseScreen';
import ScreenIds from '../../ScreenIds';
import BasicProfileComponent from './BasicProfileComponent';
import {BasicProfileProvider} from './useBasicProfile';

const BasicProfileScreenWithNavigation = props => {
  const router = props?.route;
  return (
    <BasicProfileProvider route={router}>
      <BaseScreen
        title={translate(STRINGS.PERSONAL_INFO)}
        testID={ScreenIds.BasicProfileNavigation}>
        <BasicProfileComponent {...props} />
      </BaseScreen>
    </BasicProfileProvider>
  );
};

export default BasicProfileScreenWithNavigation;
