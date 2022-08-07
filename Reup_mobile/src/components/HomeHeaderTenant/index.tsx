import React from 'react';
import { View, ImageBackground, Image } from 'react-native';
import { CustomHeader } from '../CustomHeader';
import { MENU, LOGO_WHITE, HOME_BG, AVATAR_DEFAULT_RECTANGLE, NOTIFICATION } from '@src/constants/icons';
import styles from './styles';
import { CustomText } from '../CustomText';
import CircleAvatar from '../CircleAvatar';
import { isManagerApp } from '@src/utils';
import NavigationActionsService from '@src/navigation/navigation';
import { NOTIFICATIONS, NOTIFICATIONS_TENANT } from '@src/constants/screenKeys';

interface HomeHeaderTenantProps {
  avatar?: string,
  name?: string,
  address?: string
  onPressMenu?: () => void;
  notificationBadge?: number,
}

const HomeHeaderTenant = (props: HomeHeaderTenantProps) => {

  const onPressNotification = () => {
    if (isManagerApp()) {
      NavigationActionsService.push(NOTIFICATIONS);
    } else {
      NavigationActionsService.push(NOTIFICATIONS_TENANT);
    }
  };

  const renderMainHeader = () => {
    return (
      <View>
        <View style={styles.mainHeaderContainer}>
          <Image resizeMode="contain" source={LOGO_WHITE} />
        </View >
        <View style={styles.avatarContainer}>
          <CircleAvatar
            borderColor={"#ffffff"}
            resizeMode="contain"
            avatar={props.avatar ? props.avatar : AVATAR_DEFAULT_RECTANGLE}
            size={84}
            name={props.name ? props.name : ""} />
        </View >
        <View style={styles.infoContainer}>
          <CustomText text={props.name ? props.name : ""} style={styles.name} />
          <CustomText text={props.address ? props.address : ""} style={styles.address} styleContainer={styles.addressContainer} />
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <ImageBackground source={HOME_BG} style={styles.containerHeader}>
          <View style={styles.imageBackground}>
            <CustomHeader
              customComponent={renderMainHeader()}
              styleHeader={styles.headerContent}
              rightImage={MENU}
              rightImageStyle={styles.rightImageStyle}
              rightImageStyle2={styles.rightImageStyle}
              rightImage2={NOTIFICATION}
              rightAction2={onPressNotification}
              rightAction={props.onPressMenu}
              notificationBadge={props.notificationBadge ? props.notificationBadge : 0}
            />
          </View>
        </ImageBackground>
      </View>
    );
  };

  return <View>{renderHeader()}</View>;
};

export default React.memo(HomeHeaderTenant);
