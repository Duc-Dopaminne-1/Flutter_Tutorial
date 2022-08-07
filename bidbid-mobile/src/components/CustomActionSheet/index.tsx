import React, { forwardRef } from 'react';
import ActionSheet from 'react-native-actionsheet';
import { language } from '@/i18n';
import { isIOS } from '@/shared/devices';
import { MeetPlace } from '@/models';
import { Linking, Clipboard } from 'react-native';

interface CustomActionSheetProps {
  meetPlace?: MeetPlace;
}

function CustomActionSheet(props: CustomActionSheetProps, ref) {
  const { meetPlace } = props;
  const { name, lng, lat, placeId } = meetPlace ?? { name: '', lng: '', lat: '', placeId: '' };
  const chooseOptionsIos = [language('appleMaps'), language('googleMaps'), language('copyAddress'), language('cancel')];
  const chooseOptionsAndroid = [language('googleMaps'), language('copyAddress'), language('cancel')];
  const chooseOptions = isIOS ? chooseOptionsIos : chooseOptionsAndroid;
  const cancelButtonIndex = isIOS ? 3 : 2;
  const encodedTitle = encodeURIComponent(name);
  const urlGg = 'https://www.google.com/maps/dir/?api=1';
  const urlApple = 'maps://?ll=';
  const linkGgMap = `${urlGg}&destination=${encodedTitle}&destination_place_id=${placeId}`;
  const linkAppleMap = `${urlApple}${lat},${lng}&q=${encodedTitle}`;

  const handleChoosePictureActionSheet = index => {
    switch (index) {
      case 0:
        isIOS ? Linking.openURL(linkAppleMap) : Linking.openURL(linkGgMap);
        break;
      case 1:
        isIOS ? Linking.openURL(linkGgMap) : Clipboard.setString(name);
        break;
      case 2:
        isIOS && Clipboard.setString(name);
        break;
      default:
    }
  };

  return <ActionSheet ref={ref} options={chooseOptions} cancelButtonIndex={cancelButtonIndex} onPress={handleChoosePictureActionSheet} />;
}

export default forwardRef(CustomActionSheet);
