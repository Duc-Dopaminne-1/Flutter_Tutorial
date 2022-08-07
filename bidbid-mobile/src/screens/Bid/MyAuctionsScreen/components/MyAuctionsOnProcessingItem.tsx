import React, { ReactElement } from 'react';
import { Image, StyleSheet, View, Pressable, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Auction, AuctionStatus } from '@/models';
import { UserInit } from '@/redux/user/reducer';
import { UserNameAge } from '@/components/UserNameAge';
import { language } from '@/i18n';
import { AuctionSubInfoView } from '@/components/AuctionSubInfoView';
import { MY_AUCTION_DETAIL_SCREEN } from '@/navigation/screenKeys';
import DefaultText from '@/components/CustomText/DefaultText';
import CustomCategories from '@/components/CustomCategories';
import { formatName, formatNameUser } from '@/shared/discovery';
import { getAuctionsStatusColor, getAuctionWonStatus } from '@/shared/auction';

interface Props {
  item: Auction;
  index?: number;
}

export default function MyAuctionsOnProcessingItem(props: Props): ReactElement {
  const navigation = useNavigation();

  // Use Props
  const { item } = props;
  const { winningBid, status, winner } = item;

  const { categories = [] } = winningBid ? winningBid : { categories: [] };
  const userData = useSelector((state: UserInit) => state.user.data);

  const { dateOfBirth, avatar } = userData;
  const firstNameFinal = winner ? formatNameUser(winner) : formatNameUser(userData);
  const dateOfBirthFinal = winner ? winner.dateOfBirth : dateOfBirth;
  const avatarUrl = winner ? winner.avatar?.url : avatar?.url;

  // Methods
  const viewDetailsOnPressed = () => {
    if (status === AuctionStatus.READY_TO_MEET || status === AuctionStatus.READY_TO_PAY || status === AuctionStatus.WAITING_PAYMENT)
      navigation.navigate(MY_AUCTION_DETAIL_SCREEN, { item });
  };

  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.topView}>
        <Image source={{ uri: avatarUrl }} style={styles.image} resizeMode={'cover'} />
        <View style={styles.topRightView}>
          <UserNameAge hideAge={winner?.hideAge} firstName={formatName(firstNameFinal) || 'undefined'} dateOfBirth={dateOfBirthFinal} />
          <CustomCategories categories={categories} />
        </View>

        <View style={styles.wrapStatus}>
          <View style={[styles.wrapperAuctionStatus, { backgroundColor: getAuctionsStatusColor(status) }]}>
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

      {/* Line Break */}
      <View style={styles.lineBreakView} />

      {/*AuctionSubInfoView Area */}
      <View style={styles.wrapperAuctionInfo}>
        <AuctionSubInfoView auction={item} />
      </View>

      {/* View Details Button*/}
      <Pressable style={styles.viewDetails} onPress={viewDetailsOnPressed}>
        <DefaultText {...{ style: styles.viewDetailsText }}>{language('myAuctionsScreen.viewDetails')}</DefaultText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginHorizontal: 25,
    borderWidth: 0.5,
    borderColor: colors.separator_line,
    borderRadius: 10,
    marginVertical: 10,
    // backgroundColor: colors.yellow,
  } as ViewStyle,

  image: {
    height: 56,
    width: 56,
    borderRadius: 28,
  } as ImageStyle,

  topView: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  } as ViewStyle,

  topRightView: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'column',
  } as ViewStyle,

  lineBreakView: {
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: colors.separator_line,
    height: 0.5,
  } as ViewStyle,

  wrapperAuctionInfo: {
    marginHorizontal: 6,
  } as ViewStyle,

  viewDetails: {
    marginVertical: 10,
  } as ViewStyle,

  viewDetailsText: {
    textAlign: 'center',
    fontSize: fonts.size.s15,
    color: colors.blue_700,
    textDecorationLine: 'underline',
  } as TextStyle,

  wrapperAuctionStatus: {
    flexDirection: 'row',
    borderRadius: 45,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue_700,
  } as ViewStyle,

  auctionWonStatusText: {
    color: colors.white,
    fontSize: fonts.size.s13,
    fontFamily: fonts.family.RobotoRegular,
    fontWeight: '400',
  } as TextStyle,

  wrapStatus: {
    height: '100%',
    marginTop: 5,
    marginLeft: 3,
  },
});
