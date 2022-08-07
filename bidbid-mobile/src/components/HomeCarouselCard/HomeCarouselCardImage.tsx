import React, { FC, useMemo, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomNameIcon from '@/components/CustomNameIcon/CustomNameIcon';
import { language } from '@/i18n';
import { calculateAge } from '@/shared/processing';
import { Auction, AUCTION_TYPE } from '@/models/auction';
import styles from './styles';
import { IconBorderLeft, IconBorderRight } from '@/vars/imagesSvg';
import { CustomText } from '@/components/CustomText';
import HomeCarouselCardImageLabel from '@/components/HomeCarouselCard/HomeCarouselCardImageLabel';
import FastImage from 'react-native-fast-image';
import BigRaffleSVG from '@/components/SVG/BigRaffleSVG';

interface HomeCarouselCardImageProps {
  uri?: string;
  firstName: string;
  dateOfBirth: string;
  liveAuction?: Auction;
  description?: string;
  status?: string;
  hideAge?: boolean;
  isThumbnail?: boolean;
  isFromDiscovery?: boolean;
}

const HomeCarouselCardImage: FC<HomeCarouselCardImageProps> = ({
  uri,
  isThumbnail,
  firstName,
  dateOfBirth,
  liveAuction,
  status,
  hideAge,
  description,
  isFromDiscovery,
}) => {
  const age = useMemo(() => {
    return dateOfBirth ? calculateAge(new Date(dateOfBirth)) : '';
  }, [dateOfBirth]);
  const isRaffle = liveAuction?.type === AUCTION_TYPE.RAFFLE;
  const textTypeAuction = isRaffle ? language('liveRaffle') : language('liveAuction');

  return (
    <View style={styles.imageWrapper}>
      {uri ? (
        <FastImage
          style={[styles.image, isThumbnail && styles.imageThumbnail]}
          source={{
            uri,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : null}

      <LinearGradient
        locations={[0, 0.625, 0.8385, 0.974]}
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.75)']}
        style={[StyleSheet.absoluteFillObject, styles.wrapImage]}
      />
      <View style={styles.wrapTitle}>
        {!isFromDiscovery && isRaffle ? <BigRaffleSVG /> : <View />}
        <HomeCarouselCardImageLabel liveAuction={liveAuction} />
      </View>

      <View style={styles.metaInfo}>
        {!!liveAuction && <CustomText containerStyle={styles.wrapAuction} titleStyle={styles.textAuction} title={textTypeAuction} />}

        <CustomNameIcon
          isFromDiscovery={false}
          status={status}
          name={firstName}
          age={age}
          hideAge={hideAge}
          nameStyle={styles.nameText}
          wrapperStyle={styles.nameWrapper}
          containerStyle={styles.nameContainer}
        />

        <CustomText
          numberOfLines={2}
          containerStyle={styles.detailContentItemContainer}
          titleStyle={styles.detailContentText}
          title={description || ' '}
        />
      </View>
      <View style={styles.wrapIconLeft}>
        <IconBorderLeft />
      </View>

      <View style={styles.wrapIconRight}>
        <IconBorderRight />
      </View>
    </View>
  );
};

export default memo(HomeCarouselCardImage);
