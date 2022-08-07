import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ViewStyle } from 'react-native';
import { colors } from '@/vars';
import { useSelector } from 'react-redux';
import { getLanguages } from '@/redux/user/actions';
import LanguageSearchItem from './components/LanguageSearchItem';
import { LANGUAGE_MODEL } from '@/models/language';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import NavigationActionsService from '@/navigation/navigation';
import SearchBar from '@/screens/Profile/ProfileEditSchoolSearch/components/SearchBar';
import { CreateProfileInit } from '@/redux/createProfile/reducer';
import { updateLanguage } from '@/redux/createProfile/actions';
import { useRoute } from '@react-navigation/core';

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

export function CreateLanguageSearchScreen(): ReactElement {
  const route: any = useRoute();
  const { onUpdate } = route.params;
  const languagesSelected = useSelector((state: CreateProfileInit) => state.createProfile.languages);
  const [listData, setListData] = useState([]);
  const [dataDefault, setDataDefault] = useState([]);

  useEnableHardwareBackButton();

  useEffect(() => {
    NavigationActionsService.dispatchAction(
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

  const cellOnPressed = async (item: LANGUAGE_MODEL) => {
    languagesSelected.push(item);
    NavigationActionsService.dispatchAction(
      updateLanguage({
        languages: languagesSelected,
      }),
    );
    onUpdate(languagesSelected);
    NavigationActionsService.goBack();
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
