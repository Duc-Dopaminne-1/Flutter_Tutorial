import {useNavigation} from '@react-navigation/native';
import {useAnalytics} from '@segment/analytics-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {LargeList} from 'react-native-largelist-v3';
import Carousel from 'react-native-snap-carousel';

import {ArticleParam, ArticleTypeQueryMapper, FETCH_POLICY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal, normalMedium, smallNormal} from '../../../assets/theme/metric';
import ScrollViewFooter from '../../../components/ScrollViewFooter';
import ScrollViewHeader from '../../../components/ScrollViewHeader';
import useGetAllArticles from '../../../hooks/useGetAllArticles';
import {NewsListItemTop} from '../../Home/NewsHome/NewListItem';
import ScreenIds from '../../ScreenIds';
import SearchNewsItem from '../../Search/SearchNews/components/SearchNewsItem';
import {TrackingActions} from '../../WithSegment';

const width = Dimensions.get('window').width;
const dotSize = 8;
const START_PAGE = 1;
const PAGE_SIZE = 20;

const getHeaderSectionTitle = articleType => {
  if (articleType === ArticleParam.RealEstateMarket) {
    return 'news.tab.realEstateMarket';
  }
  if (articleType === ArticleParam.HandBook) {
    return 'news.tab.handBook';
  }
  return 'news.overview';
};

const RenderTopNews = ({items, onPressItem}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const PageDot = () => {
    return (
      <View style={styles.viewDot}>
        {items.map((value, index) => {
          const styleDot =
            index === activeSlide
              ? styles.dotStyle
              : [styles.dotStyle, {backgroundColor: COLORS.GREY_CB}];
          return <View key={index} style={styleDot} />;
        })}
      </View>
    );
  };

  return (
    <View style={styles.viewItem}>
      <Carousel
        data={items}
        onSnapToItem={index => setActiveSlide(index)}
        renderItem={({item, index}) => {
          return (
            <NewsListItemTop
              customStyle={{width: width}}
              onPressItem={() => onPressItem(item)}
              key={index}
              {...item}
            />
          );
        }}
        sliderWidth={width}
        itemWidth={width}
      />
      <PageDot />
    </View>
  );
};

const ThumbnailArticleList = ({articleType = ArticleParam.MarketReport}) => {
  const {track} = useAnalytics();
  const [page, setPage] = useState(START_PAGE);
  const navigation = useNavigation();
  const listRef = useRef(null);

  const onPressItem = (data, category) => {
    if (data) {
      track(TrackingActions.newsClicked, {
        category,
        name: data?.title ?? '',
      });

      navigation.navigate(ScreenIds.PageDetail, {
        pageDetail: data,
        isShowDate: true,
        title: translate(STRINGS.DETAIL),
        emptyCommentMessage: translate('news.emptyCommentMessage'),
        showHotNews: true,
      });
    }
  };

  const {articles: topArticles} = useGetAllArticles({
    pageSize: 3,
    articleTypeIdsJson: JSON.stringify(...[ArticleTypeQueryMapper[ArticleParam.MarketReport]]),
  });

  const queryParams = {
    page,
    pageSize: PAGE_SIZE,
  };

  const onCompleted = () => {
    listRef.current?.endLoading(); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
    listRef.current?.endRefresh(); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
  };

  const {articles, onRefetch, error, networkStatus, loading, onFetchMore, totalCount} =
    useGetAllArticles({
      ...(!articleType
        ? queryParams
        : {
            ...queryParams,
            articleTypeIdsJson: JSON.stringify(...[ArticleTypeQueryMapper[articleType]]),
          }),
      pageSize: PAGE_SIZE,
      baseQueryOptions: {
        notifyOnNetworkStatusChange: true,
        onCompleted: onCompleted,
        ...FETCH_POLICY.CACHE_AND_NETWORK,
      },
    });

  useEffect(() => {
    if (!loading) {
      onCompleted();
    }
  }, [loading, error, networkStatus]);

  useEffect(() => {
    if (page !== START_PAGE) {
      setPage(START_PAGE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleType]);

  const renderItem = ({row}) => {
    const item = articles[row];

    const isTopArticle = topArticles.some(article => {
      return article.id === item.id;
    });

    if (!isTopArticle) {
      return (
        <SearchNewsItem
          item={item}
          onPressItem={() => onPressItem(item)}
          containerStyle={{paddingHorizontal: normal}}
          isBorderLine={false}
        />
      );
    }
    return <></>;
  };

  const RenderHeader = () => {
    return (
      <>
        <Text
          style={[
            styles.titleArticle,
            {marginTop: smallNormal, marginLeft: normal, marginBottom: normal},
          ]}>
          {translate('news.marketReport')}
        </Text>
        {topArticles && <RenderTopNews onPressItem={onPressItem} items={topArticles} />}
        {articleType !== ArticleParam.MarketReport ? (
          <Text
            style={[
              styles.titleArticle,
              {marginTop: normalMedium, marginLeft: normal, marginBottom: normal},
            ]}>
            {translate(getHeaderSectionTitle(articleType))}
          </Text>
        ) : (
          <View style={{marginTop: normal}} />
        )}
      </>
    );
  };

  const RenderEmpty = () => {
    return (
      <View style={{...HELPERS.selfCenter, marginTop: normal}}>
        <Text style={{fontSize: normal, ...FONTS.bold}}>{translate('news.emptyNews')}</Text>
      </View>
    );
  };

  const onRefresh = () => {
    setPage(START_PAGE);
    onRefetch({
      ...(articleType === ArticleParam.MarketReport
        ? queryParams
        : {
            ...queryParams,
            articleTypeIdsJson: JSON.stringify(...[ArticleTypeQueryMapper[articleType]]),
          }),
      pageSize: 20,
    });
  };

  const onLoadMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    onFetchMore({
      ...(articleType === ArticleParam.MarketReport
        ? queryParams
        : {
            ...queryParams,
            articleTypeIdsJson: JSON.stringify(...[ArticleTypeQueryMapper[articleType]]),
          }),
      page: newPage,
    });
  };

  const mapToTopArticles = () => {
    return articles.map(article => {
      const isTopArticle = topArticles.some(topArticle => {
        return topArticle.id === article.id;
      });
      if (isTopArticle) {
        return {...article, isTopArticle, height: 0};
      }
      return {...article, isTopArticle};
    });
  };

  return (
    <View style={styles.contentContainer}>
      <LargeList
        ref={listRef}
        renderHeader={() => RenderHeader()}
        heightForSection={() => normal}
        heightForIndexPath={({row}) => mapToTopArticles()?.[row]?.height}
        renderIndexPath={({row, section}) => renderItem({row, section})}
        refreshHeader={ScrollViewHeader}
        loadingFooter={ScrollViewFooter}
        onRefresh={onRefresh}
        onLoading={onLoadMore}
        renderEmpty={() => <RenderEmpty />}
        data={[{items: articles ?? []}]}
        allLoaded={articles.length >= totalCount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  viewDot: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dotStyle: {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    marginHorizontal: 5,
    backgroundColor: COLORS.PRIMARY_B100,
  },
  viewItem: {borderRadius: 5},
  titleArticle: {...FONTS.bold, fontSize: 20},
});

export default ThumbnailArticleList;
