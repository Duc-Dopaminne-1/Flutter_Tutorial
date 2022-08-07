import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ViewStyle } from 'react-native';
import { colors } from '@/vars';
import { useDispatch, useSelector } from 'react-redux';
import { getLanguages, updateLanguages } from '@/redux/user/actions';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../ProfileEditSchoolSearch/components/SearchBar';
import LanguageSearchItem from './components/LanguageSearchItem';
import { UserInit } from '@/redux/user/reducer';
import { LANGUAGE_MODEL } from '@/models/language';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import NavigationActionsService from '@/navigation/navigation';
import { alertError } from '@/shared/alert';

const FLAT_LIST: ViewStyle = {
  paddingHorizontal: 10,
  flex: 1,
};

const CONTAINER: ViewStyle = {
  flex: 1,
  height: 0.7,
  backgroundColor: colors.separator_line,
};

function SeparatorView() {
  return <View style={CONTAINER} />;
}

export function ProfileEditLanguageSearchScreen(): ReactElement {
  const dispatch = useDispatch();
  const { languages } = useSelector((state: UserInit) => state.user.data);
  const languagesSelected = languages;
  const navigation = useNavigation();
  const [listData, setListData] = useState([]);
  const [dataDefault, setDataDefault] = useState([]);

  useEnableHardwareBackButton();

  useEffect(() => {
    dispatch(
      getLanguages({
        onSuccess: items => {
          const languagesSelectedIds = languagesSelected.map(item => item.id);
          const newLanguages = items.filter(language => !languagesSelectedIds.includes(language.id));
          setListData([...newLanguages]);
          setDataDefault([...newLanguages]);
        },
        onFail: () => undefined,
      }),
    );
  }, []);

  const onChangeSuggestResult = result => {
    setListData(result);
  };

  const onUpdateSuccess = () => {
    NavigationActionsService.hideLoading();
    navigation.goBack();
  };

  const onUpdateFail = (error: string) => {
    NavigationActionsService.hideLoading();
    alertError(error);
  };

  const cellOnPressed = async (item: LANGUAGE_MODEL) => {
    NavigationActionsService.showLoading();
    languagesSelected.push(item);
    await dispatch(
      updateLanguages({
        languages: languagesSelected,
        callback: {
          onSuccess: onUpdateSuccess,
          onFail: onUpdateFail,
        },
      }),
    );
  };

  const renderItem = ({ item }) => {
    return <LanguageSearchItem item={item} itemOnPressed={cellOnPressed} />;
  };

  const keyExtractor = (item: any) => item.id.toString();

  return (
    <View style={styles.container}>
      <View style={styles.wrapHeader}>
        <SafeArea />
      </View>
      <SearchBar
        inputData={dataDefault}
        onChangeSuggestResult={onChangeSuggestResult}
        searchField="name"
        searchPlaceholderText={language('search.default')}
      />
      <FlatList
        style={FLAT_LIST}
        scrollToOverflowEnabled={false}
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={SeparatorView}
        extraData={listData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapHeader: {
    // marginVertical: 20,
    paddingVertical: 2,
  },
});
