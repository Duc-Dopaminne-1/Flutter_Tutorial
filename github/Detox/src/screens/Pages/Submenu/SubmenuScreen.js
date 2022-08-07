import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {PAGE_CHILD_TYPE, PAGE_TYPE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {normal} from '../../../assets/theme/metric';
import PageScreen from '../../../components/PageScreen';
import MoreItem from '../../More/components/MoreItem';
import {MORE_TYPE} from '../../More/MoreScreen';
import ScreenIds from '../../ScreenIds';

const styles = StyleSheet.create({
  contentContainer: {
    minHeight: 100,
    paddingHorizontal: normal,
  },
});

const getListMenu = type => {
  return {
    [MORE_TYPE.GENERAL_INFOMATION]: [
      {
        title: translate(STRINGS.INTRODUCTION),
        description: '',
        objectType: PAGE_TYPE.INTRODUCTION,
        pageType: PAGE_CHILD_TYPE.INTRODUCTION,
      },
      {
        title: translate(STRINGS.OPERATION_REGULAION),
        description: '',
        pageType: PAGE_CHILD_TYPE.OPERATION,
        objectType: PAGE_TYPE.BASIC_PAGES,
      },
      {
        title: translate(STRINGS.TERMS_OF_USE),
        description: '',
        pageType: PAGE_CHILD_TYPE.TERMS_OF_USE_INFO_GENERAL,
        objectType: PAGE_TYPE.BASIC_PAGES,
      },
      {
        title: translate(STRINGS.PRIVACY_POLICY),
        description: '',
        pageType: PAGE_CHILD_TYPE.PRIVACY_POLICY,
        objectType: PAGE_TYPE.BASIC_PAGES,
      },
      {
        title: translate(STRINGS.MECHANISMS_FOR_COMPLANTS_RESOLUTION),
        description: '',
        pageType: PAGE_CHILD_TYPE.MECHANISMS,
        objectType: PAGE_TYPE.BASIC_PAGES,
      },
      {
        title: translate('more.general.serviceAgreement'),
        description: '',
        pageType: PAGE_CHILD_TYPE.SERVICE_AGREEMENT,
        objectType: PAGE_TYPE.BASIC_PAGES,
      },
    ],
    [MORE_TYPE.GUID]: [
      {
        title: translate('more.howToUse.itemOneTitle'),
        pageType: PAGE_CHILD_TYPE.FAQ,
        objectType: PAGE_TYPE.INTRODUCTION,
      },
      {
        title: translate('more.howToUse.itemTwoTitle'),
        pageType: PAGE_CHILD_TYPE.CREATE_POST,
        objectType: PAGE_TYPE.GUIDE,
      },
      {
        title: translate('more.howToUse.itemThreeTitle'),
        pageType: PAGE_CHILD_TYPE.BOOKING,
        objectType: PAGE_TYPE.GUIDE,
      },
      {
        title: translate('more.howToUse.itemFourTitle'),
        pageType: PAGE_CHILD_TYPE.DEPOSIT,
        objectType: PAGE_TYPE.GUIDE,
      },
      {
        title: translate('more.howToUse.itemFiveTitle'),
        pageType: PAGE_CHILD_TYPE.PAYMENT_GUIED,
        objectType: PAGE_TYPE.GUIDE,
      },
      {
        title: translate('more.howToUse.itemSixTitle'),
        pageType: PAGE_CHILD_TYPE.REFUND,
        objectType: PAGE_TYPE.GUIDE,
      },
      {
        title: translate('more.howToUse.itemSevenTitle'),
        pageType: PAGE_CHILD_TYPE.UPGRADE_AGENT,
        objectType: PAGE_TYPE.GUIDE,
      },
    ],
    [MORE_TYPE.BROKERS_AND_INVESTORS]: [
      {
        title: translate(STRINGS.TRAINING),
        description: '',
        pageType: PAGE_CHILD_TYPE.TRAINING,
        objectType: PAGE_TYPE.ARTICLE_PAGE,
      },
    ],
    [MORE_TYPE.UTILITIES]: [
      {
        title: translate(STRINGS.HANDBOOK),
        description: '',
        pageType: PAGE_CHILD_TYPE.HANDBOOK,
        objectType: PAGE_TYPE.ARTICLE_PAGE,
        screen: ScreenIds.HandbookList,
      },
    ],
  }[type];
};

const SubmenuScreen = ({navigation, route}) => {
  const {type, title} = route?.params || {};
  const listMenu = getListMenu(type);
  const menus = listMenu || [];
  const onPressItem = item => {
    if (item) {
      if (item.screen) {
        navigation.navigate(item.screen, item.params);
      } else {
        navigation.navigate(ScreenIds.PageDetailQuery, {
          query: {
            pageType: item.pageType,
            objectType: item.objectType,
          },
          title: item.title,
        });
      }
    }
  };
  const keyExtractor = item => item.title;
  const renderItem = ({item}) => {
    return <MoreItem item={item} onPress={() => onPressItem(item)} />;
  };
  return (
    <PageScreen title={title || translate(STRINGS.GENERAL_INFOMATION)}>
      <View style={styles.contentContainer}>
        <FlatList
          data={menus}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          alwaysBounceVertical={false}
        />
      </View>
    </PageScreen>
  );
};

export default SubmenuScreen;
