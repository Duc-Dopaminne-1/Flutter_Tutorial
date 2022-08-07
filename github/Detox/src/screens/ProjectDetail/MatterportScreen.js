import React from 'react';

import BaseScreen from '../../components/BaseScreen';
import MatterPortWebView from '../../components/MatterportWebView';

const MatterportScreen = ({route}) => {
  const {link} = route.params;

  return (
    <BaseScreen>
      <MatterPortWebView link={link} />
    </BaseScreen>
  );
};

export default MatterportScreen;
