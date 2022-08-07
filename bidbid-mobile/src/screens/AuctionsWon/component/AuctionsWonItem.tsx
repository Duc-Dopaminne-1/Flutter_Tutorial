import React, { ReactElement, useCallback } from 'react';
import { StyleSheet, View, ViewStyle, ImageStyle, Image, TextStyle, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { language } from '@/i18n';
import { colors, fonts, images } from '@/vars';
import { capitalizeAllWorks, formatPrice, formatTime, localizeDuration, safeBirthDay } from '@/shared/processing';
import { AuctionStatus } from '@/models';
import ImageBlurLoading from 'react-native-image-blur-loading';
import { MY_AUCTION_DETAIL_SCREEN } from '@/navigation/screenKeys';
import DefaultText from '@/components/CustomText/DefaultText';
import CustomCategories from '@/components/CustomCategories';
import BidLineSVG from '@/components/SVG/BidLineSVG';
import HourGlassGraySVG from '@/components/SVG/HourGlassGraySVG';
import IconBookMarkSVG from '@/components/SVG/IconBookMarkSVG';
import ClockSmallSVG from '@/components/SVG/ClockSmallSVG';
import { getAuctionsStatusColor, getAuctionWonStatus } from '@/shared/auction';
import { formatNameUser } from '@/shared/discovery';

interface AuctionsWonItem {
  item: any;
  index: number;
}

export default function AuctionsWonItem(props: AuctionsWonItem): ReactElement {
  const { item } = props;
  const navigation = useNavigation();

  const { winningBid, creator, meetDate, status } = item;
  const timeMeet = item?.meetingDuration?.name || '';

  const getWinningBidPriceAndCharity = () => {
    const winingPrice = winningBid?.price || 0;
    return `${language('winingBid')}: ${formatPrice(winingPrice)}`;
  };

  const renderAvatarImage = () => {
    if (creator?.avatar === null || creator?.avatar === undefined) {
      return <Image source={images.placeHolderFlatRight} style={styles.thumbImage} />;
    } else {
      return (
        <ImageBlurLoading
          withIndicator
          source={{ uri: creator?.avatar?.url }}
          style={styles.thumbImage}
          thumbnailSource={images.placeHolderFlatRight}
        />
      );
    }
  };

  const onPressItem = useCallback(() => {
    if (item.status === AuctionStatus.CANCEL || AuctionStatus.READY_TO_MEET || AuctionStatus.COMPLETED) {
      navigation.navigate(MY_AUCTION_DETAIL_SCREEN, {
        item,
      });
    } else alert(`${status} Coming soon`);
  }, []);

  const age = new Date().getFullYear() - parseInt(safeBirthDay(creator?.dateOfBirth));

  return (
    <View style={styles.wrapperContain}>
      <Pressable style={styles.container} onPress={onPressItem}>
        {renderAvatarImage()}
        <View style={styles.content}>
          <View style={styles.userInfoView}>
            <DefaultText {...{ style: styles.userNameText, numberOfLines: 1, lineBreakMode: 'tail' }}>
              {capitalizeAllWorks(formatNameUser(creator))}
            </DefaultText>
            {!creator?.hideAge && <DefaultText {...{ style: styles.oldText }}>{`, ${age}`}</DefaultText>}
          </View>

          <CustomCategories categories={winningBid.categories} />

          <View style={styles.timeView}>
            <ClockSmallSVG />
            <DefaultText {...{ style: styles.timeText, numberOfLines: 1, lineBreakMode: 'tail' }}>
              {formatTime(new Date(meetDate))}
            </DefaultText>
          </View>

          <View style={styles.moneyView}>
            <View style={styles.wrapIconHour}>
              <HourGlassGraySVG />
            </View>
            <DefaultText {...{ style: styles.timeText, numberOfLines: 1, lineBreakMode: 'tail' }}>{localizeDuration(timeMeet)}</DefaultText>
          </View>

          <View style={styles.moneyView}>
            <BidLineSVG />
            <DefaultText {...{ style: styles.timeText, numberOfLines: 1, lineBreakMode: 'tail' }}>
              {getWinningBidPriceAndCharity()}
            </DefaultText>
          </View>

          <View style={styles.auctionWonStatus}>
            <View style={[styles.wrapperAuctionStatus, { backgroundColor: getAuctionsStatusColor(status) }]}>
              <View style={styles.wrapperIconBookmark}>
                <IconBookMarkSVG />
              </View>

              <DefaultText
                {...{
                  style: styles.auctionWonStatusText,
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

const styles = StyleSheet.create({
  wrapperContain: {
    padding: 10,
    backgroundColor: colors.white,
  },

  container: {
    marginRight: 2,
    paddingTop: 1,
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.blue_50,
    shadowColor: colors.blue_700,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 6,
  } as ViewStyle,

  userInfoView: {
    flexDirection: 'row',
    // backgroundColor: 'blue',
  } as ViewStyle,

  userNameText: {
    // width: '90%',
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

  thumbImage: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    height: '100%',
    width: 150,
  } as ImageStyle,

  wrapperIconBookmark: {
    padding: 5,
    paddingRight: 0,
  } as ViewStyle,

  content: {
    flex: 1,
    padding: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: colors.white,
  } as ViewStyle,

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
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  auctionWonStatus: {
    flexDirection: 'row',
    marginTop: 2,
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
    marginLeft: 8,
    color: colors.white,
    fontSize: fonts.size.s13,
    fontWeight: '400',
  } as TextStyle,

  wrapIconHour: {
    marginLeft: 2,
  },
});
