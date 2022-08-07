import React, { ReactElement } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updateInstagramUsername } from '@/redux/user/actions';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { UserInit } from '@/redux/user/reducer';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import EditInstagramUsernameForm from './components/EditInstagramUsernameForm';
import IconBack from '@/components/SVG/BackSvg';

export function ProfileEditInstagramUsernameScreen(): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEnableHardwareBackButton();

  const { instagramUsername: userName } = useSelector((state: UserInit) => state.user.data);
  const instagramUsername = userName ? userName : '';

  const handleUpdateInstagramUsername = values => {
    Keyboard.dismiss();
    setTimeout(() => {
      dispatch(updateInstagramUsername(values.instagramUsername.trim()));
      navigation.goBack();
    }, 200);
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <View style={styles.wrapperHeader}>
        <CustomHeader leftIcon={<IconBack />} titleStyle={styles.title} title={language('profileGeneral.instagramUsername')} />
      </View>

      <EditInstagramUsernameForm initialValues={{ instagramUsername }} onSubmit={handleUpdateInstagramUsername} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapperHeader: {
    marginBottom: 20,
  },
  title: {
    fontSize: fonts.size.s16,
  },
});
