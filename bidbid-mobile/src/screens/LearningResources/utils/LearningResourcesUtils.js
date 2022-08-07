import React from 'react';

import {
  ArticleDto,
  SearchArticleOrderBy,
  useSearchAllArticlesLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';

export type LearningResource = Partial<ArticleDto>;

export const LearningResourceTypeId = {
  Tips: 15,
  Guide: 16,
  RealEstateLaw: 17,
  LandingPage: 18,
  GeneralKnowledge: 20,
  News: 21,
  LifeStyle: 22,
};

export function InitApi(onSuccess?: () => {}): React.ReactElement {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useSearchAllArticlesLazyQuery,
    dataField: 'searchArticles.articleDtos',
    onSuccess,
  });
  return {startApi};
}

export function InitApiSearch(onSuccess?: () => {}): React.ReactElement {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useSearchAllArticlesLazyQuery,
    dataField: 'searchArticles',
    onSuccess,
  });
  return {startApi};
}

interface initDataProps {
  categoryId: number;
  startApi: () => void;
  pageSize: number;
  keyword: string;
  page?: number;
  isSearchAll?: boolean;
}

const getCategoryId = (categoryId: number, isSearchAll: boolean) => {
  if (isSearchAll) {
    const listResourceTypeId = Object.values(LearningResourceTypeId);
    return JSON.stringify(
      listResourceTypeId.map(item => {
        return {article_type_id: item};
      }),
    );
  }

  return `[{"article_type_id":${categoryId}}]`;
};
export const callApi = (props: initDataProps) => {
  const {
    categoryId,
    startApi = () => {},
    pageSize = 4,
    keyword = '',
    page = 1,
    isSearchAll = false,
  } = props;

  startApi({
    variables: {
      input: {
        keyword,
        articleTypeIdsJson: getCategoryId(categoryId, isSearchAll),
        page,
        pageSize,
        languageCode: 'vi',
        orderBy: SearchArticleOrderBy.Createdlatest,
      },
    },
  });
};
