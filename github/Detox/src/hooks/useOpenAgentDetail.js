import {useNavigation} from '@react-navigation/native';

import ScreenIds from '../screens/ScreenIds';

export const useOpenAgentDetail = ({agentId, isAgent = true}) => {
  const navigation = useNavigation();
  const openAgentDetail = () => {
    if (isAgent) {
      navigation.navigate(ScreenIds.AgentManagement, {agentId});
    }
  };
  return {openAgentDetail};
};
