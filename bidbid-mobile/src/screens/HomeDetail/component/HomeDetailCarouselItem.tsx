import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, images } from '@/vars';
import FastImage from 'react-native-fast-image';
import { language } from '@/i18n';
import { safeAuction, validateAuction } from '@/shared/processing';
import { HomeDetailContext } from '@/screens/HomeDetail/HomeDetailContext';
import { DiscoveryPhoto } from '@/redux/discovery';
import MeetOfflineSVG from '@/components/SVG/MeetOfflineSVG';
import MeetOnlineSVG from '@/components/SVG/MeetOnlineSVG';

interface HomeDetailCarouselItemProps {
  item: DiscoveryPhoto;
  onLoadEnd: () => void;
}

function HomeDetailCarouselItem(props: HomeDetailCarouselItemProps) {
  const {
    item: { url },
    onLoadEnd = () => {},
  } = props;
  const { profile } = useContext(HomeDetailContext);
  const auctions = profile.auctions.length > 0 ? safeAuction(profile.auctions) : [{ id: '', endAt: '' }];
  const auctionsData = auctions.length > 0 ? auctions : [{ id: '', endAt: '' }];
  const validateTime = validateAuction(auctionsData.length > 0 ? auctionsData[0].endAt : '');
  const isMeetOffline = auctionsData[0].id && validateTime ? !!auctionsData[0].meetPlaceId : null;
  const [isImageError, setIsImageError] = useState(false);
  const textMeet = isMeetOffline ? language('meetPerson') : language('virtual');
  const iconMeet = isMeetOffline ? <MeetOfflineSVG /> : <MeetOnlineSVG />;

  const onLoadImageError = () => {
    setIsImageError(true);
  };

  const renderTypeMeet = () => {
    if (isMeetOffline === null) {
      return null;
    }
    return (
      <View style={styles.wrapMeet}>
        {iconMeet}
        <Text style={styles.textMeet}>{textMeet}</Text>
      </View>
    );
  };

  if (isImageError) {
    return <Image source={images.missing} style={styles.image} />;
  } else {
    return (
      <FastImage
        source={{ uri: url, priority: FastImage.priority.high }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image}
        onError={onLoadImageError}
        onLoadEnd={onLoadEnd}
      >
        {renderTypeMeet()}
      </FastImage>
    );
  }
}

export default React.memo(HomeDetailCarouselItem);

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
  wrapMeet: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.bg_gray_virtual,
    marginTop: 65,
    marginRight: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  textMeet: {
    fontSize: fonts.size.s12,
    color: colors.red_700,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: '500',
  },
});
