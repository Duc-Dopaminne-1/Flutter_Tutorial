import { language } from '@/i18n';
import { PROFILE_EDIT_GENERAL, SAFETY_SCREEN, SETTING_SCREEN } from '@/navigation/screenKeys';
import ErrorDialog from '@/screens/DeletetAccount/ErrorDialog';
import { ProfileEditInfoItem } from '@/screens/Profile/component/ProfileEditInfoItem';
import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useState } from 'react';
import { Pressable, View } from 'react-native';
import SettingProfileSVG from '@/components/SVG/SettingProfileSVG';
import ProfileSVG from '@/components/SVG/ProfileSVG';
import SafetySVG from '@/components/SVG/SafetySVG';

type CellType = 'Settings' | 'EditProfile' | 'Safety' | 'Logout';

export function ProfileEditInfo(): ReactElement {
  const navigation = useNavigation();
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);

  const cellOnPressed = async (type: CellType) => {
    switch (type) {
      case 'Settings':
        navigation.navigate(SETTING_SCREEN);
        break;
      case 'EditProfile':
        navigation.navigate(PROFILE_EDIT_GENERAL);
        break;
      case 'Safety':
        navigation.navigate(SAFETY_SCREEN);
        break;
      default:
        break;
    }
  };

  const onPressSetting = () => cellOnPressed('Settings');

  const onPressEditProfile = () => cellOnPressed('EditProfile');

  const onPressEditInfoItem = () => cellOnPressed('Safety');

  return (
    <View>
      <Pressable onPress={onPressSetting}>
        <ProfileEditInfoItem icon={<SettingProfileSVG />} title={language('settings')} />
      </Pressable>
      <Pressable onPress={onPressEditProfile}>
        <ProfileEditInfoItem icon={<ProfileSVG />} title={language('editProfile')} />
      </Pressable>
      <Pressable onPress={onPressEditInfoItem}>
        <ProfileEditInfoItem icon={<SafetySVG />} title={language('safety')} />
      </Pressable>
      <ErrorDialog
        isVisible={errorDialogVisible}
        onBackdropPress={() => setErrorDialogVisible(false)}
        errorMessage={language('editProfileHasLiveAuctionError')}
        confirmOnPressed={() => setErrorDialogVisible(false)}
      />
    </View>
  );
}
