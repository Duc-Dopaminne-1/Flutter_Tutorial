import CustomItemSetting from '@/components/CustomItemSetting';
import { language } from '@/i18n';
import NavigationActionsService from '@/navigation/navigation';
import { NOTIFICATION_SETTING_SCREEN } from '@/navigation/screenKeys';
import { appLocaleSelector } from '@/redux/app/selector';
import { notificationSettngSelector } from '@/redux/notification/selector';
import React, { memo, ReactElement } from 'react';
import IconGrayNotificationSVG from '@/components/SVG/IconGrayNotificationSVG';

const NotificationsContainer = (): ReactElement => {
  const { totalEnable, totalDisable } = notificationSettngSelector();
  appLocaleSelector();
  return (
    <CustomItemSetting
      title={language('notifications')}
      content={language('totalNotification', { enabled: totalEnable, disabled: totalDisable })}
      onPress={() => {
        NavigationActionsService.push(NOTIFICATION_SETTING_SCREEN);
      }}
      image={<IconGrayNotificationSVG />}
    />
  );
};

export default memo(NotificationsContainer);
