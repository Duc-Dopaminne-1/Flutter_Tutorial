import React, { ReactElement, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors } from '@/vars';
import { language } from '@/i18n';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import CustomButton from '@/components/CustomButton';
import { isIphoneX } from '@/shared/devices';
import LanguageItem, { LanguageItemType } from '@/screens/Profile/ProfileEditLanguage/components/LanguageItem';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import NavigationActionsService from '@/navigation/navigation';
import { LANGUAGE_MODEL } from '@/models';
import { CREATE_CATEGORIES_SCREEN, CREATE_LANGUAGE_SEARCH_SCREEN } from '@/navigation/screenKeys';
import { updateLanguage } from '@/redux/createProfile/actions';

export function CreateLanguageScreen(): ReactElement {
  const [dataList, setDataList] = useState([]);
  const [opacity, setOpacity] = useState({ opacity: 0.3 });

  useEnableHardwareBackButton();

  const onUpdate = (listSelected: LANGUAGE_MODEL[]) => {
    listSelected.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    checkItemSelected(listSelected.concat([]));
    setDataList(listSelected.concat([]));
  };

  const checkItemSelected = dataList => {
    if (dataList.length === 0) {
      setOpacity({ opacity: 0.3 });
      return;
    }
    setOpacity({ opacity: 1 });
  };

  const itemOnPressed = (type: LanguageItemType, item?: LANGUAGE_MODEL) => {
    if (type === 'Add Languages') {
      NavigationActionsService.push(CREATE_LANGUAGE_SEARCH_SCREEN, { onUpdate });
    } else {
      // Delete
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
              const newArray = dataList.filter(language => language.id !== item.id);
              NavigationActionsService.dispatchAction(
                updateLanguage({
                  languages: newArray,
                }),
              );
              checkItemSelected(newArray);
              setDataList(newArray);
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  const renderAddLanguageItem = () => <LanguageItem itemOnPressed={itemOnPressed} type="Add Languages" />;

  const renderItem = ({ item }) => <LanguageItem item={item} itemOnPressed={itemOnPressed} type="Other" />;

  const renderSpaceView = () => <View style={styles.spaceView} />;

  const keyExtractor = (item: LANGUAGE_MODEL) => item.name;

  const ListFooterComponent = () => {
    if (dataList.length >= 4) {
      return null;
    }

    return (
      <>
        <View style={styles.spaceView} />
        {renderAddLanguageItem()}
      </>
    );
  };
  const renderMainContent = () => {
    if (dataList === undefined || dataList === null || dataList.length === 0) return renderAddLanguageItem();

    return (
      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        data={dataList}
        extraData={dataList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderSpaceView}
        ListFooterComponent={ListFooterComponent}
      />
    );
  };

  const saveOnPressed = () => {
    if (dataList.length === 0) {
      return null;
    }
    NavigationActionsService.push(CREATE_CATEGORIES_SCREEN);
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomWrapHeader title={language('languagesSpeak')} note={language('selectLanguages')} />
      <View style={styles.wrapBody}>{renderMainContent()}</View>

      <CustomButton
        onPress={saveOnPressed}
        containerStyle={[styles.button, opacity]}
        text={language('continue')}
        textStyle={styles.textButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  button: {
    width: null,
    marginBottom: isIphoneX() ? 50 : 30,
    marginTop: 20,
    marginHorizontal: 15,
  },
  textButton: {
    fontWeight: '400',
  },
  spaceView: {
    height: 10,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingVertical: 14,
  },
  wrapBody: {
    flex: 1,
    marginTop: 20,
  },
});
