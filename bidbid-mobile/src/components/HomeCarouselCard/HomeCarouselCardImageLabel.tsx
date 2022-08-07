import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { language } from '@/i18n';
import styles from './styles';
import { shouldSwipe } from '@/shared/global';
import { Auction } from '@/models';
import MeetOfflineSVG from '@/components/SVG/MeetOfflineSVG';
import MeetOnlineSVG from '@/components/SVG/MeetOnlineSVG';

interface HomeCarouselCardImageProps {
  liveAuction?: Auction;
}

const HomeCarouselCardImageLabel: FC<HomeCarouselCardImageProps> = ({ liveAuction }) => {
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    const shouldSwipeSubscribe = shouldSwipe.subscribe(data => {
      setSwiping(data.status);
    });

    return () => {
      shouldSwipeSubscribe?.unsubscribe();
    };
  }, []);

  if (!liveAuction || swiping) {
    return null;
  }

  const textMeet = liveAuction.meetPlaceId ? language('meetPerson') : language('virtual');
  const iconMeet = liveAuction.meetPlaceId ? <MeetOfflineSVG /> : <MeetOnlineSVG />;

  return (
    <View style={styles.wrapMeet}>
      <View style={styles.wrapIcon}>{iconMeet}</View>
      <Text style={styles.textMeet}>{textMeet}</Text>
    </View>
  );
};

export default HomeCarouselCardImageLabel;
