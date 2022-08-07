import {useNavigation} from '@react-navigation/native';
import React from 'react';

import RequestDetailInfoView from './RequestDetailInfoView';

const RequestDetailBodyView = ({
  state,
  isSending = false,
  isB2C = false,
  onChangeNote,
  callStringee,
}) => {
  const navigation = useNavigation();
  return (
    <RequestDetailInfoView
      navigation={navigation}
      isB2C={isB2C}
      onChangeNote={onChangeNote}
      isSending={isSending}
      state={state}
      callStringee={callStringee}
    />
  );
};

export default RequestDetailBodyView;
