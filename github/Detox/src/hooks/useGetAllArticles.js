import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {
  SearchArticleOrderBy,
  useSearchAllArticlesLazyQuery,
} from '../api/graphql/generated/graphql';
import {getAppLanguage} from '../appData/appSettings/selectors';
import {ArticleTypeQueryMapper, CONSTANTS, FETCH_POLICY} from '../assets/constants';
import {FONT_BOLD, FONT_REGULAR} from '../assets/fonts';
import {getLanguageCodeShort} from '../assets/localize';
import {normal, small} from '../assets/theme/metric';
import {getFullSizeImageDimension, getHeightImageDimension, IMAGE_RATIO} from '../utils/ImageUtil';
import MeasureUtils from '../utils/MeasureUtils';

const fontSizeTitle = 18;
const fontSizePreview = 14;

const fullSize = getFullSizeImageDimension();
const margin = normal * 2 + small;
const imageItemHeight = getHeightImageDimension(2, IMAGE_RATIO.R2x4);

const getItemHeight = async item => {
  const titleSize = await MeasureUtils.measureTextSize({
    fontSize: fontSizeTitle,
    fontFamily: FONT_BOLD,
    text: item?.title,
    width: fullSize.width - 16,
    lineInfoForLine: 2,
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
    normal * 2 +
    (previewSize.lineCount ? previewSize.height : 0);
  return heightItem;
};

const mapToUiModel = item => {
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

const appendItemsHeight = async items => {
  const list = [];
  for (let i = 0; i < items.length; i++) {
    const height = await getItemHeight(items[i]);
    list.push({
      ...mapToUiModel(items[i]),
      height: height,
    });
  }
  return list;
};

const useGetAllArticles = ({
  page = 1,
  pageSize = CONSTANTS.DEFAULT_INVESTOR_PAGE_SIZE,
  keyword = '',
  orderBy = SearchArticleOrderBy.Createdlatest,
  articleTypeIdsJson = JSON.stringify(...Object.values(ArticleTypeQueryMapper)),
  baseQueryOptions = {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {},
    ...FETCH_POLICY.CACHE_AND_NETWORK,
  },
}) => {
  const appLanguage = useSelector(getAppLanguage);
  const languageCode = getLanguageCodeShort(appLanguage);
  const [articles, setArticles] = useState([]);
  const [handlingResponse, setHandlingResponse] = useState(false);
  const [execute, {data: articlesData, loading, refetch, fetchMore, error, networkStatus}] =
    useSearchAllArticlesLazyQuery({
      ...baseQueryOptions,
    });

  const queryParams = {
    keyword,
    page,
    pageSize,
    languageCode,
    orderBy,
    articleTypeIdsJson,
  };

  useEffect(() => {
    execute({
      variables: {
        input: {
          keyword,
          page,
          pageSize,
          languageCode,
          orderBy,
          articleTypeIdsJson,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleTypeIdsJson, execute]);

  useEffect(() => {
    if (articlesData) {
      (async () => {
        setHandlingResponse(true);
        const rawItems = articlesData?.searchArticles?.articleDtos ?? [];
        const appendArticles = await appendItemsHeight(rawItems);
        setArticles(appendArticles);
        setHandlingResponse(false);
      })();
    }
  }, [articlesData]);

  useEffect(() => {
    if (!loading && !handlingResponse) {
      baseQueryOptions?.onCompleted?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, networkStatus]);

  const onFetchMore = fetchMoreParams => {
    fetchMore({
      variables: {
        input: {...queryParams, ...fetchMoreParams},
      },
      updateQuery: (prev, {fetchMoreResult}) => {
        const tempResult = {...prev};
        tempResult.searchArticles.articleDtos = [
          ...(prev?.searchArticles?.articleDtos ?? []),
          ...(fetchMoreResult?.searchArticles?.articleDtos ?? []),
        ];
        return tempResult;
      },
    });
  };

  const onRefetch = () => {
    refetch();
  };

  return {
    loading,
    articles,
    totalCount: articlesData?.searchArticles?.totalCount ?? 0,
    onRefetch,
    onFetchMore,
    error,
    networkStatus,
  };
};

export default useGetAllArticles;
