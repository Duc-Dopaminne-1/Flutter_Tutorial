import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextStyle, ViewStyle, View, Text } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import { useDispatch } from 'react-redux';
import { colors, fonts } from '@/vars';
import AuctionsInProgressItem from '@/screens/Bid/MyBidsScreen/components/AuctionsInProgressItem';
import { getAuctionsInProgress } from '@/redux/myBids/actions';
import { HOME_DETAIL_SCREEN } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/native';
import { isIOS } from '@/shared/devices';
import IconBack from '@/components/SVG/BackSvg';
import IconMyBidEmptySVG from '@/components/SVG/IconMyBidEmptySVG';

export function AuctionsInProgressScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [dataList, setDataList] = useState([]);
  const getAuctionProcess = () => {
    dispatch(
      getAuctionsInProgress({
        onSuccess: (data: any[]) => {
          setDataList(data);
        },
        onFail: _ => {
          setDataList([]);
        },
      }),
    );
  };

  useEffect(() => {
    getAuctionProcess();
  }, []);

  const onPressItem = useCallback((item, _index) => {
    navigation.navigate(HOME_DETAIL_SCREEN, {
      profileId: item.creatorId,
      isFromAuctionInProgress: true,
    });
  }, []);

  const renderItem = ({ item, index }) => {
    return <AuctionsInProgressItem item={item} index={index} onPressed={onPressItem} elevation={7} />;
  };
  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} title={language('myBidsScreen.auctionsInProgress')} titleStyle={styles.textTitle} />
      {dataList && dataList.length > 0 ? (
        <FlatList
          style={styles.flatList}
          showsVerticalScrollIndicator={false}
          data={dataList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={dataList}
        />
      ) : (
        <View style={styles.emptyView}>
          <IconMyBidEmptySVG />
          <Text style={styles.textNoteTitle}>{language('myBidsScreen.auctionsInProgressEmpty')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  } as ViewStyle,

  textTitle: {
    color: colors.title_grey,
    fontWeight: isIOS ? '600' : 'bold',
  } as TextStyle,

  flatList: {
    marginVertical: 20,
    paddingHorizontal: 16,
  } as ViewStyle,

  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  } as ViewStyle,

  textNoteTitle: {
    marginTop: 25,
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: fonts.fontWeight.bold,
  } as TextStyle,
});
