import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AutoSizeText} from 'react-native-auto-size-text';

import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import ImageProgress from '../../components/ImageProgress';
import {MaskView} from '../../components/MaskView';

function FeaturedItem({item}) {
  const {title, cost} = item;
  return (
    <View style={styles.container}>
      <ImageProgress
        url={item.photo}
        resizeMode="cover"
        containerStyle={styles.fillItem}
        imageContainerStyle={styles.fillItem}
        imageStyle={styles.image}
      />
      <MaskView customStyle={styles.fillItem} colors={[COLORS.BLACK_05, COLORS.BLACK_05]}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </MaskView>
      <View style={styles.circlePrice}>
        <View style={styles.priceContainer}>
          {cost ? (
            <>
              <Text style={styles.priceText}>{translate('common.fromPrice')}</Text>
              <AutoSizeText numberOfLines={1} fontSize={12} style={styles.price}>
                {cost?.toLowerCase()}
              </AutoSizeText>
            </>
          ) : (
            <Text numberOfLines={2} style={[styles.price]}>
              {translate('home.contactPrice')}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default FeaturedItem;
const styles = StyleSheet.create({
  container: {
    width: 132,
    height: 90,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  fillItem: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  image: {width: '100%', height: '100%'},
  title: {
    ...FONTS.bold,
    fontSize: 16,
    color: COLORS.NEUTRAL_WHITE,
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
  },
  circlePrice: {
    width: 55,
    height: 55,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY_A100,
    position: 'absolute',
    top: -12,
    right: -12,
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 8,
    right: 12,
  },
  priceText: {color: COLORS.NEUTRAL_WHITE, fontSize: 10},
  price: {
    color: COLORS.NEUTRAL_WHITE,
    ...FONTS.bold,
    width: 40,
    textAlign: 'center',
    fontSize: 10,
  },
});
