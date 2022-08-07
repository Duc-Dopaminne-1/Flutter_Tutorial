import {useState} from 'react';

import {useGetUserByIdLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useGetUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const onSuccessGetUserInfo = data => {
    const userDto = data?.userDto ?? {};
    const userGender = userDto?.gender ?? '';
    const userPhoneNumber = userDto?.phoneNumber ?? '';
    const userId = userDto?.userId ?? '';
    const userEmail = userDto?.email ?? '';
    const userFirstName = userDto?.firstName ?? '';
    const userLastName = userDto?.lastName ?? '';
    const userInfoObj = {
      gender: userGender,
      phoneNumber: userPhoneNumber,
      userId: userId,
      email: userEmail,
      firstName: userFirstName,
      lastName: userLastName,
      address: '{}',
    };
    setUserInfo(userInfoObj);
  };
  const {startApi: getUserInfoById, loading: loadingGetUserInfoById} = useGraphqlApiLazy({
    graphqlApiLazy: useGetUserByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userById',
    onSuccess: onSuccessGetUserInfo,
  });
  const startGetUserInfoById = userId => {
    getUserInfoById({variables: {userId: userId}});
  };

  return [userInfo, loadingGetUserInfoById, startGetUserInfoById];
};

export default useGetUserInfo;
