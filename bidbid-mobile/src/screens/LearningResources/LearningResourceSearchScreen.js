import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {SIZES} from '../../assets/constants/sizes';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {commonStyles} from '../../assets/theme/styles';
import PageScreen from '../../components/PageScreen';
import SearchHeader from '../Search/components/SearchHeader';
import {LearningResourceProps} from './components/LearningResourceKnowledgeItem';
import LearningResourceListViewFlatList from './components/LearningResourceListViewFlatList';
import {callApi, InitApiSearch} from './utils/LearningResourcesUtils';

const PAGE_SIZE = 10;

type ResourceSearchProps = {
  totalCount: number,
  articleDtos: LearningResourceProps[],
};

export const LearningResourceSearchScreen = () => {
  const route = useRoute();
  const {categoryId, isSearchAll} = route?.params || {
    categoryId: 0,
    isSearchAll: false,
  };
  const [dataSearch, setDataSearch] = useState([]);
  const [totalResource, setTotalResource] = useState(0);
  const [keyword, setKeyword] = useState('');
  const pageIndexRef = useRef(1);
  const onCallBackLoadMoreRef = useRef(null);
  const {goBack, canGoBack} = useNavigation();

  const getDataSuccess = (items: ResourceSearchProps) => {
    setTotalResource(items.totalCount);
    setDataSearch(items.articleDtos);
  };

  const loadMoreSuccess = (items: ResourceSearchProps) => {
    onCallBackLoadMoreRef.current();
    if (items.articleDtos.length === 0) {
      pageIndexRef.current -= 1;
      return;
    }

    setDataSearch(state => state.concat(items.articleDtos));
  };

  const {startApi} = InitApiSearch(getDataSuccess);

  const {startApi: startApiLoadMore} = InitApiSearch(loadMoreSuccess);

  useEffect(() => {
    getSearchSuggest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSearchSuggest = (text = '') => {
    callApi({categoryId, startApi, pageSize: PAGE_SIZE, keyword: text, isSearchAll});
  };

  const onLoadMore = cb => {
    onCallBackLoadMoreRef.current = cb;
    pageIndexRef.current += 1;

    callApi({
      categoryId,
      startApi: startApiLoadMore,
      pageSize: PAGE_SIZE,
      keyword,
      page: pageIndexRef.current,
      isSearchAll,
    });
  };

  const onSubmitSearch = text => {
    if (text.trim().length !== 0) {
      getSearchSuggest(text);
    }
  };

  const onChangeKeyword = text => {
    setKeyword(text);
    pageIndexRef.current = 1;
    if (text.length === 0) {
      getSearchSuggest();
    } else {
      onSubmitSearch(text);
    }
  };

  const onClearText = () => {
    onChangeKeyword('');
  };

  const listFooterComponent = useCallback(() => {
    return (
      <View style={styles.wrapFooter}>
        <LearningResourceListViewFlatList onLoadMore={onLoadMore} listResource={dataSearch} />
      </View>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSearch]);

  const onBackPress = () => {
    canGoBack() && goBack();
  };

  return (
    <PageScreen showHeader={false} rightComponent={null} showHeaderShadow={false}>
      <>
        <SearchHeader
          onBackPress={onBackPress}
          onClearPress={onClearText}
          onChangeKeyword={onChangeKeyword}
          placeholder={translate('learningResources.search')}
          value={keyword}
          delayTimeout={1000}
          iconSize={15}
          customTextStyle={styles.textInput}
          showRightIcon={keyword.trim().length > 0}
          isClearText={true}
          customStyle={styles.input}
        />
        <>
          <LinearGradient
            colors={[COLORS.BLACK_OPACITY_01, COLORS.TRANSPARENT_OPACITY]}
            style={[commonStyles.separatorRow12, {backgroundColor: COLORS.TRANSPARENT}]}
          />
          <Text style={styles.textResult}>
            {translate('learningResources.resultCountPrefix')}{' '}
            <Text style={[styles.textResult, styles.textTotalResult]}>{totalResource}</Text>{' '}
            {translate('learningResources.resultCountSuffix')}
          </Text>
          <FlatList
            data={[]}
            ListFooterComponent={listFooterComponent}
            renderItem={null}
            style={styles.flatList}
          />
        </>
      </>
    </PageScreen>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_BORDER,
    marginLeft: SIZES.MARGIN_16,
    marginTop: SIZES.MARGIN_10,
  },
  textInput: {
    color: COLORS.TEXT_DARK_10,
  },
  wrapFooter: {
    marginTop: SIZES.MARGIN_32,
  },
  flatList: {
    marginLeft: SIZES.MARGIN_16,
  },
  textResult: {
    paddingLeft: SIZES.PADDING_16,
    ...FONTS.fontSize16,
    ...FONTS.nunitoRegular,
    color: COLORS.TEXT_DARK_10,
  },
  textTotalResult: {
    ...FONTS.bold,
  },
});
