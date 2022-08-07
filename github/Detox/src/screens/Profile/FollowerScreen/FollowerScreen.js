import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {TabBar} from 'react-native-tab-view';

import {COMMENT_OBJECT_TYPES} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import BaseScreen from '../../../components/BaseScreen';
import CustomTabView from '../../../components/CustomTabView';
import useFollowSocial from '../../../hooks/useFollowSocial';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import FollowerList from './FollowerList';

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

const renderScene = ({route}) => {
  let type = null;
  switch (route.key) {
    case routeKeys.following:
      type = 'following';
      break;
    case routeKeys.followers:
      type = 'followers';
      break;
  }
  return <FollowerList type={type} />;
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

const FollowTabs = ({route}) => {
  const {id} = route.params;

  const {followInfo} = useFollowSocial({
    feedObjectId: id,
    feedObjectTypeId: COMMENT_OBJECT_TYPES.TOPENER,
  });

  const routes = [
    {
      key: routeKeys.following,
      title: `${translate('social.following')} (${followInfo.totalFollowing})`,
    },
    {
      key: routeKeys.followers,
      title: `${translate('social.follower')} (${followInfo?.totalFollower})`,
    },
  ];

  return (
    <BaseScreen title={translate('social.list.title')}>
      {followInfo?.totalFollower >= 0 && (
        <CustomTabView
          routes={routes}
          // eslint-disable-next-line no-shadow
          renderScene={({route}) => renderScene({route})}
          customTabBar={props => renderTabBar(props)}
          isLazy={true}
        />
      )}
    </BaseScreen>
  );
};

export default FollowTabs;
