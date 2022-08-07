import {useAnalytics} from '@segment/analytics-react-native';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import {
  SearchArticleOrderBy,
  useSearchAllArticlesLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {getAppLanguage} from '../../../appData/appSettings/selectors';
import {ArticleTypeQueryMapper, DEFAULT_PAGE_SIZE, EMPTY_TYPE} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {FONT_BOLD, FONT_REGULAR} from '../../../assets/fonts';
import {getLanguageCodeShort, translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {normal, small} from '../../../assets/theme/metric';
import LazyList, {PAGING_TYPE} from '../../../components/LazyList';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import {
  getFullSizeImageDimension,
  getHeightImageDimension,
  IMAGE_RATIO,
} from '../../../utils/ImageUtil';
import MeasureUtils from '../../../utils/MeasureUtils';
import ScreenIds from '../../ScreenIds';
import {TrackingActions} from '../../WithSegment';
import {ResultSearch} from '../components/ResultSearch';
import SearchHeader from '../components/SearchHeader';
import SearchNewsItem from './components/SearchNewsItem';

const START_PAGE = 1;

const fontSizeTitle = 18;
const fontSizePreview = 14;
const fullSize = getFullSizeImageDimension();
const imageItemHeight = getHeightImageDimension(2, IMAGE_RATIO.R2x4);
const margin = normal * 2 + small;

const SearchNewsScreen = ({navigation}) => {
  const {track} = useAnalytics();
  const appLanguage = useSelector(getAppLanguage);
  const [keyword, setKeyword] = useState('');
  const [totalNews, setTotalNews] = useState(0);

  const onChangeKeyword = text => {
    setKeyword(text);
  };

  const onBackPress = () => {
    navigation.canGoBack() && navigation.goBack();
  };

  const onClearText = () => {
    onChangeKeyword('');
  };

  const languageCode = getLanguageCodeShort(appLanguage);

  const queryParams = {
    input: {
      keyword: keyword,
      page: START_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      languageCode: languageCode,
      orderBy: SearchArticleOrderBy.Createdlatest,
      articleTypeIdsJson: JSON.stringify(...Object.values(ArticleTypeQueryMapper)),
    },
  };

  const onDataChange = ({totalCount}) => {
    setTotalNews(totalCount ?? 0);
  };

  const goToDetail = data => {
    if (data) {
      track(TrackingActions.newsClicked, {
        category: data?.category ?? '',
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

  return (
    <SafeAreaScreenContainer style={styles.searchContainer}>
      <SearchHeader
        onClearPress={onClearText}
        onBackPress={onBackPress}
        onChangeKeyword={onChangeKeyword}
        value={keyword}
        autoFocus
        delayTimeout={1000}
        iconSize={15}
        customTextStyle={{color: COLORS.TEXT_DARK_10}}
        showRightIcon={keyword.trim().length > 0}
        isClearText={true}
        container={styles.searchContainer}
        customStyle={styles.searchHeaderInput}
        showHeaderShadow
        style={styles.searchHeader}
      />
      <ResultSearch
        filterKeyword={null}
        resultValue={totalNews}
        isShowSort={false}
        containerStyle={styles.resultSearchContainer}
      />
      <LazyList
        useQuery={useSearchAllArticlesLazyQuery}
        queryOptions={{variables: queryParams}}
        extractArray={response => response?.searchArticles?.articleDtos ?? []}
        mapToUiModel={mapToUiModel}
        renderItem={({item}) => <SearchNewsItem item={item} onPressItem={goToDetail} />}
        itemHeight={item => SearchNewsItemHeight(item)}
        pagingType={PAGING_TYPE.OFFSET}
        emptyType={EMPTY_TYPE.DEFAULT}
        onDataChange={onDataChange}
        containerStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
        extractTotalCount={response => response?.searchArticles?.totalCount ?? 0}
      />
    </SafeAreaScreenContainer>
  );
};

export const SearchNewsItemHeight = async item => {
  const titleSize = await MeasureUtils.measureTextSize({
    fontSize: fontSizeTitle,
    fontFamily: FONT_BOLD,
    text: item?.title,
    width: fullSize.width - 16,
    lineInfoForLine: 3,
  });

  const previewSize = await MeasureUtils.measureTextSize({
    fontSize: fontSizePreview,
    fontFamily: FONT_REGULAR,
    text: item?.preview,
    width: fullSize.width - 16,
    lineInfoForLine: 3,
  });
  const heightItem =
    imageItemHeight.height +
    margin +
    titleSize.height +
    margin +
    (previewSize.lineCount ? previewSize.height : 0);
  return heightItem;
};

export const mapToUiModel = item => {
  return {
    articleType: item?.articleType,
    createdDatetime: item?.createdDatetime,
    id: item?.id,
    preview: item?.preview,
    previewImageUrl: item?.previewImageUrl,
    slug: item?.slug,
    title: item?.title,
    body: item?.body,
  };
};

const styles = StyleSheet.create({
  searchHeader: {
    zIndex: 1,
  },
  searchHeaderInput: {
    borderRadius: SIZES.BORDER_RADIUS_8,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  searchContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  resultSearchContainer: {
    marginTop: normal,
  },
});

export default SearchNewsScreen;
