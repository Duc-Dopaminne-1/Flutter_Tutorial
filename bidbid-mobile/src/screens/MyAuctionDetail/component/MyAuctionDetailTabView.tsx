import React, { ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MyAuctionTabView } from '@/components/TabView/MyAuctionTabView';
import { language } from '@/i18n';
import ScrollableTabView from 'react-native-scrollable-tab-view-universal';
import { MyAuctionDetailAuction } from '@/screens/MyAuctionDetail/component/MyAuctionDetailAuction';
import { colors, fonts, screenWidth } from '@/vars';
import { MyAuctionDetailReceipt } from '@/screens/MyAuctionDetail/component/MyAuctionDetailReceipt';
import { AuctionStatus } from '@/models';
import { shouldShowReceipt } from '@/shared/myAuctionDetail';

interface Prop {
  data: any;
}

export function MyAuctionDetailTabView(props: Prop): ReactElement {
  const { data } = props;
  const isShowReceipt = shouldShowReceipt(data.status);
  const isDisableViewReceipt = useMemo(() => {
    const result = data.transactions.filter(item => item.kind === 'penalty');
    if (result.length > 0 && result[0].status === 'success' && data.status === AuctionStatus.FAILED_PAYMENT) {
      return false;
    } else if (
      result.length > 0 &&
      (result[0].status === AuctionStatus.FAILED || result[0].status === AuctionStatus.PROCESSING) &&
      data.status === AuctionStatus.FAILED_PAYMENT
    ) {
      return true;
    }
    return false;
  }, [data]);

  return (
    <View style={styles.bodyContainer}>
      <ScrollableTabView
        prerenderingSiblingsNumber={0}
        keyboardShouldPersistTaps
        renderTabBar={() => (
          <MyAuctionTabView
            isDisable={!isShowReceipt || isDisableViewReceipt}
            inActiveTabStyle={styles.inActiveTab}
            style={styles.wrapStyle}
            activeTabStyle={styles.activeTabStyle}
            tabBarTextStyle={!isShowReceipt || isDisableViewReceipt ? styles.tabBarText : styles.tabBarTextComplete}
          />
        )}
        locked={true}
        contentProps={{
          keyboardShouldPersistTaps: 'always',
          scrollEnabled: false,
        }}
        style={styles.wrapTab}
      >
        <MyAuctionDetailAuction data={data} tabLabel={language('auctionDetails')} />
        <MyAuctionDetailReceipt data={data} tabLabel={language('viewReceipt')} />
      </ScrollableTabView>
    </View>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    marginTop: 24,
  },
  wrapTab: {
    flex: 1,
    width: '100%',
  },
  inActiveTab: {
    width: screenWidth / 2,
    borderRadius: 0,
    backgroundColor: colors.gray_line_beta,
  },
  wrapStyle: {
    marginHorizontal: 0,
    borderWidth: 0,
    borderRadius: 0,
    borderColor: colors.transparent,
    paddingHorizontal: 16,
  },
  activeTabStyle: {
    backgroundColor: colors.blue_700,
    borderRadius: 0,
  },
  tabBarText: {
    color: colors.gray_400,
    fontSize: fonts.size.s14,
  },
  tabBarTextComplete: {
    color: colors.gray_900,
    fontSize: fonts.size.s14,
  },
});
