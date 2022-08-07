import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {ArticleTypeQueryMapper} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal, small, tiny} from '../../../assets/theme/metric';
import ImageProgress from '../../../components/ImageProgress';
import useGetAllArticles from '../../../hooks/useGetAllArticles';
import {IMAGE_RATIO} from '../../../utils/ImageUtil';
import {dateToString} from '../../../utils/TimerCommon';

const DEFAULT_HOT_NEWS_SIZE = 3;

const PageDetailHotNews = ({onItemPress = () => {}, currentHotNewsId}) => {
  const {articles: hotNewsArticles, loading} = useGetAllArticles({
    pageSize: DEFAULT_HOT_NEWS_SIZE + 1,
    articleTypeIdsJson: JSON.stringify(...Object.values([ArticleTypeQueryMapper.newest])),
  });

  if (loading) {
    return (
      <View style={HELPERS.fillCenter}>
        <Text style={styles.emptyMessage}>{translate(STRINGS.LOADING)}</Text>
      </View>
    );
  }

  const threeHotNews =
    hotNewsArticles
      ?.filter(item => item?.id !== currentHotNewsId)
      ?.slice(0, DEFAULT_HOT_NEWS_SIZE) ?? [];

  if (!threeHotNews || !threeHotNews?.length) return null;

  return (
    <View style={styles.hotNews}>
      <ScrollView>
        {threeHotNews.map(item => {
          return <HotNewsItem key={item?.id} item={item} onPress={() => onItemPress(item)} />;
        })}
      </ScrollView>
    </View>
  );
};

const HotNewsItem = ({item, onPress}) => {
  const {title, previewImageUrl, createdDatetime} = item;

  return (
    <TouchableOpacity style={styles.hotNewsItemContainer} onPress={onPress}>
      <ImageProgress
        url={previewImageUrl}
        imageStyle={styles.thumbnail}
        containerStyle={styles.thumbnail}
        imageContainerStyle={styles.thumbnail}
      />
      <View style={styles.leftContent}>
        <Text style={styles.name} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.date}>{dateToString(createdDatetime)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const IMAGE_WIDTH = 164;
const styles = StyleSheet.create({
  hotNews: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: COLORS.NEUTRAL_DIVIDER,
    paddingVertical: normal,
  },
  hotNewsItemContainer: {
    ...HELPERS.row,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: SIZES.BORDER_RADIUS_8,
    marginBottom: normal,
  },
  thumbnail: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRadius: SIZES.BORDER_RADIUS_8,
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH * IMAGE_RATIO.R2x4,
  },
  leftContent: {
    flex: 1,
    paddingLeft: normal,
    paddingVertical: small,
    paddingRight: small,
  },
  name: {
    fontSize: 14,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 10,
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_40,
    marginTop: tiny,
  },
  emptyMessage: {
    ...HELPERS.selfCenter,
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_40,
  },
});

export default PageDetailHotNews;
