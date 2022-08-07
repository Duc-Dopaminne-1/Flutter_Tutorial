import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View, ViewStyle} from 'react-native';

import {getArticleDetailPageApi} from '../../api/userApi/staticPagesApi';
import {SIZES} from '../../assets/constants/sizes';
import {getLanguageCodeShort, translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import BaseScreen from '../../components/BaseScreen';
import {Loading} from '../../components/SectionHorizontalList';
import HTMLEntities from '../../utils/HTMLEntities';
import {useMount} from '../commonHooks';
import ScreenIds from '../ScreenIds';
import ArticleContent from './components/Article/ArticleContent';
import ArticleHeader from './components/Article/ArticleHeader';
import ArticleMostViewed from './components/Article/ArticleMostViewed';
import ArticleRightHeader from './components/Article/ArticleRightHeader';
import {LearningResource} from './utils/LearningResourcesUtils';

const LearningResourceDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {articleId} = route?.params || {};
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const getArticleDetail = async (id: string) => {
    if (id) {
      setLoading(true);
      const res = await getArticleDetailPageApi({
        languageCode: getLanguageCodeShort(),
        id,
      });
      setArticle(res?.data);
      setLoading(false);
    }
  };

  useMount(() => {
    getArticleDetail(articleId);
  });

  return (
    <BaseScreen
      title={translate(STRINGS.DETAIL)}
      containerStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
      testID={ScreenIds.LearningResourceDetailScreen}
      showHeaderShadow
      rightComponent={
        <ArticleRightHeader
          navigation={navigation}
          articleId={article?.id}
          title={article?.title}
          articleSlug={article?.slug}
        />
      }>
      <Loading loading={loading} emptyCustomStyle={styles.emptyCustomStyle}>
        <LearningResourceDetailContainer article={article} />
      </Loading>
    </BaseScreen>
  );
};

export const LearningResourceDetailContainer = ({article}: {article: LearningResource}) => {
  return (
    <ScrollView style={styles.articleContainer}>
      <ArticleHeader
        articleType={article?.articleType}
        createdDatetime={article?.createdDatetime}
        title={HTMLEntities.decode(article?.title)}
      />
      <Line lineStyle={styles.firstLine} />
      <ArticleContent content={article?.body} />
      <Line />
      <ArticleMostViewed typeId={article?.articleSubTypeId} />
    </ScrollView>
  );
};

const Line = ({lineStyle = {}}: {lineStyle: ViewStyle}) => (
  <View style={[styles.line, lineStyle]} />
);

const styles = StyleSheet.create({
  articleContainer: {
    flex: 1,
    padding: SIZES.PADDING_16,
  },
  line: {
    backgroundColor: COLORS.NEUTRAL_DIVIDER,
    height: 1,
    marginVertical: SIZES.MARGIN_16,
  },
  firstLine: {
    marginBottom: 0,
  },
  emptyCustomStyle: {
    flex: 1,
  },
});

export default LearningResourceDetailScreen;
