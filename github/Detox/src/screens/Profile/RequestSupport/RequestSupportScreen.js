import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {TabBar} from 'react-native-tab-view';

import {
  useGetReceivedServiceTicketsByCurrentUserForFrontOfficeLazyQuery,
  useGetSentServiceTicketsByCurrentUserForFrontOfficeLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import BaseScreen from '../../../components/BaseScreen';
import CustomTabView from '../../../components/CustomTabView';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import RequestSupportList from './RequestSupportList';

const routeKeys = {
  following: 'following',
  followers: 'followers',
};

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: COLORS.PRIMARY_A100,
    height: 3,
    borderRadius: SIZES.BORDER_RADIUS_10,
  },
  tabbarStyle: {
    marginStart: 8,
    backgroundColor: COLORS.BACKGROUND,
    elevation: 0,
  },
  tabTitleActive: {
    ...FONTS.bold,
    fontSize: 12,
    width: SCREEN_SIZE.WIDTH / 2,
    color: COLORS.PRIMARY_A100,
  },
  tabTitle: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.BLACK_33,
  },
});

const renderScene = ({route, focusTime}) => {
  let query = null;
  let dataKey = null;
  let isRequest = true;
  switch (route.key) {
    case routeKeys.following:
      query = useGetSentServiceTicketsByCurrentUserForFrontOfficeLazyQuery;
      dataKey = 'getSentServiceTicketsByCurrentUserForFrontOffice';
      isRequest = true;
      break;
    case routeKeys.followers:
      query = useGetReceivedServiceTicketsByCurrentUserForFrontOfficeLazyQuery;
      dataKey = 'getReceivedServiceTicketsByCurrentUserForFrontOffice';
      isRequest = false;
      break;
  }
  return (
    <RequestSupportList
      isRequest={isRequest}
      focusTime={focusTime}
      dataKey={dataKey}
      query={query}
    />
  );
};

const renderLabel = ({route, focused}) => {
  const textStyle = focused ? styles.tabTitleActive : styles.tabTitle;
  return <Text style={textStyle}>{`${route.title}`}</Text>;
};

const renderTabBar = props => {
  return (
    <TabBar
      {...props}
      style={styles.tabbarStyle}
      indicatorStyle={styles.indicator}
      renderLabel={({route, focused}) => renderLabel({route, focused})}
    />
  );
};

const RequestSupportScreen = ({navigation}) => {
  const [focusId, setFocusId] = useState(new Date().getTime());

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setFocusId(new Date().getTime());
    });
    return unsubscribe;
  }, [navigation]);

  const routes = [
    {
      key: routeKeys.following,
      title: translate(STRINGS.SENT),
    },
    {
      key: routeKeys.followers,
      title: translate(STRINGS.RECEIVED),
    },
  ];

  return (
    <BaseScreen title={translate('supportRequest.supportRequest')}>
      <CustomTabView
        routes={routes}
        renderScene={({route}) => renderScene({route, focusTime: focusId})}
        customTabBar={props => renderTabBar(props)}
        isLazy={true}
      />
    </BaseScreen>
  );
};

export default RequestSupportScreen;
