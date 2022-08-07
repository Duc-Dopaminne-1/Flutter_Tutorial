import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Modalize} from 'react-native-modalize';

import {AppContext} from '../../appData/appContext/useAppContext';
import {POST_TYPE, SEARCH_TYPE_INDEX} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {HELPERS} from '../../assets/theme/helpers';
import SafeAreaScreenContainer from '../../components/SafeAreaScreenContainer';
import SearchDataUtils from '../../utils/SearchDataUtils';
import {useMount} from '../commonHooks';
import ScreenIds from '../ScreenIds';
import {Category, TrackingActions} from '../WithSegment';
import {ResultSearch} from './components/ResultSearch';
import SearchHeader from './components/SearchHeader';
import SearchAgentComponent from './SearchAgentComponent';
import SearchFilterAgentScreen, {useSearchFilterAgent} from './SearchFilterAgentScreen';
import SearchFilterScreen from './SearchFilterScreen';
import {SearchMapScreenParams} from './SearchMap/SearchMapScreenParams';
import SearchProjectsComponent from './SearchProjectsComponent';
import SearchPropertyPostsComponent from './SearchPropertyPostsComponent';

export const styles = StyleSheet.create({
  header: {
    /* Fix header is placed behind property list on android */
    zIndex: 1,
  },
});
const initialState = (params, masterData, stateAgent, itemsDataAgent) => {
  const tabIndex = params?.tabIndex ?? SEARCH_TYPE_INDEX.B2C;
  const searchCriteria = () => {
    if (tabIndex === SEARCH_TYPE_INDEX.AGENT) {
      return SearchDataUtils.initialCriteriaStateAgent(params, stateAgent, itemsDataAgent);
    }
    return SearchDataUtils.initialCriteriaState({...params, tabIndex}, masterData);
  };
  return {
    index: tabIndex,
    b2cPostsCount: 0,
    c2cPostsCount: 0,
    c2cPosts: [],
    isRequestPropertyPost: false,
    isRequestProjects: false,
    searchCriteria: searchCriteria(),
  };
};

const SearchScreen = ({navigation, route}) => {
  const {track} = useAnalytics();
  const context = useContext(AppContext);
  const {getMasterData} = context;
  const modalizeRef = useRef(null);
  const masterData = getMasterData();
  const searchFilterAgentHook = useSearchFilterAgent(masterData);
  const [state, setState] = useState(
    initialState(
      route?.params,
      masterData,
      searchFilterAgentHook.state,
      searchFilterAgentHook.itemsData,
    ),
  );

  const hasAppliedFilterOnce = useRef(false);

  useEffect(() => {
    const searchCriteria = route.params?.searchCriteria;
    const index = route.params?.index;
    if (searchCriteria) {
      setState({
        ...state,
        searchCriteria: {...state.searchCriteria, ...searchCriteria},
        index: index ?? state.index,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params]);

  useMount(() => {
    if (state.index === SEARCH_TYPE_INDEX.AGENT) {
      searchFilterAgentHook.getAllAgentGroups();
    }
  });

  const onChangeKeyword = text => {
    setState({...state, searchCriteria: {...state.searchCriteria, keyword: text}});
    if (state.index === SEARCH_TYPE_INDEX.C2C) {
      track(TrackingActions.productsSearched, {
        category: Category.buy,
        keyword: text,
      });
    }
    if (state.index === SEARCH_TYPE_INDEX.B2C) {
      track(TrackingActions.productsSearched, {
        category: Category.project,
        keyword: text,
      });
    }
  };

  const onDismissFilter = () => {
    modalizeRef.current?.close();
    // setShowFilter(false);
  };

  const onBackPress = () => {
    navigation.canGoBack() && navigation.goBack();
  };

  const onFilterPress = () => {
    modalizeRef.current?.open();
    // setShowFilter(true);
  };

  const onPressMap = () => {
    const type = () => {
      switch (state.index) {
        case SEARCH_TYPE_INDEX.RENTAL:
          return POST_TYPE.RENTAL;
        case SEARCH_TYPE_INDEX.C2C:
          return POST_TYPE.C2C;
        case SEARCH_TYPE_INDEX.B2C:
          return POST_TYPE.B2C;
        case SEARCH_TYPE_INDEX.AGENT:
          return POST_TYPE.AGENT;
        default:
          return null;
      }
    };
    const params: SearchMapScreenParams = {
      type: type(),
      searchCriteria: state.searchCriteria,
      items: state.items,
    };
    navigation.navigate(ScreenIds.SearchMap, params);
  };

  const onPressConfirm = criteria => {
    modalizeRef?.current?.close();

    if (!hasAppliedFilterOnce.current) {
      hasAppliedFilterOnce.current = true;
    }

    setState({
      ...state,
      searchCriteria: {...state.searchCriteria, ...criteria},
    });
  };

  const onSelectOrderBy = (_, items) => {
    if (!items || items?.length === 0) {
      return;
    }

    if (state.index === SEARCH_TYPE_INDEX.C2C || state.index === SEARCH_TYPE_INDEX.RENTAL) {
      setState({
        ...state,
        searchCriteria: {...state.searchCriteria, propertyPostOrderBy: items[0].id},
      });
    } else {
      setState({...state, searchCriteria: {...state.searchCriteria, projectOrderBy: items[0].id}});
    }
  };

  const mapResultSearch = () => {
    const getFilterKeyword = () => {
      if (state.index === SEARCH_TYPE_INDEX.AGENT) {
        return null;
      }
      const getType = () => {
        const propertyTypes: [] = state.searchCriteria.itemsData.propertyTypes;
        const propertyTypeJson: [] = state.searchCriteria?.propertyTypeJson ?? [];
        const items = propertyTypeJson.map(({id}) => {
          return {...propertyTypes.find(value => value.id === id)};
        });
        const propertyTypeString = items
          .map(value => {
            const description = value?.description ?? '';
            return description.toLocaleLowerCase();
          })
          .join(' - ');
        if (propertyTypeString && hasAppliedFilterOnce.current) {
          return ` ${propertyTypeString}`;
        }
        return '';
      };
      const getKeyword = () => {
        const keyword = state.searchCriteria.keyword;
        if (keyword) {
          return ` tại ${keyword}`;
        }
        return '';
      };
      const search = () => {
        if (state.index === SEARCH_TYPE_INDEX.AGENT) {
          return 'Đối tác';
        }
        return state.index === SEARCH_TYPE_INDEX.B2C ? 'Dự án' : 'Nhà lẻ';
      };
      return `${search()}${getType()}${getKeyword()}`;
    };

    const orderBys = () => {
      if (state.index === SEARCH_TYPE_INDEX.AGENT) {
        return [];
      }
      return state.index === SEARCH_TYPE_INDEX.C2C || state.index === SEARCH_TYPE_INDEX.RENTAL
        ? state.searchCriteria.itemsData.propertyOrderBys
        : state.searchCriteria.itemsData.projectOrderBys;
    };

    const resultValue =
      state.index === SEARCH_TYPE_INDEX.B2C ? state.b2cPostsCount : state.c2cPostsCount;

    const isShowSort = state.index !== SEARCH_TYPE_INDEX.AGENT;

    return {
      orderBys,
      getFilterKeyword,
      resultValue,
      isShowSort,
    };
  };

  return (
    <SafeAreaScreenContainer style={styles.safeArea}>
      <View style={styles.header}>
        <SearchHeader
          onBackPress={onBackPress}
          onFilterPress={onFilterPress}
          onMapPress={onPressMap}
          onChangeKeyword={onChangeKeyword}
          value={state.searchCriteria.keyword ?? ''}
          placeholder={translate(STRINGS.SEARCH_PROPERTY_PLACEHOLDER)}
        />
        <ResultSearch
          orderBys={mapResultSearch().orderBys()}
          onSelectOrderBy={onSelectOrderBy}
          filterKeyword={mapResultSearch().getFilterKeyword()}
          resultValue={mapResultSearch().resultValue}
          isShowSort={mapResultSearch().isShowSort}
        />
      </View>

      <View style={HELPERS.fill}>
        {state.index === SEARCH_TYPE_INDEX.B2C && (
          <SearchProjectsComponent
            isNewRouter={route?.params?.isNewRouter}
            state={state}
            setState={setState}
            masterData={masterData}
          />
        )}
        {(state.index === SEARCH_TYPE_INDEX.C2C || state.index === SEARCH_TYPE_INDEX.RENTAL) && (
          <SearchPropertyPostsComponent state={state} setState={setState} />
        )}
        {state.index === SEARCH_TYPE_INDEX.AGENT && (
          <SearchAgentComponent
            state={state}
            setState={setState}
            searchCriteria={state.searchCriteria}
          />
        )}
      </View>

      <Modalize
        threshold={300}
        velocity={1000}
        modalTopOffset={20}
        modalStyle={{backgroundColor: COLORS.BACKGROUND}}
        adjustToContentHeight={true}
        ref={modalizeRef}>
        {state.index === SEARCH_TYPE_INDEX.AGENT ? (
          <SearchFilterAgentScreen
            onPressDismiss={onDismissFilter}
            onPressConfirm={onPressConfirm}
            searchFilterAgentHook={searchFilterAgentHook}
          />
        ) : (
          <SearchFilterScreen
            onPressDismiss={onDismissFilter}
            onPressConfirm={onPressConfirm}
            searchCriteria={state.searchCriteria}
            searchType={state.index}
          />
        )}
      </Modalize>
    </SafeAreaScreenContainer>
  );
};

export default SearchScreen;
