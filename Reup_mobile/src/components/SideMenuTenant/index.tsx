import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import styles from './styles';

import {
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import Accordion from 'react-native-collapsible/Accordion';
import { ITEM_RIGHT_ARROW, CLOSE } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';

import {
  HOME_TENANT, MY_PROFILE_TENANT,
  DOCUMENT_TENANT, NOTIFICATIONS_TENANT,
  POST_TENANT, DELIVERIES_TENANT,
  VISITORS_TENANT,
  CALENDAR_SCREEN_TENANT,
  FINANCIAL_MANAGEMENT_TENANT,
  APARTMENTS_TENANT,
  SHOPPING_STORE_TENANT,
  NEW_TASK_TENANT,
  FACILITIES_TENANT, MONTHLY_BILL_TENANT, REQUESTS_TENANT
} from '@src/constants/screenKeys';

import translate from '@src/localize';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@src/modules/auth/actions';
import SideHeader from '../SideHeader';
import { hardMenuData } from './menuItem';
import { CustomTouchable } from '../CustomTouchable';
import FastImage from 'react-native-fast-image';
import SideHeaderTenant from '../SideHeaderTenant';

export interface MenuData {
  key: string;
  title?: string;
  icon?: string;
  subMenus?: MenuData[];
  isActive: boolean;
}

const SideMenuTenant = (props: any) => {
  const [menuData, setMenuData] = useState<MenuData[]>(hardMenuData);
  const [activeSections, setActiveSections] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dispatch = useDispatch();

  const onMenuPressed = (key: string, index: number) => {
    NavigationActionsService.closeDrawer();
    setActiveIndex(-1);
    setTimeout(() => {
      switch (key) {
        case 'home':
          NavigationActionsService.push(HOME_TENANT);
          break;
        case 'my_profile':
          NavigationActionsService.push(MY_PROFILE_TENANT);
          break;
        case 'my_apartments':
          NavigationActionsService.push(APARTMENTS_TENANT);
          break;
        case 'document':
          NavigationActionsService.push(DOCUMENT_TENANT);
          break;
        case 'monthly-bill':
          NavigationActionsService.push(MONTHLY_BILL_TENANT);
          break;
        case 'financial-management':
          NavigationActionsService.push(FINANCIAL_MANAGEMENT_TENANT);
          break;
        case 'calendar':
          NavigationActionsService.push(CALENDAR_SCREEN_TENANT);
          break;
        case 'maintenance-requests':
          NavigationActionsService.push(REQUESTS_TENANT);
          break;
        case 'general_notifications':
          NavigationActionsService.push(NOTIFICATIONS_TENANT);
          break;
        case 'for_lease_for_sale':
          NavigationActionsService.push(POST_TENANT);
          break;
        case 'facilities':
          NavigationActionsService.push(FACILITIES_TENANT);
          break;
        case 'my_delivery':
          NavigationActionsService.push(DELIVERIES_TENANT);
          break;
        case 'incoming_visitors':
          NavigationActionsService.push(VISITORS_TENANT);
          break;
        case 'store':
          NavigationActionsService.push(SHOPPING_STORE_TENANT);
          break;
        case 'log-out':
          onLogout();
          break;
        default:
          Alert.alert('Alert', `This feature is comming soon`);
          break;
      }
    }, 200);
  };

  const handleLogout = () => {
    dispatch(logout({}));
  };

  const onLogout = () => {
    Alert.alert(translate('alert.title_confirm'), translate('alert.message_logout'), [
      {
        text: translate('authentication.logout'),
        style: 'default',
        onPress: () => {
          handleLogout();
        },
      },
      {
        text: translate('alert.cancel'),
        style: 'cancel',
        onPress: () => undefined,
      },
    ]);
  };



  const _renderHeader = (section: MenuData, index: number, isActive: boolean) => {
    return (
      <View
        style={styles.itemMenuHeader}>
        <View style={styles.itemMenuExpandTextContainer}>
          <Text style={styles.itemMenuText}>{section.title}</Text>
        </View>
        <View style={[styles.itemRightArrowContainer, styles.itemRightArrow]}>
          <Image source={ITEM_RIGHT_ARROW} />
        </View>
      </View>
    );
  };

  const _renderContent = (section: MenuData) => {
    const lengthOfMenu = section.subMenus ? section.subMenus.length : 0;

    return (
      <View style={{
        flex: 1,
      }}>
        {section.subMenus && lengthOfMenu > 0 ?
          section.subMenus.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onMenuPressed(item.key, 0)}>
                <View style={[styles.itemSubMenuContainer, index === lengthOfMenu - 1 ? { marginBottom: 10 } : {}]}>
                  <View
                    style={styles.itemSubMenuDot} />
                  <Text style={[styles.itemSubText,]}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            );
          }) :
          <TouchableOpacity onPress={() => onMenuPressed(section.key, 0)}>
            <Text style={styles.itemSubMenuText}>{section.title}</Text>
          </TouchableOpacity>
        }
      </View>
    );
  };

  const _updateSections = (activeSections: any, index: number) => {
    setActiveSections(activeSections);
    setActiveIndex(index);
  };

  const renderMenuItems = (item: MenuData, index: number) => {
    return (
      <View style={styles.itemMenu}>
        {item.subMenus && item.subMenus.length > 0 ?
          <Accordion
            containerStyle={styles.itemMenuExpandContainer}
            align={'center'}
            underlayColor={'transparent'}
            sections={[item]}
            activeSections={activeIndex === index ? activeSections : []}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={(activeSections) => _updateSections(activeSections, index)}
          /> :
          <TouchableOpacity style={styles.itemMenuTextContainer} onPress={() => onMenuPressed(item.key, index)}>
            <Text style={styles.itemMenuText}>{item.title}</Text>
          </TouchableOpacity>
        }
      </View>
    );
  };

  const renderSeparator = () => {
    return (
      <View
        style={styles.separator}
      />
    );
  };

  const onCloseSideMenu = () => {
    NavigationActionsService.closeDrawer();
  };
  return (
    <DrawerContentScrollView {...props}
      scrollEnabled={false}
      style={styles.sideMenuStyle}
      contentContainerStyle={styles.sideMenuContainerStyle}>
      <View style={styles.container}>
        <CustomTouchable onPress={onCloseSideMenu} style={styles.containerClose}>
          <FastImage resizeMode={'contain'} style={styles.close} source={CLOSE} />
        </CustomTouchable>
        <SideHeaderTenant />
        <FlatList
          data={menuData}
          style={styles.menuList}
          contentContainerStyle={{ paddingBottom: 30, }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => renderMenuItems(item, index)}
          ItemSeparatorComponent={renderSeparator}>
        </FlatList>
      </View>
    </DrawerContentScrollView>
  );
};

export default React.memo(SideMenuTenant);
