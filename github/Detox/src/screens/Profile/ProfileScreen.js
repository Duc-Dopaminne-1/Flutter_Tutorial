import React from 'react';
import {useSelector} from 'react-redux';

import {getUserId, isAgent} from '../../appData/user/selectors';
import AgentProfileScreen from './AgentProfile/AgentProfileScreen';
import MemberProfileScreen from './MemberProfile/MemberProfileScreen';

const ProfileScreen = props => {
  const isAgentUser = useSelector(isAgent);
  const userId = useSelector(getUserId);

  return isAgentUser ? (
    <AgentProfileScreen agentId={userId} isEdit={true} {...props} />
  ) : (
    <MemberProfileScreen userId={userId} {...props} />
  );
};

export default ProfileScreen;
