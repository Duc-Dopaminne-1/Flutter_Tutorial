import React, { useState, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, screenWidth } from '@/vars';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import CarouselItem from './CarouselItem';
import CustomButton from '@/components/CustomButton';
import { useSelector } from 'react-redux';
import { UserInit } from '@/redux/user/reducer';

export function WrapperCarousel(): ReactElement {
  const { photos } = useSelector((state: UserInit) => state.user.data);
  const [indexDot, setIndexDot] = useState(0);
  const renderItem = ({ item: photo }) => {
    return <CarouselItem item={photo} />;
  };

  return (
    <View>
      <Carousel
        data={photos}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        onBeforeSnapToItem={_index => {
          // this.currentIndex = index;
        }}
        onSnapToItem={index => setIndexDot(index)}
        initialNumToRender={1}
        loop={false}
        loopClonesPerSide={1}
        hasParallaxImages={true}
      />
      <View>
        <CustomButton containerStyle={styles.wrapHammer} iconStyle={styles.iconHammer} wrapIconStyle={styles.wrapIconHammer} />
        <View style={styles.wrapPagination}>
          <Pagination
            dotsLength={3}
            activeDotIndex={indexDot}
            dotStyle={styles.dot}
            inactiveDotStyle={styles.inactiveDot}
            inactiveDotOpacity={0.7}
            inactiveDotScale={0.6}
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
    width: 30,
    height: 6,
    borderRadius: 5,
    backgroundColor: colors.black,
  },
  inactiveDot: {
    width: 15,
    backgroundColor: colors.gray_product,
  },
  wrapHammer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  iconHammer: {
    height: 12,
    width: 12,
  },
  wrapIconHammer: {
    width: null,
  },
});
