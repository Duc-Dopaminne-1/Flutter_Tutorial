import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { updateUser } from '@/redux/user/actions';
import NavigationActionsService from '@/navigation/navigation';
import { CustomStrengths } from '@/components/CustomStrengths';
import CustomHeader from '@/components/CustomHeader';
import DefaultText from '@/components/CustomText/DefaultText';
import { getUserId, getUserInfo } from '@/redux/user/selector';
import { alertError } from '@/shared/alert';
import { getCategories } from '@/redux/auction/actions';
import IconBack from '@/components/SVG/BackSvg';
import ErrorMessage from '@/components/ErrorMessage';

const WRAP_ERROR: ViewStyle = {
  alignSelf: 'center',
};

export function ProfileEditCategoryScreen(): ReactElement {
  const [dataList, setDataList] = useState([]);
  const [dataSelectedList, setDataSelectedList] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const user = getUserInfo();
    if (user) {
      const value = user.categories.length > 0 ? user.categories.map(item => item.id) : [];
      setDataSelectedList(value);
    }

    NavigationActionsService.dispatchAction(
      getCategories({
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
      newArray.push(item.id);
    }

    setDataSelectedList(newArray);
  };

  const onUpdateSuccess = () => {
    NavigationActionsService.hideLoading();
    NavigationActionsService.goBack();
  };

  const onFail = (err: string) => {
    NavigationActionsService.hideLoading();
    alertError(err);
  };

  const saveOnPressed = () => {
    if (dataSelectedList.length < 1) {
      setIsError(true);
      return;
    }

    NavigationActionsService.showLoading();
    NavigationActionsService.dispatchAction(
      updateUser({
        categoryIds: dataSelectedList,
        userId: getUserId(),
        onSuccess: onUpdateSuccess,
        onFail: onFail,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <View style={styles.wrapHeader}>
        <CustomHeader leftIcon={<IconBack />} titleStyle={styles.textTitle} title={language('profileGeneral.categories')} />
      </View>
      <DefaultText style={styles.textDesc}>{language('profileGeneral.selectCategories')}</DefaultText>

      <View style={WRAP_ERROR}>
        <ErrorMessage errorValue={isError ? language('register.socialCategoryError') : ''} />
      </View>

      <CustomStrengths
        onPressedItem={onPressedItem}
        dataSelectedList={dataSelectedList}
        dataList={dataList}
        saveOnPressed={saveOnPressed}
        maxSelected={null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },

  wrapHeader: {
    marginBottom: 20,
  },

  textTitle: {
    fontSize: fonts.size.s16,
  },

  textDesc: {
    marginHorizontal: 15,
    fontSize: fonts.size.s16,
    color: colors.red_700,
  },
});
