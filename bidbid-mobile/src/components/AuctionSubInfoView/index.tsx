import * as React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import { Auction } from '@/models/auction';
import { formatTime, localizeDuration } from '@/shared/processing';
import { language } from '@/i18n';
import DefaultText from '../CustomText/DefaultText';
import CustomActionSheet from '@/components/CustomActionSheet';
import { useRef } from 'react';
import IconTimeSVG from '@/components/SVG/IconTimeSVG';
import IconLocationSVG from '@/components/SVG/IconLocationSVG';
import IconDonateSVG from '@/components/SVG/IconDonateSVG';
import HourGlassGrayLSVG from '@/components/SVG/HourGlassGrayLSVG';
import NoteAuctionSVG from '@/components/SVG/NoteAuctionSVG';
import NoteAuctionSVGL from '@/components/SVG/NoteAuctionSVGL';

export type Props = {
  auction?: Auction;
};

export function AuctionSubInfoView(props: Props) {
  const { auction } = props;
  const mapRef = useRef(null);
  const totalTimeMeet = auction?.meetingDuration?.name || '';

  if (!auction) return null;
  const { meetDate, meetPlace, charity, offering } = auction;

  const onPressMap = () => {
    mapRef.current?.show();
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowView}>
        <IconDonateSVG />
        <DefaultText {...{ style: styles.text }}>{`${language('donatingTo')} ${charity.name} `}</DefaultText>
      </View>
      <View style={styles.rowView}>
        <IconTimeSVG />
        <Text style={styles.text}>{`${language('meetGreet')}: ${formatTime(new Date(meetDate))}`}</Text>
      </View>

      {totalTimeMeet && (
        <View style={styles.rowView}>
          <HourGlassGrayLSVG />
          <Text style={styles.text}>{language('meetDuration', { time: localizeDuration(totalTimeMeet) })}</Text>
        </View>
      )}

      {meetPlace && (
        <Pressable onPress={onPressMap} style={styles.rowView}>
          <IconLocationSVG />
          <Text style={styles.textAddress}>{`${meetPlace?.address?.replace(/(\r\n|\n|\r)/gm, '') || ''}`}</Text>
        </Pressable>
      )}

      {offering && (
        <View style={styles.rowView}>
          <NoteAuctionSVGL />
          <Text style={styles.text}>
            {language('offerAuction', {
              content: offering,
            })}
          </Text>
        </View>
      )}
      <CustomActionSheet ref={mapRef} meetPlace={meetPlace} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {} as ViewStyle,
  rowView: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  } as ViewStyle,
  text: {
    flex: 1,
    marginLeft: 10,
    alignSelf: 'center',
    fontSize: fonts.size.s15,
    color: colors.gray_600,
  } as TextStyle,
  textAddress: {
    flex: 1,
    marginLeft: 10,
    alignSelf: 'center',
    fontSize: fonts.size.s15,
    fontFamily: fonts.family.RobotoRegular,
    color: colors.blue_700,
    textDecorationLine: 'underline',
  } as TextStyle,
});
