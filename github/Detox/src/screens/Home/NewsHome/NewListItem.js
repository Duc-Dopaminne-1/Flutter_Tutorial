import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {SIZES} from '../../../assets/constants/sizes';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal, small, smallNormal} from '../../../assets/theme/metric';
import ImageProgress from '../../../components/ImageProgress';
import HTMLEntities from '../../../utils/HTMLEntities';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import {dateToString} from '../../../utils/TimerCommon';

const IMAGE_WIDTH = 117;

const NewsListItem = ({item, onPress}) => {
  const {title, previewImageUrl, createdDatetime} = item;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ImageProgress
        url={previewImageUrl}
        imageStyle={styles.thumbnail}
        containerStyle={styles.thumbnail}
        imageContainerStyle={styles.thumbnail}
      />
      <View style={styles.leftContent}>
        <Text style={styles.name} numberOfLines={2}>
          {HTMLEntities.decode(title)}
        </Text>
        <Text style={styles.date}>{dateToString(createdDatetime)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const NewsListItemTop = props => {
  const {title, previewImageUrl, createdDatetime, onPressItem} = props;
  const maskColor = ['rgba(0,0,0,0)', 'rgba(0,0,0,.3)', 'rgba(0,0,0,.7)'];
  return (
    <TouchableOpacity onPress={onPressItem} style={styles.imageContainerStyle}>
      <Image style={[styles.image]} source={{uri: previewImageUrl || null}} />
      <LinearGradient style={[styles.gradientStyle]} colors={maskColor}>
        <Text numberOfLines={2} style={styles.textTitle}>
          {HTMLEntities.decode(title)}
        </Text>
        <View style={[HELPERS.row]}>
          <Text style={styles.textTime}>{dateToString(createdDatetime)}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...HELPERS.row,
    borderRadius: 8,
    ...METRICS.horizontalMargin,
    marginBottom: normal,
    overflow: 'hidden',
    borderColor: COLORS.NEUTRAL_BORDER,
    borderWidth: 1,
  },
  leftContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: small,
    overflow: 'hidden',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  name: {
    fontSize: 14,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  thumbnail: {
    width: IMAGE_WIDTH,
    height: 90,
  },
  date: {
    fontSize: 12,
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_40,
  },
  imageContainerStyle: {
    marginHorizontal: normal,
    width: SCREEN_SIZE.WIDTH - 32,
    flexWrap: 'nowrap',
    paddingBottom: 10,
    borderRadius: SIZES.BORDER_RADIUS_8,
    marginEnd: 16,
  },
  textTitle: {fontSize: 18, color: COLORS.NEUTRAL_WHITE, marginBottom: small, ...FONTS.bold},
  image: {height: 250, width: '100%', borderRadius: 5},
  gradientStyle: {
    height: 250,
    width: '100%',
    borderRadius: SIZES.BORDER_RADIUS_10,
    position: 'absolute',
    justifyContent: 'flex-end',
    paddingVertical: small,
    paddingHorizontal: smallNormal,
  },
  textTime: {color: COLORS.NEUTRAL_WHITE, fontSize: 14},
});

export {NewsListItem, NewsListItemTop};
