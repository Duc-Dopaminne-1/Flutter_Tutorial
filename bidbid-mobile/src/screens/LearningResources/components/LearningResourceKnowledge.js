import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal} from '../../../assets/theme/metric';
import Section from '../../../components/Section';
import ScreenIds from '../../ScreenIds';
import {callApi, InitApi, LearningResourceTypeId} from '../utils/LearningResourcesUtils';
import {LearningResourceProps} from './LearningResourceKnowledgeItem';
import LearningResourceKnowledgeList from './LearningResourceKnowledgeList';

const PAGE_SIZE = 5;

export function LearningResourceKnowledge(): React.ReactElement {
  const {navigate} = useNavigation();
  const title = translate('knowledge.tab.realEstateKnowledge');
  const [shouldShowLoading, setShouldShowLoading] = useState(true);
  const [listResource, setListResource] = useState([]);

  const getDataSuccess = (items: LearningResourceProps[]) => {
    setListResource(items);
    setShouldShowLoading(false);
  };

  const {startApi} = InitApi(getDataSuccess);

  useEffect(() => {
    callApi({categoryId: LearningResourceTypeId.GeneralKnowledge, startApi, pageSize: PAGE_SIZE});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onViewMore = () => {
    navigate(ScreenIds.LearningResourceCategoryScreen, {
      title,
      categoryId: LearningResourceTypeId.GeneralKnowledge,
    });
  };

  return (
    <Section
      sectionName={title}
      isViewMoreVisible
      onViewMore={onViewMore}
      titleStyle={styles.sectionText}
      titleContainerStyle={styles.titleContainer}
      containerStyle={styles.container}>
      <LearningResourceKnowledgeList {...{listResource, shouldShowLoading}} />
    </Section>
  );
}

const styles = StyleSheet.create({
  container: {
    ...METRICS.marginTop,
    marginHorizontal: SIZES.MARGIN_16,
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
