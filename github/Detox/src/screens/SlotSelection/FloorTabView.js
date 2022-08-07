import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {withSpring} from 'react-native-reanimated';
import {TabBar} from 'react-native-tab-view';
import {useSelector} from 'react-redux';

import {isMember} from '../../appData/user/selectors';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import CustomTabView from '../../components/CustomTabView';
import {safeExtractNumber} from '../../utils/DataProcessUtil';
import {useLogin} from '../Auth/useLogin';
import {useMountInteraction} from '../commonHooks';
import PropertyType from '../ManagePost/PropertyType';
import {SelectFloor} from './components/SelectFloor';
import FloorList from './FloorList';
import {FloorTabContext, routeKeys} from './FloorTabContext';
import PropertyNumberInfo from './PropertyNumberInfo';

const styles = StyleSheet.create({
  constainer: {
    ...HELPERS.fill,
    // ...HELPERS.mainCenter,
  },
  tabbar: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    elevation: 0,
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0,
  },
  indicatorStyle: {
    backgroundColor: COLORS.TRANSPARENT,
  },
  sceneContainerStyle: {
    ...HELPERS.fill,
  },
  message: {
    ...HELPERS.selfCenter,
    ...FONTS.regular,
    fontSize: 14,
    marginTop: 220,
    color: COLORS.TEXT_DARK_40,
  },
});

const routes = [
  {key: routeKeys.all, title: routeKeys.all},
  {key: routeKeys.empty, title: routeKeys.empty},
  {key: routeKeys.booked, title: routeKeys.booked},
  {key: routeKeys.deposit, title: routeKeys.deposit},
];

const FloorTabView = ({
  propertyType,
  projectStatus,
  isLoading,
  data,
  consultantInfo,
  saleSeasonId,
  openFilterFloor,
  shouldShowFilterFloor,
  selectedFloors,
  totalFloor,
  scrollSelectionList,
  headerStyle2,
  onPressApartment,
}) => {
  const {state, setState} = useContext(FloorTabContext);
  const [initTabIndex, setInitTabIndex] = useState(0);
  const {notLoggedIn} = useLogin();
  const isMemberUser = useSelector(isMember);

  useEffect(() => {
    if (isEmpty(data)) {
      setState({propertyPosts: []});
    } else if (data && data.propertyPosts) {
      setState({propertyPosts: data.propertyPosts});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const {
    totalOfPropertyPosts,
    totalOfEmptyPropertyPosts,
    totalOfSoldPropertyPosts,
    totalOfBookedPropertyPosts,
  } = data ?? {};

  const renderScene = ({route}) => {
    return (
      <FloorList
        saleSeasonId={saleSeasonId}
        routeKey={route.key}
        scrollSelectionList={scrollSelectionList}
        consultantInfo={consultantInfo}
        propertyType={propertyType}
        propertyPosts={state.propertyPosts}
        onPressApartment={onPressApartment}
        projectStatus={projectStatus}
      />
    );
  };

  useMountInteraction(() => {
    if (notLoggedIn || isMemberUser) {
      setInitTabIndex(1);
    }
  });

  const renderLabel = ({route, focused}) => {
    let color = COLORS.CIRCLE_BACKGROUND;
    let title =
      propertyType === PropertyType.land
        ? translate(STRINGS.TOTAL_LAND)
        : translate(STRINGS.TOTAL_PLACE);
    const totalCount = safeExtractNumber(totalOfPropertyPosts);
    let count = 0;
    switch (route.key) {
      case routeKeys.all:
        color = COLORS.BLUE_D6;
        count = totalCount;
        break;
      case routeKeys.empty:
        color = COLORS.CIRCLE_AVAILABLE_BACKGROUND;
        title = translate(STRINGS.EMPTY);
        count = safeExtractNumber(totalOfEmptyPropertyPosts);
        break;
      case routeKeys.booked:
        color = COLORS.CIRCLE_BOOKED_BACKGROUND;
        title = translate(STRINGS.BOOKED);
        count = safeExtractNumber(totalOfBookedPropertyPosts);
        break;
      case routeKeys.deposit:
        color = COLORS.CIRCLE_DEPOSIT_BACKGROUND;
        title = translate('sold');
        count = safeExtractNumber(totalOfSoldPropertyPosts);
        break;
    }
    return (
      <PropertyNumberInfo
        total={totalCount}
        count={count}
        title={title}
        focused={focused}
        tabColor={color}
      />
    );
  };

  const renderTabBar = props => {
    return (
      <Animated.View style={headerStyle2}>
        <TabBar
          {...props}
          renderLabel={renderLabel}
          indicatorStyle={styles.indicatorStyle}
          style={styles.tabbar}
        />
        {shouldShowFilterFloor && (
          <SelectFloor
            selectedFloors={selectedFloors}
            totalFloor={totalFloor}
            onPress={openFilterFloor}
          />
        )}
      </Animated.View>
    );
  };

  const onIndexChange = () => {
    scrollSelectionList.value = withSpring(0);
  };

  return (
    <View style={styles.constainer}>
      {isLoading ? (
        <Text style={styles.message}>{translate(STRINGS.LOADING)}</Text>
      ) : (
        <CustomTabView
          sceneContainerStyle={styles.sceneContainerStyle}
          routes={routes}
          defaultIndex={initTabIndex}
          renderScene={renderScene}
          customTabBar={renderTabBar}
          onIndexChange={onIndexChange}
          isLazy={true}
        />
      )}
    </View>
  );
};

export default FloorTabView;
