import React, { FC } from 'react';
import { View } from 'react-native';
import { CustomText } from '@/components/CustomText';
import styles from './styles';
import InstagramSVG from '../SVG/InstagramSVG';

interface HomeCarouselCardInstagramProps {
  instagramUsername?: string;
}

const HomeCarouselCardInstagram: FC<HomeCarouselCardInstagramProps> = ({ instagramUsername }) => {
  if (!instagramUsername) return null;
  return (
    <View style={styles.instagramWrapper}>
      <CustomText
        titleStyle={styles.instagramUsername}
        icon={<InstagramSVG />}
        imageStyle={styles.instagramIcon}
        title={instagramUsername}
      />
    </View>
  );
};

export default HomeCarouselCardInstagram;
