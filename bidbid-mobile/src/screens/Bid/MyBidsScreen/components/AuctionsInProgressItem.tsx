import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View, ViewStyle, Text, ImageStyle, Image, TextStyle, Pressable } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts, images } from '@/vars';
import { RootState } from '@/redux/reducers';
import { useSelector } from 'react-redux';
import { capitalizeAllWorks, formatPrice, formatTime, localizeDuration, safeBirthDay } from '@/shared/processing';
import ImageBlurLoading from 'react-native-image-blur-loading';
import { CustomBidInfoTopTimer } from '@/components/CustomBidInfo/CustomBidInfoTopTimer';
import { SocketManager } from '@/shared/socket/socket-manager';
import { Auction, AUCTION_TYPE } from '@/models';
import CustomCategories from '@/components/CustomCategories';
import DefaultText from '@/components/CustomText/DefaultText';
import { formatName, formatNameUser } from '@/shared/discovery';
import IconSearchMoneySVG from '@/components/SVG/IconSearchMoneySVG';
import HourGlassGraySVG from '@/components/SVG/HourGlassGraySVG';
import TimeWhiteSVG from '@/components/SVG/TimeWhiteSVG';
import ClockSmallSVG from '@/components/SVG/ClockSmallSVG';
import RaffleAuctionSVG from '@/components/SVG/RaffleAuctionSVG';
import TicketSVG from '@/components/SVG/ticketSVG';
import { getTicketBuys } from '@/shared/auction';

export const currencyFormat = num => {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

interface AuctionsInProgressItemProps {
  item: any;
  index: number;
  onPressed: (item: any, index: number) => void;
  elevation?: number;
}

export default function AuctionsInProgressItem(props: AuctionsInProgressItemProps): ReactElement {
  const { item, index, elevation = 7, onPressed = () => {} } = props;
  const { bids, winningBid, creator, meetDate, endAt, id, startingPrice, type, orders } = item;
  const isRaffleAuction = type === AUCTION_TYPE.RAFFLE;
  let totalTicketBuy = getTicketBuys(orders);

  const { categories } = bids[bids.length - 1];
  const { user, auction: auctionReducer } = useSelector((state: RootState) => {
    return state;
  });
  const timeMeet = item?.meetingDuration?.name || '';
  const [winningBidObj, setWinningBidObj] = useState(winningBid);

  useEffect(() => {
    SocketManager.instanceBid.joinAuction(id, (_: Auction) => {});
  }, []);

  useEffect(() => {
    const auctionObj = auctionReducer.auctionDictionary[id] || {};
    setWinningBidObj(auctionObj?.winningBid);
  }, [auctionReducer.auctionDictionary]);

  const setBorderColor = () => {
    let isWinning = winningBidObj?.creatorId === user?.data?.id;
    const borderWidth = isWinning ? 1.5 : 1;
    const borderColor = isWinning ? colors.green_500 : colors.transparent;
    // const elevation = isWinning ? 0 : 2;
    return {
      borderWidth: borderWidth,
      borderColor: borderColor,
      // elevation: elevation,
    };
  };

  const renderAvatarImage = () => {
    if (creator?.avatar === null || creator?.avatar === undefined) {
      return <Image source={images.placeHolderFlatRight} style={cell.thumbImage} />;
    } else {
      return (
        <ImageBlurLoading
          withIndicator
          source={{ uri: creator?.avatar?.url }}
          style={cell.thumbImage}
          thumbnailSource={images.placeHolderFlatRight}
        />
      );
    }
  };

  const renderName = () => {
    return capitalizeAllWorks(formatName(formatNameUser(creator)));
  };

  const renderOld = () => {
    const age = new Date().getFullYear() - parseInt(safeBirthDay(creator?.dateOfBirth));
    return creator?.hideAge ? '' : ', ' + age.toString();
  };

  const getCurrentBidPrice = () => {
    let currentBidPrice = winningBidObj ? winningBidObj?.price : startingPrice;
    return formatPrice(currentBidPrice);
  };

  const renderTicketBuy = () => {
    return (
      <View style={cell.wrapTicket}>
        <View style={cell.wrapIconTicket}>
          <TicketSVG />
        </View>
        <Text style={cell.countDownText} numberOfLines={1} lineBreakMode="tail">
          {totalTicketBuy}
        </Text>
      </View>
    );
  };

  const getTitleBidPrice = () => {
    const title = isRaffleAuction ? language('ticketPriceLower') : language('myBidsScreen.yourBid');
    return `${title}: `;
  };

  const getYourBidPrice = () => {
    let price = startingPrice;
    // If CurrentBid === Current User
    if (winningBidObj?.creatorId === user?.data?.id) {
      price = winningBidObj.price as number;
    } else {
      bids.map(bid => {
        if (bid?.creatorId === user?.data?.id) {
          price = bid.price as number;
        }
      });
    }

    return `${formatPrice(price)}`;
  };

  return (
    <View style={cell.wrapperContain}>
      <Pressable style={[cell.container, { elevation: elevation }, setBorderColor()]} onPress={() => onPressed(item, index)}>
        <View style={cell.leftView}>
          {renderAvatarImage()}
          <View style={cell.leftBottomView}>
            <View style={cell.countDownView}>
              <TimeWhiteSVG />
              <CustomBidInfoTopTimer timeStyle={cell.countDownText} isAuctionProgress infoTime={endAt} />
            </View>

            <View style={cell.currentPriceView}>
              {isRaffleAuction ? (
                renderTicketBuy()
              ) : (
                <Text style={cell.countDownText} numberOfLines={1} lineBreakMode="tail">
                  {getCurrentBidPrice()}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={cell.content}>
          <View style={cell.wrapName}>
            <Text style={cell.textName} numberOfLines={1}>
              {renderName()}
            </Text>
            <DefaultText style={cell.textOld}>{renderOld()}</DefaultText>

            {isRaffleAuction && <RaffleAuctionSVG />}
          </View>

          <CustomCategories categories={categories} />

          <View style={cell.wrapPrice}>
            <IconSearchMoneySVG />
            <View style={cell.priceView}>
              <Text style={cell.timeText} numberOfLines={1}>
                {getTitleBidPrice()}
              </Text>
              <Text style={cell.timeText} numberOfLines={1}>
                {getYourBidPrice()}
              </Text>
            </View>
          </View>

          <View style={cell.moneyView}>
            <ClockSmallSVG />
            <Text style={cell.timeText} numberOfLines={1} lineBreakMode="tail">
              {formatTime(new Date(meetDate))}
            </Text>
          </View>

          <View style={cell.timeView}>
            <View style={cell.wrapIconHour}>
              <HourGlassGraySVG />
            </View>
            <Text style={cell.timeText} numberOfLines={1}>
              {localizeDuration(timeMeet)}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const cell = StyleSheet.create({
  wrapperContain: {
    paddingVertical: 10,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },

  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: colors.blue_700,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 7,
  } as ViewStyle,

  wrapName: {
    flexDirection: 'row',
    paddingRight: 35,
  },

  textName: {
    color: colors.gray_900,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsSemiBold,
  } as TextStyle,

  textOld: {
    color: colors.gray_900,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsSemiBold,
  } as TextStyle,

  leftView: {
    height: '100%',
    width: 140,
  } as ViewStyle,

  thumbImage: {
    flex: 1,
    width: 140,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    resizeMode: 'cover',
    overflow: 'hidden',
  } as ImageStyle,

  leftBottomView: {
    position: 'absolute',
    overflow: 'hidden',
    bottom: 0,
    left: 0,
    right: 0,
    height: 25,
    flexDirection: 'row',
    backgroundColor: colors.transparent,
  } as ViewStyle,

  countDownView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.red_700_alpha_06,
    borderBottomLeftRadius: 8,
    overflow: 'hidden',
  } as ViewStyle,

  currentPriceView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue_700_alpha_05,
  } as ViewStyle,

  content: {
    flex: 1,
    marginTop: 1,
    padding: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: colors.white,
    flexDirection: 'column',
  } as ViewStyle,

  priceView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    flexWrap: 'wrap',
  } as ViewStyle,

  timeView: {
    flex: 1,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    flexWrap: 'wrap',
  } as ViewStyle,

  timeText: {
    marginLeft: 3,
    color: colors.gray_500,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.RobotoRegular,
  } as TextStyle,

  countDownText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: fonts.size.s11,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: '500',
  } as TextStyle,

  moneyView: {
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  wrapIconHour: {
    marginLeft: 2,
  },
  wrapTicket: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapIconTicket: {
    marginRight: 3,
  },
  wrapPrice: {
    flexDirection: 'row',
    marginTop: 5,
  },
});
