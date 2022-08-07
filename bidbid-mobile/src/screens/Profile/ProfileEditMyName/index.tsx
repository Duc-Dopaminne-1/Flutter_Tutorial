import React, { ReactElement } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { UserInit } from '@/redux/user/reducer';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import EditMyNamForm from './components/EditMyNamForm';
import NavigationActionsService from '@/navigation/navigation';
import { updateUserName } from '@/redux/user/actions';
import { alertError } from '@/shared/alert';
import IconBack from '@/components/SVG/BackSvg';

export function ProfileEditMyNameScreen(): ReactElement {
  useEnableHardwareBackButton();

  const { firstName, lastName = '' } = useSelector((state: UserInit) => state.user.data);
  const lastNameValid = lastName === null ? '' : lastName;

  const handleUpdateUsername = values => {
    const { firstName, lastName } = values;
    Keyboard.dismiss();
    NavigationActionsService.showLoading();
    NavigationActionsService.dispatchAction(
      updateUserName({ firstName: firstName.trim(), lastName: lastName.trim(), onSuccess: onSuccess, onFail: onFail }),
    );
  };

  const onSuccess = () => {
    NavigationActionsService.hideLoading();
    NavigationActionsService.goBack();
  };

  const onFail = () => {
    NavigationActionsService.hideLoading();
    alertError(language('errorMessage.invalidName'));
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <View style={styles.wrapperHeader}>
        <CustomHeader leftIcon={<IconBack />} titleStyle={styles.title} title={language('profileGeneral.editName')} />
      </View>

      <EditMyNamForm initialValues={{ firstName, lastName: lastNameValid }} onSubmit={handleUpdateUsername} />
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
