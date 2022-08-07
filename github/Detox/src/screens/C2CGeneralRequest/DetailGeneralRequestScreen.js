import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux/lib/hooks/useSelector';

import {useGetUserByIdLazyQuery} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {getUserId} from '../../appData/user/selectors';
import {FETCH_POLICY} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {METRICS} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import BaseScreen from '../../components/BaseScreen';
import CustomTabView, {TAB_TYPE} from '../../components/CustomTabView';
import {useMount} from '../commonHooks';
import {NewPostStyles} from '../ManagePost/NewPost/NewPostComponents/NewPostConstant';
import ScreenIds from '../ScreenIds';
import RequestInformationView from './components/RequestInformationView';
import RequestRecentView from './components/RequestRecentView';
import {GENERAL_REQUEST_TYPE} from './constants';
import {useGetDetailGeneralRequest} from './hooks/useGetDetailGeneralRequest';
import {mapGeneralRequestItem} from './utils/generalRequestUtils';

const DetailGeneralRequestScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {demand} = route?.params;

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

  const {data, onRefresh} = useGetDetailGeneralRequest(demand?.c2CDemandId);

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const routes = [
    {key: GENERAL_REQUEST_TYPE.INFORMATION, title: translate('c2CGeneralRequest.requestInfo')},
    {key: GENERAL_REQUEST_TYPE.RECENT, title: translate('c2CGeneralRequest.requestRecent')},
  ];

  const onEditGeneralRequest = () => {
    navigation.navigate(ScreenIds.UpdateGeneralRequestScreen, {c2cDemand: data?.c2CDemandDto});
  };

  const renderScene = ({route}) => {
    if (route?.key === GENERAL_REQUEST_TYPE.INFORMATION) {
      return (
        <RequestInformationView
          generalRequest={mapGeneralRequestItem(data?.c2CDemandDto)}
          userInfo={userInfo}
          onPressEdit={onEditGeneralRequest}
        />
      );
    }
    return <RequestRecentView c2CDemandId={demand?.c2CDemandId} />;
  };

  const [, setTabActive] = useState(0);

  const onChangeTab = e => {
    setTabActive(e);
  };

  const onIndexChange = ({key}) => {
    onChangeTab(key === GENERAL_REQUEST_TYPE.INFORMATION ? 0 : 1);
  };

  return (
    <BaseScreen
      title={demand?.c2CDemandCode ?? translate(STRINGS.DETAIL)}
      containerStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
      testID={ScreenIds.ManageBuyRequest}>
      <CustomTabView
        type={TAB_TYPE.PRIMARY_ORANGE}
        routes={routes}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        isLazy={true}
        sceneContainerStyle={commonStyles.screenContainer}
        enableTabBarCustomStyle={styles.enableTabBarCustomStyle}
        childComponent={
          <>
            <View style={[commonStyles.headerBarShadowContainer, METRICS.smallNormalPaddingBottom]}>
              <View style={commonStyles.headerBarShadow} />
            </View>
            <View style={[NewPostStyles.viewWithIndex, METRICS.smallMarginBottom]} />
          </>
        }
      />
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  enableTabBarCustomStyle: {
    borderBottomColor: COLORS.PRIMARY_B100,
  },
});

export default DetailGeneralRequestScreen;
