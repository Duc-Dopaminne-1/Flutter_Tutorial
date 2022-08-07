/* eslint-disable react-hooks/exhaustive-deps */
import {useAnalytics} from '@segment/analytics-react-native';
import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

import {
  useCreateSearchTermMutation,
  useGetSearchTermsLazyQuery,
  useSearchSuggestLazyQuery,
} from '../../api/graphql/generated/graphql';
import {FETCH_POLICY, SUGGEST_TYPE} from '../../assets/constants';
import {COLORS} from '../../assets/theme/colors';
import SafeAreaScreenContainer from '../../components/SafeAreaScreenContainer';
import SearchDataUtils from '../../utils/SearchDataUtils';
import SearchSuggestUtils from '../../utils/SearchSuggestUtils';
import {useLogin} from '../Auth/useLogin';
import ScreenIds from '../ScreenIds';
import {Category, TrackingActions} from '../WithSegment';
import SearchHeader from './components/SearchHeader';
import SearchSuggestComponent from './SearchSuggestComponent';

const QUERY_OPTIONS = {
  ...FETCH_POLICY.CACHE_AND_NETWORK,
  notifyOnNetworkStatusChange: true,
};
const START_PAGE = 1;

const SearchSuggestScreen = ({navigation}) => {
  const {notLoggedIn} = useLogin();
  const {track} = useAnalytics();
  const [dataSearch, setDataSearch] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [searchSuggeest, {data: dataSuggest, loading}] = useSearchSuggestLazyQuery(QUERY_OPTIONS);
  const [getHistoryKeyword, {data: historyKeywords}] = useGetSearchTermsLazyQuery(QUERY_OPTIONS);
  const [addKeyword] = useCreateSearchTermMutation();
  const [isSearching, setSearching] = useState(false);

  useEffect(() => {
    getHistoryKeyword({
      variables: {
        page: START_PAGE,
        pageSize: 10,
        order_by: {keyWord: 'DESC'},
      },
    });
  }, []);

  const onPressItemSuggest = item => {
    switch (item.type) {
      case SUGGEST_TYPE.agency:
        navigation.navigate(ScreenIds.AgentManagement, {
          agentId: item?.id ?? '',
        });
        break;
      case SUGGEST_TYPE.project:
        navigation.navigate(ScreenIds.ProjectDetail, {
          projectId: item?.id ?? '',
        });
        break;
      case SUGGEST_TYPE.property:
        navigation.navigate(ScreenIds.ViewPropertyPost, {
          propertyPostId: item?.id ?? '',
          viewByOtherMode: true,
        });
        break;
      default:
        break;
    }
  };

  const getSearchSuggest = text => {
    searchSuggeest({
      variables: {
        project: SearchDataUtils.mappingSearchSuggest({keyword: text}),
        agent: SearchDataUtils.mappingSearchSuggest({keyword: text, order: 'RANKINGDESC'}),
        property: SearchDataUtils.mappingSearchSuggest({keyword: text}),
      },
    });
    setSearching(false);
  };

  useEffect(() => {
    if (loading === false && dataSuggest) {
      setDataSearch(dataSuggest);
    }
  }, [loading]);

  const addTermKeyword = text => {
    !notLoggedIn &&
      addKeyword({
        variables: {
          input: {keyWord: text},
        },
      });
  };

  const onSubmitSearch = text => {
    if (text.trim().length === 0) {
      return;
    } else {
      track(TrackingActions.productsSearched, {
        keyword: text,
        category: Category.home,
      });
      getSearchSuggest(text);
      setSearching(true);
      addTermKeyword(text);
    }
  };

  useEffect(() => {
    if (keyword.length === 0) {
      setDataSearch([]);
    } else {
      onSubmitSearch(keyword);
    }
  }, [keyword]);

  const onChangeKeyword = text => {
    setKeyword(text);
  };

  const onBackPress = () => {
    navigation.canGoBack() && navigation.goBack();
  };

  const onClearText = () => {
    setSearching(false);
    onChangeKeyword('');
  };

  const onSetKeyword = text => {
    Keyboard.dismiss();
    onChangeKeyword(text);
  };

  return (
    <SafeAreaScreenContainer>
      <SearchHeader
        onClearPress={onClearText}
        onBackPress={onBackPress}
        onChangeKeyword={onChangeKeyword}
        value={keyword}
        autoFocus
        delayTimeout={1000}
        iconSize={15}
        customTextStyle={{color: COLORS.TEXT_DARK_10}}
        showRightIcon={keyword.trim().length > 0}
        isClearText={true}
      />
      <SearchSuggestComponent
        data={SearchSuggestUtils.mapDataSuggestionSearch(
          dataSearch?.searchProjects?.projectInfoDtos,
          dataSearch?.searchPropertyPosts?.propertyPostInfoDtos,
          dataSearch?.searchAgents?.agentInfoDtos,
        )}
        onPressItemSuggest={onPressItemSuggest}
        isSearching={isSearching}
        pressItemHistory={onSetKeyword}
        historyKeyword={historyKeywords?.getSearchTerms?.edges}
        isLoading={loading}
        keyword={keyword}
      />
    </SafeAreaScreenContainer>
  );
};

export default SearchSuggestScreen;
