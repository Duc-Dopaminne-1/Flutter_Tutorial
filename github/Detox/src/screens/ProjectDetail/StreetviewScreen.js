import React from 'react';

import BaseScreen from '../../components/BaseScreen';
import StreetView from '../../components/StreetView';

const StreetviewScreen = ({route}) => {
  const {coordinate} = route.params;

  return (
    <BaseScreen>
      <StreetView coordinate={coordinate} />
    </BaseScreen>
  );
};

export default StreetviewScreen;
