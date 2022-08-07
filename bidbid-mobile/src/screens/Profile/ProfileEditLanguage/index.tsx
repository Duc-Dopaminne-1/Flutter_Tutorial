import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, FlatList, TextStyle, View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateLanguages } from '@/redux/user/actions';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import LanguageItem, { LanguageItemType } from './components/LanguageItem';
import { UserInit } from '@/redux/user/reducer';
import { LANGUAGE_MODEL } from '@/models/language';
import { PROFILE_EDIT_LANGUAGE_SEARCH } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/native';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import DefaultText from '@/components/CustomText/DefaultText';
import NavigationActionsService from '@/navigation/navigation';
import { alertError } from '@/shared/alert';
import IconBack from '@/components/SVG/BackSvg';

const FLAT_LIST: ViewStyle = {
  flex: 1,
};

const FLAT_LIST_CONTENT: ViewStyle = {
  paddingVertical: 14,
};

const TEXT_TITLE: TextStyle = {
  marginHorizontal: 15,
  fontSize: fonts.size.s16,
  color: colors.red_700,
  textAlign: 'center',
};

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: colors.white,
};

const WRAPPER_HEADER: ViewStyle = {
  marginBottom: 20,
};

const WRAPPER_SUB_TITLE: ViewStyle = {
  marginBottom: 10,
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s16,
  textAlign: 'center',
};

const SPACE_VIEW: ViewStyle = {
  height: 10,
};

export function ProfileEditLanguageScreen(): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { languages } = useSelector((state: UserInit) => state.user.data);
  languages.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const [dataList, setDataList] = useState(languages);

  useEnableHardwareBackButton();

  useEffect(() => {
    setDataList(languages);
  }, [languages]);

  const onUpdateSuccess = () => {
    NavigationActionsService.hideLoading();
  };

  const onUpdateFail = (error: string) => {
    NavigationActionsService.hideLoading();
    alertError(error);
  };

  const itemOnPressed = (type: LanguageItemType, item?: LANGUAGE_MODEL) => {
    if (type === 'Add Languages') {
      navigation.navigate(PROFILE_EDIT_LANGUAGE_SEARCH);
    } else {
      Alert.alert(
        language('alert.confirm'),
        language('alert.areYouWantToDelete'),
        [
          {
            text: language('alert.cancel'),
            onPress: () => undefined,
            style: 'cancel',
          },
          {
            text: language('alert.ok'),
            onPress: async () => {
              NavigationActionsService.showLoading();
              const newArray = dataList.filter(language => language.id !== item.id);
              await dispatch(updateLanguages({ languages: newArray, callback: { onSuccess: onUpdateSuccess, onFail: onUpdateFail } }));
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  const renderAddLanguageItem = () => <LanguageItem itemOnPressed={itemOnPressed} type="Add Languages" />;

  const renderItem = ({ item }) => <LanguageItem item={item} itemOnPressed={itemOnPressed} type="Other" />;

  const renderSpaceView = () => <View style={SPACE_VIEW} />;

  const keyExtractor = (item: LANGUAGE_MODEL) => item.name;

  const ListFooterComponent = () => {
    if (dataList.length >= 4) {
      return null;
    }

    return (
      <>
        <View style={SPACE_VIEW} />
        {renderAddLanguageItem()}
      </>
    );
  };

  const renderMainContent = () => {
    if (dataList === undefined || dataList === null || dataList.length === 0) return renderAddLanguageItem();

    return (
      <FlatList
        style={FLAT_LIST}
        contentContainerStyle={FLAT_LIST_CONTENT}
        data={dataList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderSpaceView}
        ListFooterComponent={ListFooterComponent}
      />
    );
  };

  return (
    <View style={CONTAINER}>
      <SafeArea />
      <View style={WRAPPER_HEADER}>
        <CustomHeader leftIcon={<IconBack />} titleStyle={TITLE} title={language('profileGeneral.languages')} />
      </View>
      <View style={WRAPPER_SUB_TITLE}>
        <DefaultText style={TEXT_TITLE}>{language('profileGeneral.select4Language')}</DefaultText>
      </View>
      {renderMainContent()}
    </View>
  );
}
