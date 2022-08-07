import {useRoute} from '@react-navigation/native';
import get from 'lodash/get';
import React, {useRef, useState} from 'react';
import {useSelector} from 'react-redux/lib/hooks/useSelector';

import {useGetUserByIdLazyQuery} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {getUserId} from '../../appData/user/selectors';
import {FETCH_POLICY} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import BaseScreen from '../../components/BaseScreen';
import {Captcha} from '../../components/RecaptchaV2/Captcha';
import {useMount} from '../commonHooks';
import ScreenIds from '../ScreenIds';
import GeneralRequestForm from './components/GeneralRequestForm';

const CreateGeneralRequestScreen = () => {
  const route = useRoute();
  const c2cDemand = get(route?.params, 'c2cDemand', null);

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
        title={translate('c2CGeneralRequest.updateRequest')}>
        <GeneralRequestForm
          isUpdate={true}
          userInfo={userInfo}
          captchaRef={captchaRef}
          c2CDemand={c2cDemand}
        />
      </BaseScreen>
    </Captcha>
  );
};

export default CreateGeneralRequestScreen;
