import React, { FC, useCallback } from 'react';
import { View } from 'react-native';
import { CustomBidInfo } from '@/components/CustomBidInfo/CustomBidInfo';
import { CustomText } from '@/components/CustomText';
import { language } from '@/i18n';
import { Auction, AUCTION_TYPE } from '@/models/auction';
import { DiscoveryCategories, DiscoveryInterest, DiscoveryLanguage, DiscoveryStrengths } from '@/redux/discovery';
import { formatTime, Log, useLocalizeNameField } from '@/shared/processing';
import styles from './styles';
import { vs } from '@/vars/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useCardHeight from './useCardHeight';
import InstagramSVG from '@/components/SVG/InstagramSVG';
import MapPinSVG from '@/components/SVG/MapPinSVG';
import SuitcaseSVG from '@/components/SVG/SuitcaseSVG';
import SchoolSVG from '@/components/SVG/SchoolSVG';
import LikeSVG from '@/components/SVG/LikeSVG';
import { isIOS, isIphoneX } from '@/shared/devices';

interface HomeCarouselCardDetailProps {
  jobName?: string;
  companyName?: string;
  schoolName?: string;
  likes?: number;
  donate?: string | number;
  languages?: DiscoveryLanguage[];
  interests?: DiscoveryInterest[];
  strengths?: DiscoveryStrengths[];
  categories?: DiscoveryCategories[];
  liveAuction?: Auction;
  actionButton?: JSX.Element;
  instagramUsername?: string;
  city?: string;
  linkShareSocial?: string;
  isFromDiscovery?: boolean;
}

const HomeCarouselCardDetail: FC<HomeCarouselCardDetailProps> = ({
  likes,
  jobName,
  schoolName,
  companyName,
  languages,
  strengths,
  liveAuction,
  interests,
  categories,
  actionButton,
  instagramUsername,
  city,
  linkShareSocial,
  isFromDiscovery,
}) => {
  const insets = useSafeAreaInsets();
  const localizeNameField = useLocalizeNameField();
  const height = useCardHeight();
  const isRaffleAuction = liveAuction?.type === AUCTION_TYPE.RAFFLE;
  const renderLikes = useCallback(() => {
    const nouns = likes && likes === 1 ? language('person') : language('people') || language('person');
    return (
      <CustomText
        containerStyle={styles.detailTopItem}
        titleStyle={styles.detailTopText}
        icon={<LikeSVG />}
        title={language('likeByCount', { like: likes, nouns })}
      />
    );
  }, [likes]);

  const renderInstagramUsername = useCallback(() => {
    if (!instagramUsername) return null;
    return (
      <CustomText
        containerStyle={styles.detailTopItem}
        titleStyle={styles.detailTopText}
        title={instagramUsername}
        icon={<InstagramSVG />}
      />
    );
  }, [instagramUsername]);

  const renderAddress = useCallback(() => {
    if (!city) return null;
    return <CustomText containerStyle={styles.detailTopItem} titleStyle={styles.detailTopText} icon={<MapPinSVG />} title={city} />;
  }, [city]);

  const renderLanguages = useCallback(() => {
    if (!languages?.length) return <View style={styles.detailContentEmpty} />;
    return (
      <View style={styles.detailContentItem}>
        <CustomText
          containerStyle={styles.detailContentItemContainer}
          titleStyle={styles.detailContentTitle}
          title={language('languages')}
        />
        <View style={styles.detailTagWrapper}>
          {languages.map(item => (
            <CustomText
              numberOfLines={10}
              containerStyle={styles.detailTagItem}
              titleStyle={styles.detailTagText}
              title={localizeNameField(item)}
              key={item.id}
            />
          ))}
        </View>
      </View>
    );
  }, [languages]);

  const renderCategories = useCallback(() => {
    if (!categories?.length) return <View style={styles.detailContentEmpty} />;
    return (
      <View style={styles.detailContentItem}>
        <CustomText
          containerStyle={styles.detailContentItemContainer}
          titleStyle={styles.detailContentTitle}
          title={language('categories')}
        />
        <View style={styles.detailTagWrapper}>
          {categories?.map(item => (
            <CustomText
              numberOfLines={10}
              containerStyle={styles.detailTagItem}
              titleStyle={styles.detailTagText}
              title={localizeNameField(item)}
              key={item.id}
            />
          ))}
        </View>
      </View>
    );
  }, [categories]);

  const renderStrengths = useCallback(() => {
    if (!strengths?.length) return <View style={styles.detailContentEmpty} />;
    return (
      <View style={styles.detailContentItem}>
        <CustomText
          containerStyle={styles.detailContentItemContainer}
          titleStyle={styles.detailContentTitle}
          title={language('careerStrengths')}
        />
        <View style={styles.detailTagWrapper}>
          {strengths.map(item => (
            <CustomText
              numberOfLines={10}
              containerStyle={styles.detailTagItem}
              titleStyle={styles.detailTagText}
              title={localizeNameField(item)}
              key={item.id}
            />
          ))}
        </View>
      </View>
    );
  }, [strengths]);

  const renderInterests = useCallback(() => {
    if (!interests?.length) return <View style={styles.detailContentEmpty} />;
    return (
      <View style={styles.detailContentItem}>
        <CustomText
          containerStyle={styles.detailContentItemContainer}
          titleStyle={styles.detailContentTitle}
          title={language('socialInterests')}
        />
        <View style={styles.detailTagWrapper}>
          {interests.map(item => (
            <CustomText
              numberOfLines={10}
              containerStyle={styles.detailTagItem}
              titleStyle={styles.detailTagText}
              title={localizeNameField(item)}
              key={item.id}
            />
          ))}
        </View>
      </View>
    );
  }, [interests]);

  const renderAuction = useCallback(() => {
    if (!liveAuction) return null;

    const date = formatTime(new Date(liveAuction.meetDate));
    const totalTimeMeet = liveAuction?.meetingDuration?.name || '';
    const price = liveAuction?.winningBid?.price ? liveAuction?.winningBid?.price : liveAuction?.startingPrice;
    const heightAuction = isIphoneX() ? height - vs(330) : height - vs(270);

    return (
      <View style={[styles.detailAuctionWrapper, { height: heightAuction }]}>
        <CustomBidInfo
          isFromDiscovery={isFromDiscovery}
          key={'discovery'}
          isRaffleAuction={isRaffleAuction}
          auctionId={liveAuction.id.toString()}
          infoPrice={isRaffleAuction ? liveAuction?.entryPrice : price}
          startingPrice={liveAuction?.startingPrice?.toString() || ''}
          dynamicLink={linkShareSocial}
          infoTime={liveAuction.endAt}
          infoEndNowPrice={liveAuction.endNowPrice}
          offering={liveAuction.offering}
          titleEndPrice={language('endPrice')}
          titleBid={isRaffleAuction ? language('ticketPrice') : language('currentBid')}
          titleBidAuction={isRaffleAuction ? language('raffleEnds') : language('auctionEnds')}
          titleDonate={`${language('donatingTo')} ${liveAuction.charity?.name || ''}`}
          titleTime={`${language('meetGreet')}: ${date}`}
          categories={(liveAuction.categories as []) || []}
          totalTimeMeet={totalTimeMeet}
        />
      </View>
    );
  }, [liveAuction]);

  const renderMetaInfo = useCallback(() => {
    return (
      <>
        <CustomText
          containerStyle={[styles.metaItem, !jobName && styles.hidden]}
          titleStyle={styles.metaText}
          title={companyName ? language('jobAtCompany', { job: jobName, company: companyName }) : jobName}
          icon={<SuitcaseSVG />}
          numberOfLines={2}
        />
        <CustomText
          containerStyle={[styles.metaItem, !schoolName && styles.hidden]}
          titleStyle={styles.metaText}
          title={schoolName}
          imageStyle={styles.wrapIconSchool}
          icon={<SchoolSVG />}
          numberOfLines={2}
        />
      </>
    );
  }, [jobName, companyName, schoolName]);

  return (
    <View style={styles.detailWrapper}>
      <View style={[styles.detailTop, !city && (insets.top > 24 || !liveAuction) && styles.detailTopSpacing]}>
        {renderLikes()}
        {renderInstagramUsername()}
      </View>
      {renderAddress()}
      {renderAuction()}
      {!!liveAuction && <View style={styles.auctionButtonWrapper}>{actionButton}</View>}
      {renderMetaInfo()}
      <View style={styles.detailContent}>
        {renderCategories()}
        {renderStrengths()}
        {renderInterests()}
        {renderLanguages()}
      </View>
    </View>
  );
};

export default HomeCarouselCardDetail;
