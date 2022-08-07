import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors } from '@/vars';
import { language } from '@/i18n';
import { getCareerStrengths } from '@/redux/user/actions';
import NavigationActionsService from '@/navigation/navigation';
import { CustomStrengths } from '@/components/CustomStrengths';
import { saveProfile } from '@/redux/createProfile/actions';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import ErrorMessage from '@/components/ErrorMessage';
import { CREATE_SOCIAL_INTEREST_SCREEN } from '@/navigation/screenKeys';
import { alertError } from '@/shared/alert';

export function CareerStrengthsScreen(): ReactElement {
  const [dataList, setDataList] = useState([]);
  const [dataSelectedList, setDataSelectedList] = useState([]);
  const [isError, setIsError] = useState(false);
  const maxSelected = 5;

  useEffect(() => {
    NavigationActionsService.dispatchAction(
      getCareerStrengths({
        onSuccess,
        onFail: onFail,
      }),
    );
  }, []);

  const onSuccess = (data: any) => {
    setDataList(data ? data.items : []);
  };

  const onFail = (error: string) => {
    alertError(error);
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

  const saveOnPressed = () => {
    if (dataSelectedList.length < 2) {
      setIsError(true);
      return;
    }

    NavigationActionsService.dispatchAction(
      saveProfile({
        career: dataSelectedList,
      }),
    );
    NavigationActionsService.push(CREATE_SOCIAL_INTEREST_SCREEN);
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomWrapHeader title={language('register.careerTitle')} note={language('' + 'register.careerSubtitle')} />

      <View style={styles.wrapError}>
        <ErrorMessage errorValue={isError ? language('register.careerError') : ''} />
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
