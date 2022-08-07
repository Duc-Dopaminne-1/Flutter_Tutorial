import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors } from '@/vars';
import { language } from '@/i18n';
import NavigationActionsService from '@/navigation/navigation';
import { CustomStrengths } from '@/components/CustomStrengths';
import { saveProfile } from '@/redux/createProfile/actions';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import { CREATE_CAREER_STRENGTHS_SCREEN } from '@/navigation/screenKeys';
import { alertError } from '@/shared/alert';
import { getCategories } from '@/redux/auction/actions';
import ErrorMessage from '@/components/ErrorMessage';

export function CreateCategoriesScreen(): ReactElement {
  const [dataList, setDataList] = useState([]);
  const [dataSelectedList, setDataSelectedList] = useState([]);
  const [isError, setIsError] = useState(false);
  const maxSelected = null;

  useEffect(() => {
    NavigationActionsService.dispatchAction(
      getCategories({
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
      if (!maxSelected || newArray.length < maxSelected) newArray.push(item.id);
    }
    setDataSelectedList(newArray);
  };

  const saveOnPressed = () => {
    if (dataSelectedList.length === 0) {
      setIsError(true);
      return;
    }
    NavigationActionsService.dispatchAction(
      saveProfile({
        categories: dataSelectedList,
      }),
    );
    NavigationActionsService.push(CREATE_CAREER_STRENGTHS_SCREEN);
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomWrapHeader title={language('register.categoriesTitle')} note={language('' + 'register.categoriesSubTitle')} />

      <View style={styles.wrapError}>
        <ErrorMessage errorValue={isError ? language('register.socialCategoryError') : ''} />
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
