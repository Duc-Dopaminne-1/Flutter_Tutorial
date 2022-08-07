import React, {useRef, useState} from 'react';
import {useSelector} from 'react-redux/lib/hooks/useSelector';

import {useGetUserByIdLazyQuery} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {getUserId} from '../../appData/user/selectors';
import {FETCH_POLICY} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import BaseScreen from '../../components/BaseScreen';
import {Captcha} from '../../components/RecaptchaV2/Captcha';
import {useMount} from '../commonHooks';
import ScreenIds from '../ScreenIds';
import GeneralRequestForm from './components/GeneralRequestForm';

const CreateGeneralRequestScreen = () => {
  const userId = useSelector(getUserId);
  const [userInfo, setUserInfo] = useState(null);

  const {startApi: getUserInfo} = useGraphqlApiLazy({
    graphqlApiLazy: useGetUserByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userById',
    onSuccess: response => {
      setUserInfo(response?.userDto);
    },
  });

  useMount(() => {
    getUserInfo({variables: {userId}});
  });

  const captchaRef = useRef(null);

  return (
    <Captcha ref={captchaRef}>
      <BaseScreen
        testID={ScreenIds.CreateGeneralRequestScreen}
        containerStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
        title={translate(STRINGS.CREATE_REQUEST)}>
        <GeneralRequestForm isUpdate={false} userInfo={userInfo} captchaRef={captchaRef} />
      </BaseScreen>
    </Captcha>
  );
};

export default CreateGeneralRequestScreen;
