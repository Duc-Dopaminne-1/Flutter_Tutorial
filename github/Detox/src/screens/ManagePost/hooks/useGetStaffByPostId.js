import {useContext} from 'react';

import {useGetStaffByPostIdLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';
import {NewPostContext} from '../useNewPost';

const useGetStaffByPostId = props => {
  const {onSuccess, showSpinner, isUpdateContext = true} = props ?? {};
  const {setInputFieldState} = useContext(NewPostContext);

  const onSuccessRes = response => {
    if (response) {
      const {email, fullName, phoneNumber, profilePhoto, rating, staffGroupName, userId} =
        response.consultantDto ?? {};
      const staffInfo = {
        email,
        fullName,
        phoneNumber,
        avatar: profilePhoto,
        agentRating: rating,
        agentGroupDescription: staffGroupName,
        userId,
      };

      if (isUpdateContext) {
        setInputFieldState({
          staffInfo,
        });
      }

      onSuccess && onSuccess(staffInfo);
    }
  };

  const {startApi: startGetStaffByPostId} = useGraphqlApiLazy({
    graphqlApiLazy: useGetStaffByPostIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getConsultantSupportForC2CPostFO',
    onSuccess: onSuccessRes,
    showSpinner: showSpinner ?? false,
  });

  const getStaffByPostId = propertyPostId => {
    startGetStaffByPostId({variables: {propertyPostId}});
  };

  return {getStaffByPostId};
};

export default useGetStaffByPostId;
