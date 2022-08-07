import DefaultText from '@/components/CustomText/DefaultText';
import { SeparatorView } from '@/components/SeparatorView/SeparatorView';
import { language } from '@/i18n';
import { Auction, AuctionStatus } from '@/models/auction';
import { MEET_AND_GREET_HISTORY_SCREEN, MY_AUCTION_DETAIL_SCREEN } from '@/navigation/screenKeys';
import { alertError } from '@/shared/alert';
import { colors, fonts } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import MeetAndGreetItem from './MeetAndGreetItem';

interface MeetAndGreetHistoryProps {
  dataList: Auction[];
}

export default function MeetAndGreetHistory(props: MeetAndGreetHistoryProps): ReactElement {
  const navigation = useNavigation();
  const { dataList = [] } = props;

  const onPressItem = useCallback((item, _index) => {
    if (item.status === AuctionStatus.CANCEL || item.status === AuctionStatus.COMPLETED || item.status === AuctionStatus.FAILED_PAYMENT) {
      navigation.navigate(MY_AUCTION_DETAIL_SCREEN, {
        item,
      });
    } else {
      alertError('Coming soon', language('error'), null);
    }
  }, []);

  const renderItem = useCallback(({ item, index }) => {
    return <MeetAndGreetItem item={item} index={index} onPressItem={onPressItem} />;
  }, []);

  const keyExtractor = useCallback((item, _) => item.id, []);
  const ItemSeparatorComponent = useMemo(() => SeparatorView, []);
  const viewAllOnPressed = () => {
    navigation.navigate(MEET_AND_GREET_HISTORY_SCREEN, { auctionHistories: dataList });
  };

  if (dataList.length < 1) return null;
  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.title}>{language('myAuctionsScreen.meetAndGreetHistory')}</Text>
        <TouchableOpacity onPress={viewAllOnPressed}>
          <DefaultText {...{ style: styles.subTitleText }}>{language('myBidsScreen.viewAll')}</DefaultText>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
        data={dataList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparatorComponent}
        extraData={dataList}
        initialNumToRender={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  } as ViewStyle,

  flatList: {
    marginTop: 20,
    borderColor: colors.gray_line_beta,
    backgroundColor: colors.white,
    paddingBottom: 30,
    borderWidth: 1,
    borderRadius: 10,
    flex: 1,

    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,

  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    color: colors.gray_900,
    fontSize: fonts.size.s17,
    fontFamily: fonts.family.PoppinsSemiBold,
  } as TextStyle,

  subTitleText: {
    color: colors.gray_600,
    fontSize: fonts.size.s15,
    fontFamily: fonts.family.PoppinsRegular,
    textDecorationLine: 'underline',
  } as TextStyle,
});
