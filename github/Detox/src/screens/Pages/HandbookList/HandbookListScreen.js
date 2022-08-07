import React from 'react';
import {StyleSheet, View} from 'react-native';

import {categoriesNews} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import PageScreen from '../../../components/PageScreen';
import ThumbnailArticleList from '../ThumbnailArticleList/ThumbnailArticleList';

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});

const HandbookListScreen = () => {
  return (
    <PageScreen title={translate(STRINGS.HANDBOOK)}>
      <View style={styles.contentContainer}>
        <ThumbnailArticleList
          articleType="HANDBOOK"
          categories={categoriesNews}
          title={translate(STRINGS.HANDBOOK)}
        />
      </View>
    </PageScreen>
  );
};

export default HandbookListScreen;
