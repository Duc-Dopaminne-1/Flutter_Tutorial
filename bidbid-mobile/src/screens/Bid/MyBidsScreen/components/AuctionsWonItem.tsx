import React, { ReactElement, useEffect } from 'react';
import { StyleSheet, View, ViewStyle, ImageStyle, Image, TextStyle, Pressable } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts, images } from '@/vars';
import { capitalizeAllWorks, formatPrice, formatTime, localizeDuration, safeBirthDay } from '@/shared/processing';
import { Auction } from '@/models';
import ImageBlurLoading from 'react-native-image-blur-loading';
import { SocketManager } from '@/shared/socket/socket-manager';
import DefaultText from '@/components/CustomText/DefaultText';
import CustomCategories from '@/components/CustomCategories';
import { formatName, formatNameUser } from '@/shared/discovery';
import BidLineSVG from '@/components/SVG/BidLineSVG';
import IconBookMarkSVG from '@/components/SVG/IconBookMarkSVG';
import HourGlassGraySVG from '@/components/SVG/HourGlassGraySVG';
import ClockSmallSVG from '@/components/SVG/ClockSmallSVG';
import { getAuctionsStatusColor, getAuctionWonStatus } from '@/shared/auction';

interface AuctionsWonItem {
  item: any;
  index: number;
  onPressItem: (item: any, index: number) => void;
}

export default function AuctionsWonItem(props: AuctionsWonItem): ReactElement {
  const { item, index, onPressItem = () => {} } = props;
  const { winningBid, creator, meetDate, status, id } = item;
  const age = new Date().getFullYear() - parseInt(safeBirthDay(creator?.dateOfBirth));
  const timeMeet = item?.meetingDuration?.name || '';

  useEffect(() => {
    SocketManager.instanceBid.joinAuction(id, (_: Auction) => {});
  }, []);

  const getWinningBidPriceAndCharity = () => {
    const winingPrice = winningBid?.price || 0;
    return `${language('winingBid')}: ${formatPrice(winingPrice)}`;
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

  return (
    <View style={cell.wrapperContain}>
      <Pressable style={cell.container} onPress={() => onPressItem(item, index)}>
        {renderAvatarImage()}
        <View style={cell.content}>
          <View style={cell.userInfoView}>
            <DefaultText {...{ style: cell.userNameText, numberOfLines: 1, lineBreakMode: 'tail' }}>
              {capitalizeAllWorks(formatName(formatNameUser(creator)))}
            </DefaultText>
            {!creator?.hideAge && <DefaultText {...{ style: cell.oldText }}>{`, ${age}`}</DefaultText>}
          </View>

          <CustomCategories categories={winningBid.categories} />

          <View style={cell.timeView}>
            <ClockSmallSVG />
            <DefaultText {...{ style: cell.timeText, numberOfLines: 1, lineBreakMode: 'tail' }}>
              {formatTime(new Date(meetDate))}
            </DefaultText>
          </View>

          <View style={cell.moneyView}>
            <View style={cell.wrapIconHour}>
              <HourGlassGraySVG />
            </View>
            <DefaultText {...{ style: cell.timeText, numberOfLines: 1, lineBreakMode: 'tail' }}>{localizeDuration(timeMeet)}</DefaultText>
          </View>

          <View style={cell.moneyView}>
            <BidLineSVG />
            <DefaultText {...{ style: cell.timeText, numberOfLines: 1, lineBreakMode: 'tail' }}>
              {getWinningBidPriceAndCharity()}
            </DefaultText>
          </View>

          <View style={cell.auctionWonStatus}>
            <View style={[cell.wrapperAuctionStatus, { backgroundColor: getAuctionsStatusColor(status) }]}>
              <View style={cell.wrapperIconBookmark}>
                <IconBookMarkSVG />
              </View>

              <DefaultText
                {...{
                  style: cell.auctionWonStatusText,
                  numberOfLines: 1,
                  lineBreakMode: 'tail',
                }}
              >
                {getAuctionWonStatus(status)}
              </DefaultText>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const cell = StyleSheet.create({
  wrapperContain: {
    padding: 5,
    backgroundColor: colors.white,
  },
  container: {
    marginRight: 15,
    marginVertical: 4,

    flexDirection: 'row',
    marginLeft: 3,
    borderRadius: 12,
    shadowColor: colors.blue_700,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 6,
  } as ViewStyle,

  thumbImage: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    width: 120,
    height: '100%',
  } as ImageStyle,

  userInfoView: {
    flexDirection: 'row',
  } as ViewStyle,

  content: {
    padding: 12,
    paddingTop: 4,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: colors.white,
    flexDirection: 'column',
  } as ViewStyle,

  userNameText: {
    flexShrink: 1,
    color: colors.gray_900,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.PoppinsSemiBold,
  } as TextStyle,

  oldText: {
    color: colors.gray_900,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.PoppinsSemiBold,
  } as TextStyle,

  timeView: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  timeText: {
    flex: 1,
    marginLeft: 8,
    color: colors.gray_500,
    fontSize: fonts.size.s12,
    fontFamily: fonts.family.RobotoRegular,
  } as TextStyle,

  moneyView: {
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  wrapIconHour: {
    marginLeft: 2,
  },

  wrapperIconBookmark: {
    padding: 5,
    paddingRight: 0,
  } as ViewStyle,

  auctionWonStatus: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
    height: 30,
    paddingLeft: 2,
  } as ViewStyle,

  wrapperAuctionStatus: {
    flexDirection: 'row',
    borderRadius: 5,
    paddingRight: 10,
    alignItems: 'center',
    backgroundColor: colors.blue_700,
  } as ViewStyle,

  auctionWonStatusText: {
    marginLeft: 5,
    color: colors.white,
    fontSize: fonts.size.s13,
    fontWeight: '400',
  } as TextStyle,
});
