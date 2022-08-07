import React from 'react';

import {FloorTabProvider} from './FloorTabContext';
import FloorTabView from './FloorTabView';

const FloorTabViewContainer = props => {
  return (
    <FloorTabProvider>
      <FloorTabView {...props} />
    </FloorTabProvider>
  );
};

export default FloorTabViewContainer;
