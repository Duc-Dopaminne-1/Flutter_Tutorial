import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal} from '../../../assets/theme/metric';
import Section from '../../../components/Section';
import ScreenIds from '../../ScreenIds';
import {callApi, InitApi} from '../utils/LearningResourcesUtils';
import {LearningResourceProps} from './LearningResourceKnowledgeItem';
import LearningResourceListViewFlatList from './LearningResourceListViewFlatList';

interface LearningResourceListViewProps {
  categoryId: number;
  title?: string;
}

function LearningResourceListView(props: LearningResourceListViewProps): React.ReactElement {
  const {categoryId, title} = props;
  const [listResource, setListResource] = useState([]);
  const {navigate} = useNavigation();

  const getDataSuccess = (items: LearningResourceProps[]) => {
    setListResource(items);
  };

  const {startApi} = InitApi(getDataSuccess);

  useEffect(() => {
    callApi({categoryId, startApi});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onViewMore = useCallback(() => {
    navigate(ScreenIds.LearningResourceCategoryScreen, {
      title,
      categoryId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, categoryId]);

  return (
    <Section
      sectionName={title}
      isViewMoreVisible
      onViewMore={onViewMore}
      titleStyle={styles.sectionText}
      titleContainerStyle={styles.titleContainer}
      containerStyle={styles.container}>
      <LearningResourceListViewFlatList listResource={listResource} shouldUseFlatList={false} />
    </Section>
  );
}
export default LearningResourceListView;

const styles = StyleSheet.create({
  container: {
    ...METRICS.marginTop,
    paddingHorizontal: SIZES.PADDING_16,
  },
  sectionText: {
    ...HELPERS.fill,
    ...FONTS.semiBold,
    color: COLORS.TEXT_DARK_10,
    fontSize: SIZES.FONT_24,
    marginBottom: normal,
  },
  titleContainer: {
    marginHorizontal: SIZES.MARGIN_0,
  },
});
