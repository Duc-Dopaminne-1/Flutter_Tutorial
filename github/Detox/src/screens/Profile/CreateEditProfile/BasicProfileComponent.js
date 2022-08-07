import React, {useContext} from 'react';
import {useSelector} from 'react-redux';

import {getUserId} from '../../../appData/user/selectors';
import {useMount} from '../../commonHooks';
import BasicProfileFields from './BasicProfileFields';
import {BasicProfileContext} from './useBasicProfile';

const BasicProfileComponent = props => {
  const {
    state: {inputState, errors},
    setInputFieldState,
    getUser,
  } = useContext(BasicProfileContext);
  const userId = useSelector(getUserId);
  const setInputComponentState = componentField => {
    setInputFieldState(componentField);
  };

  useMount(() => {
    getUser({variables: {userId}});
  });

  return (
    <BasicProfileFields
      state={inputState}
      errors={errors}
      onComponentChange={setInputComponentState}
      {...props}
    />
  );
};

export default BasicProfileComponent;
