import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {
  SearchArticleOrderBy,
  useSearchAllCoursesLazyQuery,
} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {getAppLanguage} from '../../../../appData/appSettings/selectors';
import {FETCH_POLICY} from '../../../../assets/constants';
import {getLanguageCodeShort, translate} from '../../../../assets/localize';
import {METRICS} from '../../../../assets/theme/metric';
import Section from '../../../../components/Section';
import {Loading} from '../../../../components/SectionHorizontalList';
import {useMount} from '../../../commonHooks';
import ScreenIds from '../../../ScreenIds';
import {LearningResource, LearningResourceTypeId} from '../../utils/LearningResourcesUtils';
import ArticleMostViewedItem from './ArticleMostViewedItem';
import styles from './styles';

const ArticleMostViewed = ({typeId}: {typeId: string}) => {
  const navigation = useNavigation();
  const appLanguage = useSelector(getAppLanguage);
  const languageCode = getLanguageCodeShort(appLanguage);
  const [learningResources, setLearningResources] = useState([]);

  const variables = {
    input: {
      page: 1,
      pageSize: 5,
      languageCode: languageCode,
      orderBy: SearchArticleOrderBy.Createdlatest,
      articleTypeIdsJson: JSON.stringify(
        [
          LearningResourceTypeId.Tips,
          LearningResourceTypeId.Guide,
          LearningResourceTypeId.RealEstateLaw,
        ]
          .filter(id => id !== typeId)
          .map(id => ({article_type_id: id})),
      ),
    },
  };

  const {startApi: getAllCourses, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useSearchAllCoursesLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'searchArticles',
    onSuccess: ({articleDtos}) => {
      setLearningResources(articleDtos);
    },
  });

  useMount(() => {
    getAllCourses({variables: variables});
  });

  const goToViewArticle = (item: LearningResource) => () => {
    navigation?.push(ScreenIds.LearningResourceDetailScreen, {articleId: item?.id});
  };

  if (!learningResources?.length) return null;

  return (
    <View style={styles.articleMostViewedContainer}>
      <Section
        sectionName={translate('learningResources.articleMostViewed')}
        titleStyle={styles.sectionTitle}
        titleContainerStyle={METRICS.resetMargin}
        containerStyle={METRICS.resetMargin}>
        <Loading loading={loading}>
          <View style={styles.articleMostViewedList}>
            {learningResources?.map((item: LearningResource) => {
              return (
                <ArticleMostViewedItem key={item.id} item={item} onPress={goToViewArticle(item)} />
              );
            })}
          </View>
        </Loading>
      </Section>
    </View>
  );
};

export default React.memo(ArticleMostViewed);
