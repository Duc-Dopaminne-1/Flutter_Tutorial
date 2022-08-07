import React from 'react';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import BaseScreen from '../../../components/BaseScreen';
import BasicProfileComponent from './BasicProfileComponent';
import {BasicProfileProvider} from './useBasicProfile';

const CreateUpdateProfileScreen = () => {
  return (
    <BasicProfileProvider>
      <BaseScreen showHeaderShadow title={translate(STRINGS.PERSONAL_INFO)}>
        <BasicProfileComponent />
      </BaseScreen>
    </BasicProfileProvider>
  );
};

export default CreateUpdateProfileScreen;
