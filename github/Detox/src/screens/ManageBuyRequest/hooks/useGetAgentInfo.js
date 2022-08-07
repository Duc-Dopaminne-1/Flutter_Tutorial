import {useContext, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {
  AgentDto,
  useGetAgentDetailLazyQuery,
  useGetUserByIdLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {getUserId, isAgent} from '../../../appData/user/selectors';
import {FETCH_POLICY, MAP_RANK} from '../../../assets/constants';
import {ContactTradingContext} from '../useContactTrading';

const useGetAgentInfo = () => {
  const {setAgentInfo} = useContext(ContactTradingContext);
  const [agentInfoResult, setAgentInfoResult] = useState(null);
  const [userResult, setUserResult] = useState(null);
  const userId = useSelector(getUserId);
  const isAgentUser = useSelector(isAgent);

  const onSuccessGetAgentInfo = (data: AgentDto) => {
    const userData = data ?? {};
    const userAddressToString = userData?.permanentAddress ?? '';
    const userAddressToJson = userAddressToString ? JSON.parse(userAddressToString) : {};
    const userRankName = userData?.agentRankName ?? '';
    const userAddress = {
      city: {
        key: userAddressToJson.cityId ?? null,
        label: userAddressToJson.cityName ?? '',
        value: userAddressToJson.cityId ?? null,
      },
      ward: {
        key: userAddressToJson.wardId ?? null,
        label: userAddressToJson.wardName ?? '',
        value: userAddressToJson.wardId ?? null,
      },
      street: userAddressToJson.streetName ?? '',
      district: {
        key: userAddressToJson.districtId ?? null,
        label: userAddressToJson.districtName ?? '',
        value: userAddressToJson.districtId ?? null,
      },
    };
    const agentRank = MAP_RANK[`${userRankName}`]?.id ?? -1;
    const agentInfoObj = {
      address: userAddress,
      rankId: agentRank,
      agentAddress: userData?.permanentAddress ?? null,
      avatar: userData?.profilePhoto,
    };
    setAgentInfoResult(agentInfoObj);
  };

  useEffect(() => {
    if (userResult) {
      const {email, gender, phoneNumber, firstName, lastName} = userResult ?? {};

      let userObj = {
        gender,
        phoneNumber,
        userId,
        email,
        firstName,
        lastName,
        rankId: -1,
        address: null,
        agentAddress: null,
      };

      if (isAgentUser) {
        userObj = {...userObj, ...agentInfoResult};
      }

      setAgentInfo && setAgentInfo(userObj);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentInfoResult, userResult]);

  const onSuccessGetUserInfo = data => {
    if (data?.userDto) {
      setUserResult(data?.userDto);
    }
  };

  const {startApi: getAgentInfoById} = useGraphqlApiLazy({
    graphqlApiLazy: useGetAgentDetailLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'agentById',
    onSuccess: onSuccessGetAgentInfo,
    showSpinner: false,
    onError: () => {},
  });

  const {startApi: getUserInfoById} = useGraphqlApiLazy({
    graphqlApiLazy: useGetUserByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userById',
    onSuccess: onSuccessGetUserInfo,
    showSpinner: false,
    onError: () => {},
  });

  const startGetUserInfoById = newUserId => {
    const id = newUserId ?? userId;
    getUserInfoById({variables: {userId: id}});
    if (isAgentUser) {
      getAgentInfoById({variables: {agentId: id}});
    }
  };

  return [startGetUserInfoById];
};

export default useGetAgentInfo;
