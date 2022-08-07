import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TabBar} from 'react-native-tab-view';

import {AppContext} from '../../appData/appContext/appContext';
import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import CustomTabView, {TAB_TYPE} from '../../components/CustomTabView';
import IconTextButton from '../../components/IconTextButton';
import SafeAreaScreenContainer from '../../components/SafeAreaScreenContainer';
import {SizeBox} from '../../components/SizeBox';
import {formatMaxNumber} from '../../utils/NumberUtils';
import {StringeeContext} from '../Call/StringeeContext';
import ScreenIds from '../ScreenIds';
import TabChatHistory from './TabChatHistory';
import TabNotification from './TabNotification';

const routeKeys = {
  message: 'message',
  notification: 'notification',
};

const routes = [
  {
    key: routeKeys.message,
    title: `${translate(STRINGS.MESSAGE)}`,
  },
  {
    key: routeKeys.notification,
    title: `${translate(STRINGS.NOTIFICATION)}`,
  },
];

const mapUnreadCount = (key, unread) => {
  switch (key) {
    case routeKeys.message:
      return unread?.message;
    case routeKeys.notification:
      return unread?.notification;
    default:
      return 0;
  }
};
const renderLabel = ({route, focused, unread}) => {
  const countUnread = mapUnreadCount(route.key, unread) || 0;
  const titleLabel = `${route.title} (${formatMaxNumber(countUnread)})`;
  return (
    <Text style={styles.labelTabBar(focused)} numberOfLines={1}>
      {titleLabel}
    </Text>
  );
};

const renderTabBar = (props, unread) => {
  return (
    <TabBar
      {...props}
      tabStyle={styles.tabStyle}
      style={styles.tabBarStyle}
      indicatorStyle={styles.indicator}
      renderLabel={({route, focused}) => renderLabel({route, focused, unread})}
    />
  );
};

const MessageNotificationScreen = () => {
  const {
    chat: {unreadCount: unreadMessage},
  } = useContext(StringeeContext);
  const {
    state: {unReadNotification},
  } = useContext(AppContext);
  const tabNotifyRef = useRef({});
  const {openModalSortNotify, readAllNotifications} = tabNotifyRef.current;

  const [isShowFilter, setIsShowFilter] = useState();
  const unread = {message: unreadMessage, notification: unReadNotification};

  const onTabChange = route => {
    const {key} = route;
    setIsShowFilter(key === routeKeys.notification);
  };

  const renderScene = ({route}) => {
    const {key} = route;
    if (key === routeKeys.notification) {
      return <TabNotification ref={tabNotifyRef} />;
    }
    return <TabChatHistory />;
  };

  return (
    <SafeAreaScreenContainer
      testID={ScreenIds.MessageNotification}
      style={{backgroundColor: COLORS.NEUTRAL_WHITE}}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{translate(STRINGS.MESSAGE)}</Text>
        {isShowFilter && (
          <View style={styles.rowCenter}>
            <IconTextButton
              onPress={openModalSortNotify}
              image={IMAGES.IC_FILTER}
              iconStyle={styles.iconButton}
            />
            <SizeBox width={SIZES.SEPARATOR_16} />
            <IconTextButton
              onPress={readAllNotifications}
              image={IMAGES.IC_DOUBLE_CHECK}
              iconStyle={styles.iconButton}
            />
          </View>
        )}
      </View>
      <CustomTabView
        type={TAB_TYPE.PRIMARY_ORANGE}
        routes={routes}
        isLazy={true}
        onIndexChange={onTabChange}
        customTabBar={props => renderTabBar(props, unread)}
        renderScene={renderScene}
      />
    </SafeAreaScreenContainer>
  );
};

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    marginTop: SIZES.MARGIN_20,
    paddingHorizontal: SIZES.PADDING_16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.MARGIN_12,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_24,
    flex: 1,
  },
  tabBarStyle: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: 0,
  },
  labelTabBar: focused => ({
    ...(focused ? FONTS.bold : FONTS.regular),
    fontSize: SIZES.FONT_16,
    color: focused ? COLORS.PRIMARY_A100 : COLORS.TEXT_DARK_10,
    textAlign: 'center',
    minWidth: 150,
  }),
  indicator: {
    backgroundColor: COLORS.PRIMARY_B100,
  },
  iconButton: {
    width: 24,
    height: 24,
    tintColor: COLORS.PRIMARY_A100,
  },
});

export default MessageNotificationScreen;
