import React, { ReactElement, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts, screenWidth } from '@/vars';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import HomeDetailCarouselItem from '@/screens/HomeDetail/component/HomeDetailCarouselItem';
import { HomeDetailContext } from '@/screens/HomeDetail/HomeDetailContext';
import { CustomText } from '@/components/CustomText';
import { language } from '@/i18n';
import { Auction } from '@/models';
import { safeAuction, validateAuction } from '@/shared/processing';

interface Props {
  onLoadEnd?: () => void;
}

export function HomeDetailCarousel(props: Props): ReactElement {
  const { onLoadEnd } = props;
  const {
    profile: { photos, auctions },
  } = useContext(HomeDetailContext);
  const [indexDot, setIndexDot] = useState(0);
  const auction: Auction[] = safeAuction(auctions);
  const validateTime = validateAuction(auction.length > 0 ? auction[0].endAt : '');
  const listPhoto = photos && photos.length > 0 ? photos : [];
  const photosFiltered = listPhoto.reduce((photoFiltered, photo) => {
    if (photo.type !== 'verify') photoFiltered.push(photo);
    return photoFiltered;
  }, []);

  const renderItem = ({ item }) => {
    return <HomeDetailCarouselItem item={item} onLoadEnd={onLoadEnd} />;
  };

  const dotLength = photosFiltered ? photosFiltered.length : 1;

  return (
    <View>
      <Carousel
        data={photosFiltered}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        onBeforeSnapToItem={_index => {
          //
        }}
        onSnapToItem={index => setIndexDot(index)}
        initialNumToRender={1}
        loop={false}
        loopClonesPerSide={1}
        hasParallaxImages={true}
      />
      <View>
        {validateTime ? (
          <CustomText containerStyle={styles.wrapAuction} titleStyle={styles.textAuction} title={language('liveAuction')} />
        ) : null}

        <View style={styles.wrapPagination}>
          <Pagination
            activeDotIndex={indexDot}
            dotStyle={styles.dot}
            inactiveDotStyle={styles.inactiveDot}
            inactiveDotOpacity={1}
            inactiveDotScale={1}
            dotsLength={dotLength}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapPagination: {
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center',
  },
  dot: {
    width: 60,
    height: 6,
    borderRadius: 5,
    backgroundColor: colors.blue_700,
  },
  inactiveDot: {
    width: 30,
    height: 6,
    backgroundColor: colors.white,
  },
  wrapAuction: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    alignItems: 'center',
    backgroundColor: colors.red_light,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  textAuction: {
    color: colors.white,
    fontSize: fonts.size.s10,
    fontFamily: fonts.family.SSPSemiBold,
  },
});
