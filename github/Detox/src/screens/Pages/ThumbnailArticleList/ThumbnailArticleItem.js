import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal} from '../../../assets/theme/metric';
import ImageProgress from '../../../components/ImageProgress';
import HTMLEntities from '../../../utils/HTMLEntities';
import {dateToString} from '../../../utils/TimerCommon';

const styles = StyleSheet.create({
  container: {
    ...HELPERS.row,
    ...METRICS.horizontalMargin,
    marginBottom: normal,
  },
  leftContent: {
    flex: 1,
    paddingLeft: normal,
  },
  name: {
    fontSize: 18,
    ...FONTS.bold,
    marginBottom: normal,
    lineHeight: 23,
    letterSpacing: 0.5,
  },
  thumbnail: {
    width: 105,
    height: 105,
  },
  date: {
    fontSize: 10,
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_40,
  },
});

const ThumbnailArticleItem = ({item, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <ImageProgress
          url={item?.previewImageUrl || ''}
          imageStyle={styles.thumbnail}
          containerStyle={styles.thumbnail}
          imageContainerStyle={styles.thumbnail}
        />
        <View style={styles.leftContent}>
          <Text style={styles.name} numberOfLines={3}>
            {HTMLEntities.decode(item?.title)}
          </Text>
          <Text style={styles.date}>{dateToString(item?.createdDatetime)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

ThumbnailArticleItem.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
};

ThumbnailArticleItem.defaultProps = {
  item: {},
  onPress: null,
};

export default ThumbnailArticleItem;
