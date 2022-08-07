import React, { ReactElement, useContext, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { throttle } from 'lodash';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import { CustomLine } from '@/components/CustomeLine';
import { formatTime, localizeDuration } from '@/shared/processing';
import { HOME_DETAIL_SCREEN } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import { Auction, AuctionStatus } from '@/models';
import { MyAuctionDetailContext } from '@/screens/MyAuctionDetail/MyAuctionDetailContext';
import { isIOS } from '@/shared/devices';
import CustomCategories from '@/components/CustomCategories';
import CustomActionSheet from '@/components/CustomActionSheet';
import { getNameMeetGreet } from '@/shared/auction';
import { formatName } from '@/shared/discovery';
import LocationSVG from '@/components/SVG/LocationSVG';
import VideoSVG from '@/components/SVG/VideoSVG';
import HourGlassGraySVG from '@/components/SVG/HourGlassGraySVG';
import AccountSVG from '@/components/SVG/AccountSVG';
import NoteSVG from '@/components/SVG/NoteSVG';
import NextSVG from '@/components/SVG/NextSVG';
import ClockSVG from '@/components/SVG/ClockSVG';
import NoteAuctionSVG from '@/components/SVG/NoteAuctionSVG';

interface Prop {
  auction?: Auction;
}

export function MyAuctionDetailMeeting(props: Prop): ReactElement {
  const navigation = useNavigation();
  const { auction } = props;
  const { onCallZoom, onOpenRule } = useContext(MyAuctionDetailContext);
  const { user } = useSelector((state: RootState) => {
    return state;
  });
  const mapRef = useRef(null);

  //Bind Data
  const namePersonMeet = getNameMeetGreet(auction);
  const userProfileId = auction ? (auction.creatorId === user.data.id ? auction?.winningBid?.creator?.id : auction?.creator?.id) : '';
  const initMeetPlace = { name: '', address: '', lng: '', lat: '', placeId: '' };
  const meetPlace = auction ? (auction.meetPlace ? auction.meetPlace : initMeetPlace) : initMeetPlace;
  const meetDate = auction?.meetDate || '';
  const isDisableZoom = auction ? auction.status !== AuctionStatus.READY_TO_MEET && auction.meetPlaceId === null : false;
  const isMeetOffline = !!meetPlace.address;
  const totalTimeMeet = auction?.meetingDuration?.name || '';
  const offering = auction?.offering || '';

  const viewProfileBiddedOnPressed = () => {
    if (userProfileId) {
      navigation.navigate(HOME_DETAIL_SCREEN, {
        profileId: userProfileId,
        isFromAuctionDetail: true,
      });
    }
  };

  const onCustomPressThrottle = onCallZoom ? throttle(onCallZoom, 3000, { leading: true, trailing: false }) : undefined;

  const onPressMapOrZoom = () => {
    if (isDisableZoom) {
      return;
    }
    if (isMeetOffline) {
      mapRef.current?.show();
      return;
    }

    onCustomPressThrottle();
  };

  const onPress = () => {
    onOpenRule && onOpenRule();
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} style={styles.wrapTitle}>
        <Text style={styles.textTitle}>{language('meetingInformation')}</Text>
        <View style={styles.wrapIconNote}>
          <NoteSVG />
        </View>
      </Pressable>

      {/*Name*/}
      <View style={styles.wrapItem}>
        <Pressable style={styles.wrapItemName} onPress={viewProfileBiddedOnPressed}>
          <View style={styles.wrapIcon}>
            <AccountSVG />
            <Text style={[styles.textName, styles.textNameUser]}>{formatName(namePersonMeet)}</Text>
            <CustomCategories
              textStyle={styles.textCategories}
              style={styles.wrapCategories}
              categories={auction ? auction?.winningBid?.categories : []}
            />
          </View>
          <NextSVG />
        </Pressable>
        <CustomLine />

        {/*Address Or Zoom*/}
        <CustomButton
          onPress={onPressMapOrZoom}
          wrapIconStyle={styles.wrapIconAddress}
          wrapBtn={styles.wrapBtnAddress}
          containerStyle={styles.wrapCtnAddress}
          textStyle={[styles.textName, styles.addressName, isDisableZoom ? styles.textDisable : {}]}
          firstIcon={isMeetOffline ? <LocationSVG /> : <VideoSVG />}
          iconStyle={styles.iconName}
          text={isMeetOffline ? meetPlace.address.replace(/(\r\n|\n|\r)/gm, '') : language('meetZoom')}
        />
        <CustomLine />

        {/*Time*/}
        <CustomButton
          wrapBtn={styles.wrapBtnAddress}
          wrapIconStyle={styles.wrapIconAddress}
          containerStyle={styles.wrapCtnTime}
          textStyle={styles.textName}
          firstIcon={<ClockSVG />}
          iconStyle={styles.iconName}
          text={`${language('meetGreet')}: ${formatTime(new Date(meetDate))}`}
        />

        <CustomLine lineStyle={styles.lineDuration} />

        {/*Time Duration*/}
        <CustomButton
          wrapBtn={styles.wrapBtnAddress}
          wrapIconStyle={styles.wrapIconDuration}
          containerStyle={styles.wrapCtnTime}
          textStyle={styles.textName}
          firstIcon={<HourGlassGraySVG />}
          iconStyle={styles.iconName}
          text={language('meetDuration', { time: localizeDuration(totalTimeMeet) })}
        />

        {/* Offering */}
        {offering ? (
          <>
            <CustomLine lineStyle={styles.lineDuration} />
            <CustomButton
              wrapBtn={styles.wrapBtnAddress}
              wrapIconStyle={styles.wrapIconAddress}
              containerStyle={styles.wrapCtnTime}
              textStyle={styles.textName}
              firstIcon={<NoteAuctionSVG />}
              iconStyle={styles.iconName}
              text={language('offerAuction', {
                content: offering,
              })}
            />
          </>
        ) : null}

        <CustomActionSheet ref={mapRef} meetPlace={meetPlace} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  textTitle: {
    fontSize: fonts.size.s16,
    fontWeight: isIOS ? '600' : 'bold',
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  },
  wrapItem: {
    marginTop: 14,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border_grey_light,
  },
  wrapItemName: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  textNameUser: {
    marginLeft: 10,
  },
  textName: {
    fontSize: fonts.size.s14,
    color: colors.gray_last_time,
    fontFamily: fonts.family.PoppinsRegular,
    textAlign: 'left',
    fontWeight: null,
  },

  addressName: {
    color: colors.blue_700,
    textDecorationLine: 'underline',
  },

  wrapIcon: {
    marginLeft: -2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconName: {
    height: 16,
    width: 16,
    marginRight: 14,
  },
  wrapIconAddress: {
    alignSelf: 'flex-start',
    marginTop: 3,
    marginRight: 10,
  },
  wrapIconDuration: {
    alignSelf: 'flex-start',
    marginTop: 3,
    marginRight: 10,
    marginLeft: 3,
  },
  wrapBtnAddress: {
    justifyContent: 'flex-start',
  },
  wrapCtnAddress: {
    alignItems: 'flex-start',
    marginTop: 14,
    height: null,
    minHeight: null,
    width: '100%',
    backgroundColor: colors.gray_50,
    marginBottom: 8,
  },
  wrapCtnTime: {
    height: null,
    minHeight: null,
    width: '100%',
    backgroundColor: colors.gray_50,
    marginTop: 14,
  },
  textDisable: {
    color: colors.gray_600,
  },
  wrapCategories: {
    marginLeft: 10,
    marginTop: 0,
  },
  textCategories: {
    fontSize: fonts.size.s12,
  },
  wrapTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineDuration: {
    marginTop: 12,
  },
  wrapIconNote: {
    marginLeft: 8,
  },
});
