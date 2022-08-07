import React from 'react';
import {View} from 'react-native';

import SelectedAreaContainer from '../SelectedAreaContainer';
import WorkingAreas from '../WorkingAreas';

const InterestedAreaContainer = ({state, dispatch, cities}) => {
  return (
    <View>
      <SelectedAreaContainer state={state} dispatch={dispatch} />
      <WorkingAreas state={state} dispatch={dispatch} cities={cities} />
    </View>
  );
};
export default InterestedAreaContainer;
