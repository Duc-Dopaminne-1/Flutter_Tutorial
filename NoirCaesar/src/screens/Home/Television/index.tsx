import styles from './styles';
import Container from '@src/components/Container';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { CustomHeader } from '@src/components/CustomHeader';
import { MENU, CART } from '@src/constants/icons';
//@ts-ignore
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { toggleDrawer } from '@src/navigation';
import { TabView } from '@src/components/TabView';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '@src/modules/tv/actions';
import { RootState } from '@src/types/types';
import { ICategory } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import translate from '@src/localize';
import { TVFlatList } from './TVFlatList';
import NavigationActionsService from '@src/navigation/navigation';
import { CART_SCREEN } from '@src/constants/screenKeys';
import { Navigation } from 'react-native-navigation';
import NotificationsService from '@src/modules/notifications/service';

export enum TabName {
  ANIMATION = 'Animation',
  FILM = 'Film',
  REVIEWS = 'Reviews',
  NEWS = 'News',
  PODCAST = 'Podcast',
  MUSIC = 'Music',
}

const Television = () => {
  const dispatch = useDispatch();
  const categories = useSelector<RootState, ICategory[]>((state: RootState) => state.tv.categories);
  const tabRef = useRef<any>(null);

  const mapTabToIndex = (tab: string) => {
    switch (tab) {
      case TabName.ANIMATION:
        return 0;
      case TabName.FILM:
        return 1;
      case TabName.REVIEWS:
        return 2;
      case TabName.NEWS:
        return 3;
      case TabName.PODCAST:
        return 4;
      case TabName.MUSIC:
        return 5;
      default:
        return 0;
    }
  };

  useEffect(() => {
    dispatch(
      getCategories({
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );

    Navigation.events().registerComponentDidAppearListener(() => {
      const storyTab = NotificationsService.getInstance().storyTab;
      if (storyTab) {
        const tabIndex = mapTabToIndex(storyTab);
        tabRef && tabRef.current && tabRef.current.goToPage(tabIndex);
        NotificationsService.getInstance().setStoryTab(undefined);
      }
    });
  }, []);

  const onPressCart = () => {
    NavigationActionsService.push(CART_SCREEN, {}, true);
  };

  const renderTab = (item: ICategory) => {
    return <TVFlatList category={item} />;
  };

  const renderTabView = () => {
    return (
      <ScrollableTabView ref={tabRef} key={categories.length} renderTabBar={() => <TabView />} locked={true} initialPage={0}>
        {categories.map(item => {
          return (
            <View tabLabel={item.name} key={item.id} style={styles.container}>
              {renderTab(item)}
            </View>
          );
        })}
      </ScrollableTabView>
    );
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <CustomHeader
          mainImage
          leftImage={MENU}
          leftAction={toggleDrawer.bind(undefined, true)}
          rightImage={CART}
          rightAction={onPressCart}
        />
        <View style={styles.container}>{renderTabView()}</View>
      </View>
    </Container>
  );
};

export default Television;
