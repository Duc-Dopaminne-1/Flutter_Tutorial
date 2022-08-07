import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { colors, fonts } from '@/vars';
import { CustomText } from '@/components/CustomText';
import CustomCategories from '@/components/CustomCategories';
import CustomActionSheet from '@/components/CustomActionSheet';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import { language } from '@/i18n';
import { s, vs } from '@/vars/scaling';
import { getUserId, localizeDuration, useLocalizeNameField } from '@/shared/processing';
import HandHeartSVG from '@/components/SVG/HandHeartSVG';
import HourGlassGrayLSVG from '@/components/SVG/HourGlassGrayLSVG';
import IconTimeSVG from '@/components/SVG/IconTimeSVG';
import IconLocationSVG from '@/components/SVG/IconLocationSVG';
import NoteAuctionSVG from '@/components/SVG/NoteAuctionSVG';
import { CustomBidInfoBottomShare } from '@/components/CustomBidInfo/CustomBidInfoBottomShare';
import moment from 'moment';
import { savePreviousCategoryBidded } from '@/shared/placeABid';

interface Prop {
  titleDonate?: string;
  titleTime?: string;
  tilAddress?: string;
  categories?: any[];
  endNowPrice?: number;
  meetPlace?: any;
  auctionId?: string;
  totalTimeMeet?: string;
  offering?: string;
  isFromMyAuction?: boolean;
  dynamicLink?: string;
  infoPrice?: number;
  infoTime?: string;
  isRaffleAuction?: boolean;
  isFromDiscovery?: boolean;
}

export function CustomBidInfoBottom(props: Prop) {
  const {
    titleDonate,
    titleTime,
    tilAddress,
    categories,
    meetPlace,
    auctionId,
    totalTimeMeet,
    offering,
    isFromMyAuction,
    dynamicLink,
    infoTime,
    isRaffleAuction,
    isFromDiscovery,
  } = props;

  const [currentCategory, setCurrentCategory] = useState([]);
  const mapRef = useRef(null);
  const auction = useSelector((state: RootState) => {
    return state.auction;
  });

  const categorySelectedTranslate = categories.map(item => useLocalizeNameField()(item));
  const categoryDesc = categorySelectedTranslate?.length > 0 ? categorySelectedTranslate?.join('| ') : '';
  const contentShare = language('contentShareSocial', {
    auctionEnds: moment(new Date(infoTime)).format('MM-DD-YYYY HH:mm'),
    categories: categoryDesc,
    meetGreet: titleTime,
    duration: totalTimeMeet,
    donating: titleDonate,
  });

  useEffect(() => {
    const currentAuction = auction?.auctionDictionary[auctionId] || {};
    let categories = [];
    if (isFromDiscovery) {
      categories = [];
      setCurrentCategory(categories);
    } else if (isFromMyAuction) {
      categories = currentAuction?.winningBid?.categories || [];
      setCurrentCategory(categories);
    } else if (currentAuction?.lastBid?.creatorId === getUserId()) {
      categories = currentAuction?.lastBid?.categories || [];
      setCurrentCategory(categories);
    } else if (currentAuction.hasOwnProperty('bids')) {
      const categoryIdSelected = savePreviousCategoryBidded(currentAuction);
      setCurrentCategory([categoryIdSelected]);
    }
  }, [auction.auctionDictionary]);

  const onPressMap = () => {
    mapRef.current?.show();
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapMultiType}>
        <CustomCategories categories={categories} oldBid={currentCategory} style={styles.wrapCategories} />
      </View>

      <ScrollView nestedScrollEnabled={true} style={styles.wrapInfo}>
        <CustomText
          icon={<HandHeartSVG />}
          containerStyle={styles.wrapDonate}
          title={titleDonate}
          titleStyle={styles.textAddress}
          numberOfLines={4}
        />
        <CustomText
          icon={<IconTimeSVG />}
          containerStyle={styles.wrapTime}
          title={titleTime}
          titleStyle={styles.textAddress}
          numberOfLines={2}
        />

        {totalTimeMeet && (
          <CustomText
            icon={<HourGlassGrayLSVG />}
            containerStyle={styles.wrapTimeDuration}
            title={language('meetDuration', { time: localizeDuration(totalTimeMeet) })}
            titleStyle={styles.textAddress}
            numberOfLines={2}
          />
        )}

        {tilAddress ? (
          <CustomText
            icon={<IconLocationSVG />}
            containerStyle={styles.wrapTime}
            prefix={tilAddress}
            prefixStyle={styles.prefixStyle}
            title={' '}
            onPress={onPressMap}
            titleStyle={styles.textAddress}
            numberOfLines={2}
          />
        ) : null}

        {offering ? (
          <CustomText
            icon={<NoteAuctionSVG />}
            imageStyle={styles.wrapIconNote}
            containerStyle={styles.wrapOffering}
            title={language('offerAuction', {
              content: offering,
            })}
            numberOfLines={null}
            titleStyle={styles.textAddress}
          />
        ) : null}

        <CustomActionSheet ref={mapRef} meetPlace={meetPlace} />
      </ScrollView>
      <CustomBidInfoBottomShare
        isRaffleAuction={isRaffleAuction}
        contentShare={contentShare}
        dynamicLink={dynamicLink}
        isFromMyAuction={isFromMyAuction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: vs(-50),
    padding: vs(16),
    paddingTop: vs(50),
    zIndex: 1,
    borderWidth: 1,
    borderColor: colors.blue_50,
    borderRadius: 10,
    shadowColor: colors.blue_700,
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  prefixStyle: {
    color: colors.text_green,
    fontSize: fonts.size.s15,
    fontFamily: fonts.family.SSPRegular,
    textDecorationLine: 'underline',
  },
  wrapMultiType: {
    flexDirection: 'row',
  },
  textAddress: {
    color: colors.gray_600,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.RobotoRegular,
    marginLeft: s(7),
    flexShrink: 1,
  },
  wrapDonate: {
    paddingRight: s(16),
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  wrapTime: {
    paddingRight: s(16),
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: vs(3),
  },
  wrapTimeDuration: {
    paddingRight: s(16),
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: vs(3),
    marginBottom: vs(4),
  },
  wrapOffering: {
    paddingRight: s(16),
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: vs(3),
    marginBottom: vs(4),
  },
  wrapInfo: {
    maxHeight: 120,
    marginTop: vs(10),
  },
  wrapIconNote: {
    alignSelf: 'flex-start',
    marginLeft: 3,
  },
  wrapCategories: {
    flex: 1,
    justifyContent: 'center',
  },
});
