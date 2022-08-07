import React, { useState } from 'react';
import { View, ImageBackground, Image } from 'react-native';
import { CustomHeader } from '../CustomHeader';
import { MENU, LOGO_WHITE, HOME_BG, NOTIFICATION } from '@src/constants/icons';
import { StatisticsButton } from '../CustomButton';
import styles from './styles';
import translate from '@src/localize';
import { isManagerApp } from '@src/utils';
import NavigationActionsService from '@src/navigation/navigation';
import { NOTIFICATIONS, NOTIFICATIONS_TENANT } from '@src/constants/screenKeys';

interface HomeHeaderProps {
  numberTenants?: string;
  numberStaffs?: string;
  onPressMenu?: () => void;
  onPressTenants?: () => void;
  onPressStaffs?: () => void;
  notificationBadge?: number;
}
const HomeHeader = (props: HomeHeaderProps) => {

  const onPressNotification = () => {
    if (isManagerApp()) {
      NavigationActionsService.push(NOTIFICATIONS);
    } else {
      NavigationActionsService.push(NOTIFICATIONS_TENANT);
    }
  };

  const renderMainHeader = () => {
    return (
      <View style={styles.mainHeaderContainer}>
        <Image resizeMode="contain" source={LOGO_WHITE} />
      </View >
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
              notificationBadge={props.notificationBadge && props.notificationBadge}
            />
          </View>
          <View style={styles.statisticsButtonsContainer}>
            <StatisticsButton
              text={translate('home.tenants')}
              onPress={props.onPressTenants}
              statisticsNumber={props.numberTenants ? props.numberTenants : '0'}
              style={styles.statisticsButtonLeft}
            />
            <StatisticsButton
              text={translate('home.staffs')}
              onPress={props.onPressStaffs}
              statisticsNumber={props.numberStaffs ? props.numberStaffs : '0'}
              style={styles.statisticsButtonRight}
            />
          </View>
        </ImageBackground>
      </View>
    );
  };

  return <View>{renderHeader()}</View>;
};

export default React.memo(HomeHeader);
