import CustomItemSetting from '@/components/CustomItemSetting';
import { language } from '@/i18n';
import NavigationActionsService from '@/navigation/navigation';
import { SHARE_CONTACT_SCREEN } from '@/navigation/screenKeys';
import { isAndroid } from '@/shared/devices';
import { shareContacts } from '@/shared/shareContacts';
import React, { memo, ReactElement, useCallback, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import Contacts from 'react-native-contacts';
import { check, openSettings, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ShareSVG from '@/components/SVG/ShareSVG';

const ShareBidBidContainer = (): ReactElement => {
  const countClickShare = useRef(0);
  const onPressShareBidBid = useCallback(async () => {
    countClickShare.current += 1;
    if (isAndroid) {
      (await shareContacts.hasAndroidPermission()) && getContact();
    } else {
      getContact();
    }
  }, []);

  const getContact = () => {
    Contacts.getAll()
      .then(contacts => {
        shareContacts.filterContact(contacts);
        NavigationActionsService.push(SHARE_CONTACT_SCREEN);
      })
      .catch(async _e => {
        if (countClickShare.current > 1) {
          let checkResult = await check(Platform.OS === 'ios' ? PERMISSIONS.IOS.CONTACTS : PERMISSIONS.ANDROID.READ_CONTACTS);
          if (!(checkResult === RESULTS.GRANTED)) {
            openSettings();
          }
        }
      });
  };

  return (
    <CustomItemSetting
      onPress={onPressShareBidBid}
      containerStyle={styles.container}
      title={language('shareBidBid')}
      image={<ShareSVG />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
});

export default memo(ShareBidBidContainer);
