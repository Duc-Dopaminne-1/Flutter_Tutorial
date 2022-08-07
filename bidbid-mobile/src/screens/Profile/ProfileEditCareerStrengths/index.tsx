import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { getCareerStrengths, updateUser } from '@/redux/user/actions';
import NavigationActionsService from '@/navigation/navigation';
import { CustomStrengths } from '@/components/CustomStrengths';
import CustomHeader from '@/components/CustomHeader';
import DefaultText from '@/components/CustomText/DefaultText';
import { getUserId, getUserInfo } from '@/redux/user/selector';
import { alertError } from '@/shared/alert';
import ErrorMessage from '@/components/ErrorMessage';
import IconBack from '@/components/SVG/BackSvg';

export function ProfileEditCareerStrengthsScreen(): ReactElement {
  const [dataList, setDataList] = useState([]);
  const [dataSelectedList, setDataSelectedList] = useState([]);
  const [isError, setIsError] = useState(false);
  const maxSelected = 5;

  useEffect(() => {
    const user = getUserInfo();
    if (user) {
      const value = user.strengths.length > 0 ? user.strengths.map(item => item.id) : [];
      setDataSelectedList(value);
    }

    NavigationActionsService.dispatchAction(
      getCareerStrengths({
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

  const onUpdateSuccess = () => {
    NavigationActionsService.hideLoading();
    NavigationActionsService.goBack();
  };

  const onFail = (err: string) => {
    NavigationActionsService.hideLoading();
    alertError(err);
  };

  const saveOnPressed = () => {
    if (dataSelectedList.length < 2) {
      setIsError(true);
      return;
    }

    NavigationActionsService.showLoading();
    NavigationActionsService.dispatchAction(
      updateUser({
        strengthIds: dataSelectedList,
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
        <CustomHeader leftIcon={<IconBack />} titleStyle={styles.textTitle} title={language('profileGeneral.careerStrengths')} />
      </View>
      <DefaultText style={styles.textDesc}>{language('profileGeneral.select5Career')}</DefaultText>

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
  wrapError: {
    alignSelf: 'center',
  },
});
