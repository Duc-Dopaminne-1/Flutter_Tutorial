import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import BaseScreen from '../../components/BaseScreen';
import CustomListItem from '../../components/CustomListItem';
import {useLogin} from '../Auth/useLogin';
import ScreenIds from '../ScreenIds';

const styles = StyleSheet.create({
  viewContainer: {
    marginBottom: 70,
  },
});

export const MORE_TYPE = {
  SEARCH_AGENT: 'SEARCH_AGENT',
  NEWS: 'NEWS',
  SAVED_SEARCH: 'SAVED_SEARCH',
  FAVORITE_LIST: 'FAVORITE_LIST',
  SETTINGS: 'SETTINGS',
  SUPPORT: 'SUPPORT',
  INTRODUCTION: 'INTRODUCTION',
  GENERAL_INFOMATION: 'GENERAL_INFOMATION',
  GUID: 'GUID',
  BROKERS_AND_INVESTORS: 'BROKERS_AND_INVESTORS',
  UTILITIES: 'UTILITIES',
  PLUS_SERVICE: 'PLUS_SERVICE',
};

const getData = () => [
  {
    title: translate(STRINGS.MORE_CONTACT),
    description: translate(STRINGS.CONTACT_DESCRIPTION),
    image: IMAGES.IC_MORE_CONTACT,
    screen: ScreenIds.ContactToAdvice,
    data: {
      hideImage: true,
      backButtonTitle: translate(STRINGS.BACK_TO_PREVIOUS_SCREEN),
    },
  },
  {
    title: translate(STRINGS.GENERAL_INFOMATION),
    description: translate(STRINGS.SUMMARY_ABOUT_US),
    image: IMAGES.IC_MORE_INFOMATION,
    screen: ScreenIds.SubmenuPages,
    data: {type: MORE_TYPE.GENERAL_INFOMATION},
  },
  {
    title: translate(STRINGS.GUID),
    description: translate(STRINGS.HOW_TO_USE),
    screen: ScreenIds.SubmenuPages,
    data: {type: MORE_TYPE.GUID, title: translate(STRINGS.GUID)},
    image: IMAGES.IC_MORE_GUID,
  },
  {
    title: translate(STRINGS.UTILITIES),
    description: translate(STRINGS.UTILITIES_PLUS),
    screen: ScreenIds.SubmenuPages,
    data: {type: MORE_TYPE.UTILITIES, title: translate(STRINGS.UTILITIES)},
    image: IMAGES.IC_MORE_UTILITIES,
  },
  {
    title: translate(STRINGS.INVESTOR),
    description: translate('investor.listInvestor'),
    screen: ScreenIds.InvestorInformationList,
    image: IMAGES.IC_MORE_INVESTOR,
  },
];

const keyExtractor = item => item.description;

const MoreScreen = ({navigation}) => {
  const {showLogin} = useLogin();
  const DATA = getData();
  const onPressItem = (screen, data) => {
    if (screen) {
      if (screen === ScreenIds.ShareApplication || screen === ScreenIds.SearchFilterAgent) {
        showLogin(() => {
          navigation.navigate(screen, data);
        });
        return;
      }
      navigation.navigate(screen, data);
    }
  };

  const renderItem = ({item}) => {
    return (
      <CustomListItem
        title={item.title}
        imageStyle={{tintColor: COLORS.PRIMARY_A100}}
        imageSource={item.image}
        onPress={() => onPressItem(item.screen, item.data)}
        description={item.description}
      />
    );
  };

  return (
    <BaseScreen testID={ScreenIds.More} title={translate(STRINGS.MORE)}>
      <View style={styles.viewContainer}>
        <FlatList
          data={DATA}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          alwaysBounceVertical={false}
        />
      </View>
    </BaseScreen>
  );
};

export default MoreScreen;
