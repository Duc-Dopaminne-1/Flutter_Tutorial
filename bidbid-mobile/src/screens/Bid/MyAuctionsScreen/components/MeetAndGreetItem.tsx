import React, { ReactElement } from 'react';
import { StyleSheet, View, Text, TextStyle, ViewStyle, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import { useSelector } from 'react-redux';
import { formatTime } from '@/shared/processing';
import { Auction } from '@/models';
import { UserInit } from '@/redux/user/reducer';
import { language } from '@/i18n';
import { UserNameAge } from '@/components/UserNameAge';
import CustomCategories from '@/components/CustomCategories';
import { formatName, formatNameUser } from '@/shared/discovery';
import TimeCircleSVG from '@/components/SVG/TimeCircleSVG';
import { getAuctionsStatusColor, getAuctionWonStatus } from '@/shared/auction';
import DefaultText from '@/components/CustomText/DefaultText';

interface Props {
  item: Auction;
  index?: number;
  onPressItem?: (item: Auction, index: number) => void;
}

export default function MeetAndGreetItem(props: Props): ReactElement {
  const { item, index, onPressItem } = props;
  const { meetDate, winningBid, winner, status } = item;
  const { firstName = '', lastName = '', dateOfBirth } = useSelector((state: UserInit) => state.user.data);
  const firstNameFinal = winner ? formatNameUser(winner) : `${firstName} ${lastName || ''}`;
  const dateOfBirthFinal = winner ? winner.dateOfBirth : dateOfBirth;
  const categories = winningBid ? winningBid.categories : [];

  return (
    <View style={styles.container}>
      {/* User Info View */}
      <View style={styles.wrapRowName}>
        <View style={styles.wrapName}>
          <UserNameAge hideAge={winner?.hideAge} firstName={formatName(firstNameFinal) || 'undefined'} dateOfBirth={dateOfBirthFinal} />
          <CustomCategories categories={categories} style={styles.wrapCategory} />
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

      {/* Time View */}
      <Pressable style={styles.timeView} onPress={() => onPressItem(item, index)}>
        <TimeCircleSVG />
        <Text style={styles.timeText}>
          {language('myAuctionsScreen.meetAndGreet')} {formatTime(new Date(meetDate))}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    paddingBottom: 5,
  } as ViewStyle,
  wrapRowName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  } as ViewStyle,

  wrapCategory: {
    marginTop: 0,
    marginLeft: 14,
  },

  timeText: {
    textAlign: 'left',
    marginLeft: 8,
    color: colors.blue_700,
    fontSize: fonts.size.s15,
    fontFamily: fonts.family.PoppinsRegular,
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
    marginTop: 8,
  },
});
