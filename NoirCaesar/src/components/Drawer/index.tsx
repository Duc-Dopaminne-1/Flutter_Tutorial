import { View, StatusBar, ScrollView, Platform, FlatList, AsyncStorage } from 'react-native';
import React from 'react';
import styles from './styles';
import Container from '../Container';
import { CustomHeader } from '../CustomHeader';
import { useDispatch } from 'react-redux';
import NavigationActionsService from '@src/navigation/navigation';
import { toAuth, toggleDrawer } from '@src/navigation';
import { logout } from '@src/modules/auth/actions';
import { DRAWER_BG, CLOSE } from '@src/constants/icons';
import { CustomText } from '../CustomText';
import translate from '@src/localize';
import { listMenu, MenuItem, TagMenuItem } from '@src/constants/app';
import Rate, { AndroidMarket, IConfig } from 'react-native-rate';
//@ts-ignore
import { APPLE_APP_ID, PACKAGE_NAME } from 'react-native-dotenv';
import {
  TERMS_OF_SERVICE,
  COPYRIGHT,
  PROFILE,
  BLOG,
  ABOUT,
  CHANNEL,
  ORDERS,
  BUY_COINS_SCREEN,
  SUBSCRIPTION_SCREEN,
} from '@src/constants/screenKeys';
import { CustomTouchable } from '../CustomTouchable';
import TrackPlayer from 'react-native-track-player';
import { clearOrder } from '@src/modules/payment/actions';
import NotificationsService from '@src/modules/notifications/service';
import NotificationSwitch from './NotificationSwitch';
import MyProfileView from './MyProfileView';
import { unregisterToken } from '@src/modules/notifications/notification/actions';
import { SocketService } from '@src/modules/chat/socket/service';

const Drawer = () => {
  const dispatch = useDispatch();

  const onTapItem = (e: MenuItem) => {
    switch (e.tag) {
      case TagMenuItem.buycoin:
        pushToScreen(BUY_COINS_SCREEN);
        break;
      case TagMenuItem.messaging:
        pushToScreen(CHANNEL);
        break;
      case TagMenuItem.subscription:
        pushToScreen(SUBSCRIPTION_SCREEN);
        break;
      case TagMenuItem.orders:
        dispatch(clearOrder());
        pushToScreen(ORDERS);
        break;
      case TagMenuItem.blog:
        pushToScreen(BLOG);
        break;
      case TagMenuItem.notifications:
        break;
      case TagMenuItem.rate_this_app:
        handleAppRating();
        break;
      case TagMenuItem.about:
        pushToScreen(ABOUT);
        break;
      case TagMenuItem.terms_of_service:
        pushToScreen(TERMS_OF_SERVICE);
        break;
      case TagMenuItem.copyright:
        pushToScreen(COPYRIGHT);
        break;
      case TagMenuItem.logout:
        onLogout();
        break;
    }
  };

  const navigateToPlayStore = (options: IConfig) => {
    NavigationActionsService.showCustomPopup({
      text: 'Enjoy our app so far? Please take a moment to rate us in the Play Store.',
      buttonRedTitle: 'OK',
      buttonGrayTitle: 'Cancel',
      onPressRedButton: () => {
        NavigationActionsService.hideCustomPopup();
        Rate.rate(options, () => { });
      },
    });
  };

  const handleAppRating = () => {
    try {
      const iOSPlatform = Platform.OS === 'ios';

      const options: IConfig = {
        AppleAppID: APPLE_APP_ID,
        GooglePackageName: PACKAGE_NAME,
        preferredAndroidMarket: AndroidMarket.Google,
        preferInApp: iOSPlatform,
        openAppStoreIfInAppFails: true,
      };

      if (iOSPlatform) Rate.rate(options, () => { });
      else navigateToPlayStore(options);
    } catch (error) {
      console.log('Drawer.handleAppRating(): failed with error=', error);
    }
  };

  const pushToScreen = (screenName: string, passProps?: any) => {
    const useAnimate = Platform.OS === 'android';
    if (Platform.OS === 'ios') {
      NavigationActionsService.push(screenName, passProps, true, useAnimate);
    } else {
      toggleDrawer(false);
      setTimeout(() => {
        NavigationActionsService.push(screenName, passProps, true, useAnimate);
      }, 50);
    }
  };

  const onLogout = () => {
    NavigationActionsService.showCustomPopup({
      text: translate('alert.message_logout'),
      buttonRedTitle: translate('authentication.logout'),
      buttonGrayTitle: translate('alert.cancel'),
      onPressRedButton: () => {
        NavigationActionsService.hideCustomPopup();
        handleLogout();
      },
    });
  };

  const removeNotificationService = async (callback: () => void) => {
    NotificationsService.getInstance().unRegisterNotificationListeners();

    const fcmToken = await AsyncStorage.getItem('fcmToken');
    if (fcmToken) {
      await AsyncStorage.removeItem('fcmToken');
      dispatch(
        unregisterToken({
          registrationID: fcmToken,
          onSuccess: callback,
          onFail: error => {
            console.log('NotificationsService.unregisterToken(): error=', error);
            callback();
          },
        }),
      );
    } else {
      callback();
    }
  };

  const handleLogout = () => {
    TrackPlayer.stop();
    SocketService.getInstance().closeSocket();
    removeNotificationService(() => {
      dispatch(logout({}));
      setTimeout(() => {
        NavigationActionsService.hideLoading();
        toAuth();
      }, 500);
    });
  };

  const onTapOnMyProfile = () => {
    pushToScreen(PROFILE, { isFromSideMenu: true })
  };

  const onLeftAction = () => {
    NavigationActionsService.popToRoot();
    setTimeout(() => {
      NavigationActionsService.toggleDrawer(false);
    }, 700);
  };

  const renderMenuItem = ({ item, index }: { item: MenuItem; index: number }) => {
    return (
      <CustomTouchable onPress={onTapItem.bind(undefined, item)}>
        <View style={styles.containerList} key={index}>
          <CustomText style={styles.textItem} text={item.title} />
          {item.tag != TagMenuItem.notifications ? null : <NotificationSwitch />}
        </View>
      </CustomTouchable>
    );
  };

  const renderListMenu = () => {
    return (
      <ScrollView style={styles.scrollView} contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false}>
        <FlatList
          style={{ flex: 1 }}
          keyExtractor={(item: MenuItem, index: number) => `${item.tag}-${index}`}
          data={listMenu}
          renderItem={renderMenuItem}
        />
      </ScrollView>
    );
  };

  return (
    <Container image={DRAWER_BG}>
      {Platform.OS === 'ios' ? <StatusBar barStyle="default" /> : undefined}
      <View style={styles.container}>
        <CustomHeader containerStyle={{ backgroundColor: 'transparent' }} leftImage={CLOSE} leftAction={onLeftAction} />
        <MyProfileView onTapOnMyProfile={onTapOnMyProfile} />
        {renderListMenu()}
      </View>
    </Container>
  );
};

export default Drawer;
