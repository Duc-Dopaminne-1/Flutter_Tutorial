import React, { ReactElement, useEffect, useState } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { PlaceABidSuggestedBidsItem } from './PlaceABidSuggestedBidsItem';

import { RootState } from '@/redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { setPrice } from '@/redux/placeABid/actions';
import { suggestPrice } from '@/shared/processing';

const PERCENT_25 = 1.25;
const PERCENT_50 = 1.5;
const PERCENT_75 = 1.75;

const CONTAINER: ViewStyle = {
  marginTop: 10,
  justifyContent: 'center',
  backgroundColor: colors.white,
  borderRadius: 20,
};

const TITLE: TextStyle = {
  paddingHorizontal: 20,
  fontSize: fonts.size.s16,
  fontWeight: '500',
  color: colors.gray_900,
  fontFamily: fonts.family.PoppinsRegular,
};

const LIST_CATEGORIES: ViewStyle = {
  marginTop: 5,
  paddingHorizontal: 5,
  backgroundColor: colors.white,
  borderRadius: 20,
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: 5,
};

export function PlaceABidSuggestedBids(): ReactElement {
  const dispatch = useDispatch();
  const auction = useSelector((state: RootState) => {
    return state.placeABid.auction;
  });

  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const currentPrice = auction.winningBid?.price || auction.startingPrice;
    // const endNowPrice = auction.endNowPrice || currentPrice * 2;
    const { endNowPrice } = auction;
    const price25 = suggestPrice(currentPrice, endNowPrice, PERCENT_25);
    const price50 = suggestPrice(currentPrice, endNowPrice, PERCENT_50);
    const price75 = suggestPrice(currentPrice, endNowPrice, PERCENT_75);

    setDataList([
      { id: PERCENT_25, value: price25[0], string: price25[1] },
      { id: PERCENT_50, value: price50[0], string: price50[1] },
      { id: PERCENT_75, value: price75[0], string: price75[1] },
    ]);
  }, [auction.winningBid]);

  const itemOnSelected = (item: string, _: number) => {
    dispatch(setPrice(item));
  };

  const renderTitle = () => {
    let isEnable = false;
    dataList.map(item => {
      if (item.value) isEnable = true;
    });
    if (isEnable) return <Text style={TITLE}>{language('placeABid.suggestedBids')}</Text>;
    return null;
  };

  return (
    <View style={CONTAINER}>
      {renderTitle()}
      <View style={LIST_CATEGORIES}>
        {dataList.map((item, index) => {
          if (!item || !item.value) return null;
          return <PlaceABidSuggestedBidsItem key={item.id} item={item} index={index} itemOnSelected={itemOnSelected} />;
        })}
      </View>
    </View>
  );
}
