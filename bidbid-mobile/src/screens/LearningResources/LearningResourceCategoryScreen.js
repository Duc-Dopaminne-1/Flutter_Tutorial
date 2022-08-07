import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {translate} from '../../assets/localize';
import PageScreen from '../../components/PageScreen';
import SearchBox from '../Home/SearchBox';
import ScreenIds from '../ScreenIds';
import {LearningResourceProps} from './components/LearningResourceKnowledgeItem';
import LearningResourceKnowledgeList from './components/LearningResourceKnowledgeList';
import LearningResourceListViewFlatList from './components/LearningResourceListViewFlatList';
import {callApi, InitApi} from './utils/LearningResourcesUtils';

const PAGE_SIZE = 10;
const MAX_ITEM_PAGINATION = 5;x

export const LearningResourceCategoryScreen = () => {
  const route = useRoute();
  const {title, categoryId} = route?.params || {
    title: '',
    categoryId: 0,
  };
  const [resource, setResource] = useState([]);
  const [resourceHeader, setResourceHeader] = useState([]);
  const pageIndexRef = useRef(1);
  const onCallBackLoadMoreRef = useRef(null);
  const {navigate} = useNavigation();

  const initSuccess = (items: LearningResourceProps[]) => {
    if (items.length <= MAX_ITEM_PAGINATION + 1) {
      setResource(items);
      return;
    }
    setResourceHeader(items.slice(0, MAX_ITEM_PAGINATION));
    setResource(items.slice(MAX_ITEM_PAGINATION, items.length));
  };

  const loadMoreSuccess = (items: LearningResourceProps[]) => {
    onCallBackLoadMoreRef.current();
    if (items.length === 0) {
      pageIndexRef.current -= 1;
      return;
    }

    setResource(state => state.concat(items));
  };

  const {startApi} = InitApi(initSuccess);

  const {startApi: startApiLoadMore} = InitApi(loadMoreSuccess);

  useEffect(() => {
    getSearchSuggest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSearchSuggest = () => {
    callApi({categoryId, startApi, pageSize: PAGE_SIZE});
  };

  const onLoadMore = cb => {
    onCallBackLoadMoreRef.current = cb;
    pageIndexRef.current += 1;

    callApi({
      categoryId,
      startApi: startApiLoadMore,
      pageSize: PAGE_SIZE,
      page: pageIndexRef.current,
    });
  };

  const listFooterComponent = useCallback(() => {
    return (
      <View style={styles.wrapFooter}>
        <LearningResourceListViewFlatList
          onLoadMore={onLoadMore}
          listResource={resource}
          title={title}
        />
      </View>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  const listHeaderComponent = useCallback(() => {
    return (
      <LearningResourceKnowledgeList listResource={resourceHeader} shouldShowLoading={false} />
    );
  }, [resourceHeader]);

  const onPressSearch = () => {
    navigate(ScreenIds.LearningResourceSearchScreen, {categoryId});
  };

  return (
    <PageScreen title={title} rightComponent={null} showHeaderShadow={true}>
      <>
        <SearchBox
          onSearch={onPressSearch}
          visibleRight={false}
          style={styles.searchBox}
          searchPlaceHolder={translate('learningResources.search')}
        />
        <FlatList
          data={[]}
          ListHeaderComponent={listHeaderComponent}
          ListFooterComponent={listFooterComponent}
          renderItem={null}
          style={styles.flatList}
        />
      </>
    </PageScreen>
  );
};

const styles = StyleSheet.create({
  wrapFooter: {
    marginTop: SIZES.MARGIN_32,
  },
  flatList: {
    marginLeft: SIZES.MARGIN_16,
  },
});
