import {useContext} from 'react';

import {useGetStaffByUserIdLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';
import {NewPostContext} from '../useNewPost';

const useGetStaffByUserId = props => {
  const {setInputFieldState} = useContext(NewPostContext);

  const onSuccess = response => {
    if (response) {
      const {email, fullName, phoneNumber, profilePhoto, rating, staffGroupName, userId} = response;
      const staffInfo = {
        email,
        fullName,
        phoneNumber,
        avatar: profilePhoto,
        agentRating: rating,
        agentGroupDescription: staffGroupName,
        userId,
      };
      setInputFieldState({
        staffInfo,
      });
      props?.onSuccess && props.onSuccess(staffInfo);
    }
  };

  const {startApi: getStaffByUserIdQuery} = useGraphqlApiLazy({
    graphqlApiLazy: useGetStaffByUserIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'staffByUserId',
    onSuccess,
    showSpinner: props?.showSpinner ?? false,
  });

  const getStaffByUserId = userId => {
    getStaffByUserIdQuery({variables: {userId}});
  };

  return {getStaffByUserId};
};

export default useGetStaffByUserId;
