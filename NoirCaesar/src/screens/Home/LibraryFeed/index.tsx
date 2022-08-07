import styles from './styles';
import Container from '@src/components/Container';
import React, { useRef } from 'react';
import { View } from 'react-native';
import { CustomHeader } from '@src/components/CustomHeader';
import { MENU, CART } from '@src/constants/icons';
import { toggleDrawer } from '@src/navigation';
import NavigationActionsService from '@src/navigation/navigation';
import { CART_SCREEN } from '@src/constants/screenKeys';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { TabView } from '@src/components/TabView';
import LibraryTab from './LibraryTab';

export enum LibraryTabName {
  PURCHASE = 'Purchases',
  FAVORITE = 'Favorites',
}

interface LibraryTab {
  key: string;
  value: LibraryTabName;
}

const libraryTabs: LibraryTab[] = [
  { key: "0", value: LibraryTabName.PURCHASE },
  { key: "1", value: LibraryTabName.FAVORITE }
]

const LibraryFeed = () => {

  const tabRef = useRef<any>(undefined);

  const onPressCart = () => {
    NavigationActionsService.push(CART_SCREEN, {}, true);
  };

  const renderHeader = () => {
    return (
      <CustomHeader
        mainImage
        leftImage={MENU}
        leftAction={toggleDrawer.bind(undefined, true)}
        rightImage={CART}
        rightAction={onPressCart}
      />
    );
  }

  const renderScrollableView = () => {
    return (
      <View style={styles.container}>
        <ScrollableTabView
          ref={tabRef}
          renderTabBar={() => <TabView />}
          locked={true}
          initialPage={0}>
          {libraryTabs.map((item: LibraryTab) => {
            return <LibraryTab tabLabel={item.value} tabName={item.value} />;
          })}
        </ScrollableTabView>
      </View>
    );
  }

  return (
    <Container>
      <View style={{ flex: 1 }}>
        {renderHeader()}
        {renderScrollableView()}
      </View>
    </Container>
  );
};

export default LibraryFeed;
