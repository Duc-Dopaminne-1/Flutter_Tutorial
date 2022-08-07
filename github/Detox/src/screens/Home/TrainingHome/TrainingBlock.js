import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useSearchAllArticlesLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {categoriesKnowledge} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal, small} from '../../../assets/theme/metric';
import ImageProgress from '../../../components/ImageProgress';
import {EmptyListView} from '../../../components/List/EmptyListView';
import Section from '../../../components/Section';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import NewsCategories from '../../Pages/NewsList/NewsCategories';
import ScreenIds from '../../ScreenIds';
import styles from '../styles';

type ItemTraining = {
  image: string,
  url: string,
};

const IMAGE_HEIGHT = 157;
const IMAGE_WIDTH = 276;
const ITEM_HEIGHT = IMAGE_HEIGHT + 60;

const TrainingItem = ({item, onPressItem}) => {
  return (
    <TouchableOpacity onPress={onPressItem} style={trainingStyles.item}>
      <ImageProgress
        containerStyle={trainingStyles.containerImage}
        imageContainerStyle={trainingStyles.containerImage}
        imageStyle={trainingStyles.imageStyle}
        url={item?.previewImageUrl}
      />
      <View style={trainingStyles.viewInfo}>
        <Text numberOfLines={2} style={{color: COLORS.TEXT_BLACK, ...FONTS.bold}}>
          {item?.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const TrainingBlock = ({navigation, onPressViewMore}) => {
  const [course, setCourse] = useState('');
  const [selectedCategory, selectCategory] = useState(categoriesKnowledge[0]);

  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useSearchAllArticlesLazyQuery,
    dataField: 'searchArticles.articleDtos',
    onSuccess: data => {
      setCourse(data);
    },
  });

  useEffect(() => {
    setCourse([]);
    startApi({
      variables: {
        input: {
          articleSubTypeIdsJson: JSON.stringify(
            selectedCategory?.subType?.map(item => {
              return {
                article_sub_type_id: item,
              };
            }),
          ),
          articleTypeIdsJson: `[{"article_type_id":${selectedCategory.id}}]`,
          page: 1,
          pageSize: 10,
          languageCode: 'vi',
          orderBy: 'CREATEDLATEST',
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory.id]);

  const onDetailKnowLeage = (item: ItemTraining) => {
    navigation.navigate(ScreenIds.TrainingDetailSceen, {
      id: item.id,
      subTag: selectedCategory?.subTag,
      slug: item.slug,
    });
  };

  const changeArticleType = e => {
    selectCategory(e);
  };

  return (
    <Section
      sectionName={translate('home.training')}
      isViewMoreVisible
      onViewMore={onPressViewMore}
      titleStyle={styles.sectionText}
      containerStyle={METRICS.marginTop}>
      <NewsCategories
        categories={categoriesKnowledge}
        onSelectCategory={e => changeArticleType(e)}
        selectedCategory={selectedCategory}
      />
      <ScrollView
        horizontal
        contentContainerStyle={{paddingLeft: normal}}
        showsHorizontalScrollIndicator={false}
        style={HELPERS.row}>
        {course && course.length ? (
          course.map(item => (
            <TrainingItem item={item} onPressItem={() => onDetailKnowLeage(item)} key={item.id} />
          ))
        ) : (
          <View style={trainingStyles.emptyView}>
            <EmptyListView />
          </View>
        )}
      </ScrollView>
    </Section>
  );
};

const trainingStyles = StyleSheet.create({
  containerImage: {width: IMAGE_WIDTH, height: IMAGE_HEIGHT},
  item: {
    width: IMAGE_WIDTH,
    height: ITEM_HEIGHT,
    marginEnd: normal,
    borderRadius: small,
    borderWidth: 1,
    borderColor: COLORS.NEUTRAL_BORDER,
    overflow: 'hidden',
  },
  emptyView: {
    height: ITEM_HEIGHT,
    width: SCREEN_SIZE.WIDTH - 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderTopLeftRadius: small,
    borderTopRightRadius: small,
  },
  viewInfo: {
    flex: 1,
    padding: small,
  },
});

export default TrainingBlock;
