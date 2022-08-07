import drop from 'lodash/drop';
import React, {useState} from 'react';

import {ArticleDto, useSearchAllArticlesLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {ArticleParam, ArticleTypeQueryMapper, FETCH_POLICY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {METRICS} from '../../../assets/theme/metric';
import Section from '../../../components/Section';
import {Loading} from '../../../components/SectionHorizontalList';
import {SkeletonNews} from '../../../components/Skeleton';
import NewsCategories from '../../Pages/NewsList/NewsCategories';
import styles from '../styles';
import {NewsListItem, NewsListItemTop} from './NewListItem';
import {defaultListNews, mapAgentPropsUi} from './types';

export const useGetArticles = ({onDone}) => {
  const [articles, setArticles] = useState([]);
  const {startApi, loading, called} = useGraphqlApiLazy({
    graphqlApiLazy: useSearchAllArticlesLazyQuery,
    dataField: 'searchArticles',
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
    showSpinner: false,
    onError: () => {
      setArticles(null);
      onDone();
    },
    onSuccess: (response: ArticleDto) => {
      setArticles(response.articleDtos.map(mapAgentPropsUi));
      onDone();
    },
  });

  const result: NewsProps = {
    getArticle: ({articleType = ArticleParam.Newest, page = 1, pageSize = 5}) =>
      startApi({
        variables: {
          input: {
            page: page,
            pageSize: pageSize,
            languageCode: 'vi',
            orderBy: 'CREATEDLATEST',
            articleTypeIdsJson: JSON.stringify(...[ArticleTypeQueryMapper[articleType]]),
          },
        },
      }),
    articles,
    called,
    loading,
  };

  return result;
};

export const RenderTopNews = ({items, onPressItem}) => {
  return <NewsListItemTop {...items[0]} onPressItem={() => onPressItem(items[0])} />;
};

export const RenderItemNews = ({items, onPressItem}) => {
  const subItems = drop(items);
  return (
    subItems &&
    subItems.length > 0 &&
    subItems.map(item => (
      <NewsListItem key={item.id} item={item} onPress={() => onPressItem(item)} />
    ))
  );
};

const NewHome = (props: NewsProps) => {
  const {listNews, onPressItem, loading} = props;
  if (!listNews) {
    return null;
  }
  return (
    <Section
      sectionName={translate('home.news')}
      isViewMoreVisible
      onViewMore={props.onPressViewMore}
      titleStyle={styles.sectionText}
      containerStyle={METRICS.resetMargin}>
      <NewsCategories
        categories={props.categories}
        onSelectCategory={props.selectCategory}
        selectedCategory={props.selectedCategory}
      />
      <Loading SkeletonComponent={<SkeletonNews />} loading={loading}>
        <RenderTopNews onPressItem={onPressItem} items={listNews} />
        <RenderItemNews onPressItem={onPressItem} items={listNews} />
      </Loading>
    </Section>
  );
};

NewHome.defaultProps = defaultListNews;

export default React.memo(NewHome);
