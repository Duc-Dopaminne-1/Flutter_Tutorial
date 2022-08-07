import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors, fonts } from '@/vars';
import { TabView } from '@/components/TabView/TabView';
import { language } from '@/i18n';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MyBidsScreen from '@/screens/Bid/MyBidsScreen/MyBidsScreen';
import MyAuctionsScreen from '@/screens/Bid/MyAuctionsScreen/MyAuctionsScreen';
import NavigationActionsService from '@/navigation/navigation';
import CustomHeader from '@/components/CustomHeader';
import { isIOS } from '@/shared/devices';

export function BidScreen(): ReactElement {
  const [initTab, setInitTab] = useState(0);

  useEffect(() => {
    const param = NavigationActionsService.getState().routes[0].state.routes[1].params;
    if (param && param.hasOwnProperty('isToMyAuction')) {
      setInitTab(1);
    }
  }, []);

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader isShadow={false} containerStyle={styles.wrapHeader} titleStyle={styles.textHeader} title={language('auctions')} />
      <View style={styles.bodyContainer}>
        <ScrollableTabView
          prerenderingSiblingsNumber={0}
          keyboardShouldPersistTaps
          renderTabBar={() => <TabView isFromBid initTab={initTab} />}
          locked={true}
          contentProps={{
            keyboardShouldPersistTaps: 'always',
            scrollEnabled: false,
          }}
        >
          <MyBidsScreen tabLabel={language('myBids')} />
          <MyAuctionsScreen tabLabel={language('myAuction')} />
        </ScrollableTabView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    flex: 1,
    marginTop: isIOS ? 10 : 0,
  },
  wrapHeader: {
    marginTop: 0,
    paddingHorizontal: 24,
  },
  textHeader: {
    fontSize: fonts.size.s22,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  },
});
