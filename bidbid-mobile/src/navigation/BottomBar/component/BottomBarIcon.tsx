import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '@/vars';
import { BID_SCREEN, HOME_SCREEN, MESSAGE_SCREEN, NOTIFICATION_SCREEN } from '@/navigation/screenKeys';
import { isIphoneX } from '@/shared/devices';
import CustomBadgeNotification from '../../../components/CustomBadge/Notification';
import CustomBadgeMessage from '../../../components/CustomBadge/Message';
import CustomBadgeBid from '../../../components/CustomBadge/Bid';
import { getStatusFirstInstall } from '../../../redux/app/selector';
import { getIndexTutorial } from '../../../redux/tutorial/selector';
import { onClickIconFilter, TouchDiscovery } from '../../../shared/global';
import { useSelector } from 'react-redux';
import { TutorialState } from '../../../redux/tutorial/reducer';
import HomeSVG from '../../../components/SVG/HomeSVG';
import HomeOutLineSVG from '../../../components/SVG/HomeOutLineSVG';
import BidSVG from '../../../components/SVG/BidSVG';
import BidOutLineSVG from '../../../components/SVG/BidOutLineSVG';
import NotificationSVG from '../../../components/SVG/NotificationSVG';
import NotificationOutLineSVG from '../../../components/SVG/NotificationOutLineSVG';
import ChatSVG from '../../../components/SVG/ChatSVG';
import ChatOutLineSVG from '../../../components/SVG/ChatOutLineSVG';
import ProfilePurpleSVG from '../../../components/SVG/ProfilePurpleSVG';
import ProfileTabarSVG from '../../../components/SVG/ProfileTabarSVG';

interface BottomBarIconProp {
  label: string;
  options: any;
  isFocused: boolean;
  index: number;
  route: any;
  navigation: any;
}

function BottomBarIcon(props: BottomBarIconProp) {
  const { label, options, isFocused, index, route, navigation } = props;
  const indexTutorial = useSelector((state: TutorialState) => state.tutorial.index);

  if (getStatusFirstInstall() && indexTutorial === 0) return <View style={styles.WrapContainerTutorial} />;

  const getGradientIcon = (screenName: string, isFocused = false) => {
    switch (screenName) {
      case HOME_SCREEN:
        return isFocused ? <HomeSVG /> : <HomeOutLineSVG />;
      case BID_SCREEN:
        return isFocused ? <BidSVG /> : <BidOutLineSVG />;
      case NOTIFICATION_SCREEN:
        return isFocused ? <NotificationSVG /> : <NotificationOutLineSVG />;
      case MESSAGE_SCREEN:
        return isFocused ? <ChatSVG /> : <ChatOutLineSVG />;
      default:
        return isFocused ? <ProfilePurpleSVG /> : <ProfileTabarSVG />;
    }
  };

  const renderIcon = () => {
    if (label === NOTIFICATION_SCREEN) {
      return <CustomBadgeNotification isFocused={isFocused} getGradientIcon={getGradientIcon} label={label} />;
    } else if (label === MESSAGE_SCREEN) {
      return <CustomBadgeMessage isFocused={isFocused} getGradientIcon={getGradientIcon} label={label} />;
    } else if (label === BID_SCREEN) {
      return <CustomBadgeBid isFocused={isFocused} getGradientIcon={getGradientIcon} label={label} />;
    }
    const isEnableIconBid = indexTutorial === 5 && getStatusFirstInstall();

    return getGradientIcon(label, isEnableIconBid ? false : isFocused);
  };

  const onPressItem = () => {
    if (getStatusFirstInstall()) {
      getIndexTutorial() === 5 && route.name === BID_SCREEN && onClickIconFilter.next(TouchDiscovery.Back);
      return;
    }
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <Pressable
      key={index}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPressItem}
      style={[styles.wrapIcon, getStatusFirstInstall() && indexTutorial === 0 && styles.wrapViewBottom]}
    >
      {renderIcon()}
    </Pressable>
  );
}

export default memo(BottomBarIcon);

const styles = StyleSheet.create({
  wrapIcon: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    paddingTop: isIphoneX() ? 25 : 15,
    paddingBottom: isIphoneX() ? 40 : 17,
  },
  WrapContainerTutorial: {
    backgroundColor: colors.purple,
  },
  wrapViewBottom: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});
