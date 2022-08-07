import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors } from '@/vars';
import { language } from '@/i18n';
import { getInterest, updateProfilePicture } from '@/redux/user/actions';
import NavigationActionsService from '@/navigation/navigation';
import { CustomStrengths } from '@/components/CustomStrengths';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import ErrorMessage from '@/components/ErrorMessage';
import { useSelector } from 'react-redux';
import { CreateProfileInit } from '@/redux/createProfile/reducer';
import { createProfile } from '@/redux/createProfile/actions';
import Spinner from '@/components/Spinner';

export function SocialInterestsScreen(): ReactElement {
  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [dataSelectedList, setDataSelectedList] = useState([]);
  const [isError, setIsError] = useState(false);
  const {
    email,
    firstName,
    lastName,
    dateOfBirth,
    genderId,
    instagramUsername,
    photos,
    career,
    hideAge,
    categories,
    isSkipPhoneNumber,
    avatar,
    providerId,
    languages,
  } = useSelector((state: CreateProfileInit) => state.createProfile);

  const maxSelected = 5;

  useEffect(() => {
    NavigationActionsService.dispatchAction(
      getInterest({
        isFromRegister: true,
        onSuccess,
      }),
    );
  }, []);

  const onSuccess = (data: any) => {
    setDataList(data ? data.items : []);
  };

  const onPressedItem = item => {
    if (isError) {
      setIsError(false);
    }
    let newArray = [...dataSelectedList];
    if (dataSelectedList.includes(item.id)) {
      newArray = dataSelectedList.filter(i => i !== item.id);
    } else {
      if (newArray.length < maxSelected) newArray.push(item.id);
    }
    setDataSelectedList(newArray);
  };

  const onSuccessProfile = () => {
    const data = new FormData();
    data.append('file', avatar as any);
    NavigationActionsService.dispatchAction(
      updateProfilePicture(data, {
        onSuccess: () => {
          setIsLoading(false);
          NavigationActionsService.getInitApp(true);
        },
        onFail: () => {
          setIsLoading(false);
          Alert.alert(language('pleaseTryAgain'));
        },
      }),
    );
  };

  const saveOnPressed = () => {
    if (dataSelectedList.length < 2) {
      setIsError(true);
      return;
    }

    setIsLoading(true);
    const data = new FormData();
    data.append('email', email);
    data.append('firstName', firstName);
    data.append('lastName', lastName);
    data.append('instagramUsername', instagramUsername);
    data.append('dateOfBirth', dateOfBirth);
    data.append('genderId', genderId);
    providerId && data.append('providerId', providerId);
    data.append('hideAge', hideAge + '');
    photos.forEach((item: any) => {
      data.append('avatar', item);
    });

    languages.forEach((item: any) => {
      data.append('languageIds[]', item.id);
    });

    career.forEach((item: any) => {
      data.append('strengthIds[]', item);
    });

    categories.forEach((item: any) => {
      data.append('categoryIds[]', item);
    });

    dataSelectedList.forEach((item: any) => {
      data.append('interestIds[]', item);
    });

    NavigationActionsService.dispatchAction(
      createProfile({
        data,
        isSkipPhoneNumber,
        onSuccess: onSuccessProfile,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <Spinner loading={isLoading} />
      <CustomWrapHeader title={language('register.socialTitle')} note={language('' + 'register.socialSubtitle')} />

      <View style={styles.wrapError}>
        <ErrorMessage errorValue={isError ? language('register.socialError') : ''} />
      </View>

      <CustomStrengths
        onPressedItem={onPressedItem}
        dataSelectedList={dataSelectedList}
        dataList={dataList}
        saveOnPressed={saveOnPressed}
        maxSelected={maxSelected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  wrapError: {
    alignSelf: 'center',
  },
});
