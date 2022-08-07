import {CONSTANTS} from '../../assets/constants';
import Configs from '../../configs';
import {getAuthApiHeaders} from '..';
import {parseResponseData} from '../restful/parseResponseData';
import {parseResponseError} from '../restful/parseResponseError';
import {createRestfulApi} from './commonHandlers';

const STATIC_PAGE_BASE_URL = Configs.static_rules;
const endPoints = {
  basicArticlePage: '/basic-article-page',
  articleList: '/article-page',
  introduce: '/introduce-page',
  training: '/kien-thuc',
};

const endPointUrl = {
  BasicPages: 'quy-che/',
  Introduction: '',
  ArticlePage: 'news?nav=',
  Guide: 'guide?tab=',
  PlusServices: 'plus-service/',
};

const basicArticleUrl = ({languageCode, pageType}) => {
  return `${endPoints.basicArticlePage}/${languageCode}/${pageType}`;
};

const articleListUrl = ({
  languageCode,
  pageType,
  page = CONSTANTS.DEFAULT_START_PAGE,
  pageSize = CONSTANTS.DEFAULT_PAGE_SIZE,
}) => {
  return `${endPoints.articleList}/${languageCode}/${page}/${pageSize}/${pageType}`;
};

const introduceUrl = ({languageCode}) => {
  return `${endPoints.introduce}/${languageCode}`;
};

const getStaticPageUrl = ({pageType, objectType, isStaticPage = true}) => {
  const staticRoute = isStaticPage ? 'static/' : '';
  return `${STATIC_PAGE_BASE_URL.BASE_URL}/${staticRoute}${endPointUrl[objectType]}${pageType}`;
};

const getPageUrlTraning = ({id, slug}) => {
  if (id) {
    return `${STATIC_PAGE_BASE_URL.BASE_URL}${endPoints.training}/${id}-${slug}`;
  }
  return `${STATIC_PAGE_BASE_URL.BASE_URL}${endPoints.training}/${slug}`;
};

const restfulApiInstance = createRestfulApi({
  baseURL: `${Configs.rest.BASE_URL}/static/content`,
});

function staticApiConfig() {
  const apiConfig = {
    headers: {
      ...getAuthApiHeaders(),
    },
  };
  return apiConfig;
}

async function getBaseStaticPageApi(endPoint) {
  try {
    const apiConfig = staticApiConfig();
    const results = await restfulApiInstance.get(endPoint, {}, apiConfig);
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

async function getBasicArticlePageApi(queryOptions = {}) {
  const endPoint = basicArticleUrl(queryOptions?.variables);
  const results = await getBaseStaticPageApi(endPoint);

  return results;
}

async function getArticlePageListApi(queryOptions = {}) {
  const endPoint = articleListUrl(queryOptions?.variables);
  const results = await getBaseStaticPageApi(endPoint);
  return results;
}

async function getIntroducePageApi(queryOptions = {}) {
  const endPoint = introduceUrl(queryOptions?.variables);
  const results = await getBaseStaticPageApi(endPoint);
  return results;
}

export {
  getArticlePageListApi,
  getBasicArticlePageApi,
  getIntroducePageApi,
  getPageUrlTraning,
  getStaticPageUrl,
};
