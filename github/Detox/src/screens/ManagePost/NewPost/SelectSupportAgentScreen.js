import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useRef, useState} from 'react';
import {Keyboard, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {TabView} from 'react-native-tab-view';

import {
  useGetConsultantsForC2CTransactionCursorLazyQuery,
  useGetConsultantsSuggestionC2CLazyQuery,
  useGetSupportedConsultantsC2CLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {
  BUY_REQUEST_TYPE,
  CONSTANTS,
  EMPTY_TYPE,
  HEADER_CONTAINER_TAB1_HEIGHT,
  HEADER_CONTAINER_TAB2_HEIGHT,
  NAVIGATION_ANIMATION_DURATION,
  NEW_POST_MODAL_STATE,
  NEW_POST_STEP,
} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {medium, METRICS, normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import CustomCheckbox from '../../../components/Checkbox/CustomCheckbox';
import Header from '../../../components/Header';
import LazyList, {PAGING_TYPE} from '../../../components/LazyList';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import {mapSellConsultantInfoToData} from '../../../utils/DataProcessUtil';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import SellAgentItem, {
  getFullSizeSellAgentItem,
} from '../../BookingDeposit/SellAgentList/components/SellAgentItem';
import {ModalFilterConsultant} from '../../BookingDeposit/SellAgentList/ModalFilterConsultant';
import {StringeeContext} from '../../Call/StringeeContext';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import SearchHeader from '../../Search/components/SearchHeader';
import {Category, ClickLocation, TrackingActions} from '../../WithSegment';
import useGetStaffByPostId from '../hooks/useGetStaffByPostId';
import {NewPostContext} from '../useNewPost';
import FooterButtons from './NewPostComponents/FooterButtons';
import {NewPostStyles} from './NewPostComponents/NewPostConstant';
import NewPostModalContainer from './NewPostComponents/NewPostModalContainer';
import TimeLineProcessComponent from './NewPostComponents/TimeLineProcessComponent';

const styles = StyleSheet.create({
  tabBarContainer: {
    ...HELPERS.row,
    width: '100%',
    paddingHorizontal: normal,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  tabBarButton: focused => {
    return {
      ...HELPERS.center,
      flex: 1,
      paddingVertical: 12,
      ...(focused && {borderBottomWidth: 2, borderColor: COLORS.PRIMARY_B100}),
    };
  },
  randomAgentCheckBox: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginTop: 1,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  footerBorder: {
    borderTopWidth: 1,
    borderColor: COLORS.GREY_F0,
  },
  footer: {
    flex: 0,
    width: '100%',
  },
  footerCancelBtn: {
    backgroundColor: COLORS.GREY_F0,
    borderWidth: 0,
  },
  buttonNextbgActive: {
    backgroundColor: COLORS.PRIMARY_A100,
  },
  buttonNextbgInactive: {
    backgroundColor: COLORS.PRIMARY_A20,
  },
  nextTitleColorActive: {
    color: COLORS.NEUTRAL_WHITE,
  },
  nextTitleColorInactive: {
    color: COLORS.PRIMARY_A40,
  },
  modalSearchContainer: {
    height: SCREEN_SIZE.HEIGHT * 0.9,
  },
  editHeaderContainer: {
    height: CONSTANTS.HEADER_CONTAINER_HEIGHT + CONSTANTS.HEADER_TIMELINE_HEIGHT,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    zIndex: 1,
  },
  headerShadowContainer: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
  },
  tabHeaderTitle: focused => {
    if (focused) {
      return {color: COLORS.PRIMARY_A100, ...FONTS.bold, fontSize: SIZES.FONT_16};
    }
    return {color: COLORS.BLACK_31, ...FONTS.regular, fontSize: SIZES.FONT_16};
  },
  customEmptyListContainer: tabIndex => ({
    marginTop: tabIndex === 0 ? HEADER_CONTAINER_TAB1_HEIGHT : HEADER_CONTAINER_TAB2_HEIGHT,
  }),
});

const TAB_INDEX = {
  recentAgent: 0,
  allAgent: 1,
};

const TAB_BAR_HEIGHT = 100;
const HEADER_DIFF_1 = HEADER_CONTAINER_TAB1_HEIGHT - TAB_BAR_HEIGHT;
const HEADER_DIFF_2 = HEADER_CONTAINER_TAB2_HEIGHT - TAB_BAR_HEIGHT;

const getEmptyListType = tabIndex => {
  if (tabIndex === TAB_INDEX.recentAgent) {
    return EMPTY_TYPE.RECENT_AGENT;
  }
  return EMPTY_TYPE.SUGGESTED_AGENT;
};

const renderItem = (item, onPress, selectedItem) => {
  const isSelected = selectedItem ? item.userId === selectedItem.userId : false;
  return <SellAgentItem item={item} onPress={onPress} isSelected={isSelected} />;
};

const AnimatedHeader = ({
  onBackPress,
  animatedValue,
  navigationState,
  onChangeTab,
  keyword,
  onCheckAutoSuggest,
  autoSuggestion,
  firstSuggestedAgent,
  onPressSearchBar,
  onFilterPress,
  onPressNext,
  onPressCancel,
  step4Valid,
}) => {
  const routes = navigationState?.routes;
  const tabIndexOnShow = navigationState?.index;
  const HeaderContainerHeight =
    tabIndexOnShow === TAB_INDEX.recentAgent
      ? HEADER_CONTAINER_TAB1_HEIGHT
      : HEADER_CONTAINER_TAB2_HEIGHT;

  const tabBarAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: COLORS.NEUTRAL_WHITE,
    transform: [
      {
        translateY: interpolate(
          animatedValue?.value,
          [0, TAB_BAR_HEIGHT * 1.5],
          [0, -CONSTANTS.HEADER_HEIGHT],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  const headerContainerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    height: interpolate(
      animatedValue?.value,
      [0, TAB_BAR_HEIGHT],
      [HeaderContainerHeight, TAB_BAR_HEIGHT],
      Extrapolate.CLAMP,
    ),
  }));

  return (
    <Animated.View style={headerContainerStyle}>
      <Animated.View style={tabBarAnimatedStyle}>
        <Header
          containerStyle={{...METRICS.smallVerticalPadding, ...METRICS.horizontalPadding}}
          leftText={translate('newPost.step3.headerTitle')}
          isBackable
          onBackPress={onBackPress}
          enabledAnimation
          childAnimation={animatedValue}
          rightComponent={
            <CustomButton
              title={translate(STRINGS.DISCARD)}
              titleColor={COLORS.PRIMARY_A100}
              titleStyle={[FONTS.fontSize16, FONTS.bold]}
              onPress={onPressCancel}
            />
          }
        />
        <TimeLineProcessComponent
          data={{
            stepProcess: NEW_POST_STEP.STEP3,
            step1Valid: true,
            step2Valid: true,
            step4Valid: step4Valid,
          }}
          onPressStep1={() => onPressNext(NEW_POST_STEP.STEP1)}
          onPressStep2={() => onPressNext(NEW_POST_STEP.STEP2)}
          onPressStep4={() => onPressNext(NEW_POST_STEP.STEP4)}
          style={[HELPERS.fill, METRICS.smallMarginBottom, METRICS.horizontalPadding]}
        />
        <LinearGradient
          colors={[COLORS.BLACK_OPACITY_01, COLORS.TRANSPARENT_OPACITY]}
          style={[commonStyles.separatorRow12, {backgroundColor: COLORS.TRANSPARENT}]}
        />
        <SearchHeader
          style={NewPostStyles.viewWithIndex}
          placeholder={translate('common.searchAgentPlaceholder')}
          renderLeft={false}
          value={keyword}
          customStyle={commonStyles.inputSearch}
          onFilterPress={onFilterPress}
          onFocusSearchBox={onPressSearchBar}
        />
        <View style={styles.tabBarContainer}>
          <TouchableOpacity
            style={styles.tabBarButton(TAB_INDEX.recentAgent === tabIndexOnShow)}
            onPress={() => onChangeTab(TAB_INDEX.recentAgent)}>
            <Text style={styles.tabHeaderTitle(TAB_INDEX.recentAgent === tabIndexOnShow)}>
              {routes[TAB_INDEX.recentAgent]?.title}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabBarButton(TAB_INDEX.allAgent === tabIndexOnShow)}
            onPress={() => onChangeTab(TAB_INDEX.allAgent)}>
            <Text style={styles.tabHeaderTitle(TAB_INDEX.allAgent === tabIndexOnShow)}>
              {routes[TAB_INDEX.allAgent]?.title}
            </Text>
          </TouchableOpacity>
        </View>
        {tabIndexOnShow === TAB_INDEX.allAgent && (
          <View style={styles.randomAgentCheckBox}>
            <CustomCheckbox
              isIconLeft={false}
              title={translate('common.systemAutomaticSuggestion')}
              images={['check-box', 'check-box-outline-blank']}
              iconCheckedColor={COLORS.PRIMARY_A100}
              customCheckedBox
              shouldGetValueOutSide
              parentCheckedValue={autoSuggestion}
              onChange={onCheckAutoSuggest}
              disabled={!firstSuggestedAgent}
            />
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const SearchingView = ({
  keywords,
  places,
  staffGroupIds,
  onFilterPress,
  onChangeKeyword,
  chosenAgent,
  onPressItem,
}) => {
  const queryParams = {
    query: useGetConsultantsForC2CTransactionCursorLazyQuery,
    responseDataKey: 'getConsultantsForC2CTransactionCursor',
    options: {
      first: 8,
      after: '',
      input: {
        keywords: keywords || null,
        places: JSON.stringify(places),
        staffGroupIds: JSON.stringify(staffGroupIds),
      },
    },
  };

  if (!keywords) {
    delete queryParams.options.input.keywords;
  }
  if (!places || places?.length === 0) {
    delete queryParams.options.input.places;
  }
  if (!staffGroupIds || staffGroupIds?.length === 0) {
    delete queryParams.options.input.staffGroupIds;
  }

  const searchCriteriaHasValue = !!keywords || places?.length > 0 || staffGroupIds?.length > 0;

  const replaceDataWhenRefresh = items => {
    // if search criteria is empty, return nothing
    const searchParams = queryParams.options.input;
    if (keywords || searchParams.places || searchParams.staffGroupIds) {
      return items;
    }
    return [];
  };
  return (
    <>
      <View style={commonStyles.separatorRow16} />
      <SearchHeader
        placeholder={translate('common.searchAgentPlaceholder')}
        renderLeft={false}
        value={keywords}
        autoFocus
        onChangeKeyword={onChangeKeyword}
        onFilterPress={onFilterPress}
        customStyle={commonStyles.inputSearch}
      />
      <View
        style={HELPERS.fill}
        onTouchEnd={
          searchCriteriaHasValue
            ? () => {
                Keyboard.dismiss();
              }
            : null
        }>
        <LazyList
          emptyType={EMPTY_TYPE.SUGGESTED_AGENT}
          scrollEnabled={searchCriteriaHasValue}
          replaceDataWhenRefresh={replaceDataWhenRefresh}
          renderItem={({item}) => renderItem(item, onPressItem, chosenAgent)}
          itemHeight={item => getFullSizeSellAgentItem(item)}
          useQuery={queryParams.query}
          queryOptions={{variables: queryParams.options}}
          responseDataKey={queryParams.responseDataKey}
          pagingType={PAGING_TYPE.CURSOR2}
          mapToUiModel={item => mapSellConsultantInfoToData(item.node)}
          uniqueKey={'userId'}
          extractTotalCount={response => {
            const totalCount = response?.[queryParams.responseDataKey]?.totalCount ?? 0;
            return totalCount;
          }}
          contentStyle={[METRICS.resetMargin, METRICS.resetPadding, HELPERS.fillGrow]}
          extractArray={response => {
            const array: [] = response?.[queryParams.responseDataKey]?.edges ?? [];
            return array;
          }}
        />
      </View>
    </>
  );
};

const EditStep3View = props => {
  const {chosenAgent, step4Valid, onPressCancel, onPressNext, navigation} = props;

  const onBackPress = () => {
    setTimeout(() => {
      navigation.navigate(ScreenIds.NewPostImages, {reload: true});
    }, NAVIGATION_ANIMATION_DURATION * 0.2);
  };

  return (
    <>
      <View style={styles.editHeaderContainer}>
        <Header
          containerStyle={{...METRICS.smallVerticalPadding, ...METRICS.horizontalPadding}}
          leftText={translate('newPost.step3.headerTitle')}
          isBackable
          onBackPress={onBackPress}
          rightComponent={
            <CustomButton
              title={translate(STRINGS.DISCARD)}
              titleColor={COLORS.PRIMARY_A100}
              titleStyle={[FONTS.fontSize16, FONTS.bold]}
              onPress={onPressCancel}
            />
          }
        />
        <TimeLineProcessComponent
          data={{
            stepProcess: NEW_POST_STEP.STEP3,
            step1Valid: true,
            step2Valid: true,
            step3Valid: false,
            step4Valid: step4Valid,
          }}
          onPressStep1={() => onPressNext(NEW_POST_STEP.STEP1)}
          onPressStep2={() => onPressNext(NEW_POST_STEP.STEP2)}
          onPressStep4={() => onPressNext(NEW_POST_STEP.STEP4)}
          style={[HELPERS.fill, METRICS.smallMarginBottom, METRICS.horizontalPadding]}
        />
        <View style={styles.headerShadowContainer}>
          <LinearGradient
            colors={[COLORS.BLACK_OPACITY_01, COLORS.TRANSPARENT_OPACITY]}
            style={[commonStyles.separatorRow12, {backgroundColor: COLORS.TRANSPARENT}]}
          />
        </View>
      </View>

      {chosenAgent && <SellAgentItem item={chosenAgent} disabled isSelected />}
    </>
  );
};

const initialTabState = {
  index: TAB_INDEX.recentAgent,
  routes: [
    {key: BUY_REQUEST_TYPE.SENT, title: translate('newPost.step3.tabBarTitle1')},
    {key: BUY_REQUEST_TYPE.RECEIVED, title: translate('newPost.step3.tabBarTitle2')},
  ],
};

const SelectSupportAgentScreen = ({navigation}) => {
  const {track} = useAnalytics();
  const {setInputFieldState, isEdit, state: newPostState} = useContext(NewPostContext);
  const {forSale, forRent, price, rentPrice, propertyTypeId, propertyAddress} =
    newPostState.step1Data ?? {};
  const [searchState, setSearchState] = useState({
    keyword: '',
    searchCriteria: {},
  });
  const [shouldRefreshSuggestionList, setShouldRefreshSuggestionList] = useState(0);
  const [tabState, setTabState] = useState({...initialTabState});
  const [chosenAgent, setChosenAgent] = useState(
    newPostState?.step3Data.agentAutoSuggestion && !isEdit
      ? null
      : newPostState?.step3Data?.chosenAgent,
  );
  const [autoSuggestion, setAutoSuggestion] = useState(
    newPostState?.step3Data?.agentAutoSuggestion,
  );

  const {callHotline} = useContext(StringeeContext);

  // Suggested agent for random selection
  const firstSuggestedAgent = useRef();

  // Modals' refs
  const modalFilter = useRef();
  const modalConfirmCancel = useRef();
  const modalSearch = useRef();

  // Lists' refs
  const listRef = useRef(null);
  const list2Ref = useRef(null);

  // Lists' scroll positions
  const userScrollTab1Position = useSharedValue(0);
  const userScrollTab2Position = useSharedValue(0);

  const HeaderContainerHeight =
    tabState.index === TAB_INDEX.recentAgent
      ? HEADER_CONTAINER_TAB1_HEIGHT + medium
      : HEADER_CONTAINER_TAB2_HEIGHT + medium;

  const currentScrollPosition = useDerivedValue(() => {
    if (tabState.index === TAB_INDEX.recentAgent) {
      return userScrollTab1Position.value;
    }
    return userScrollTab2Position.value;
  }, [userScrollTab1Position.value, userScrollTab2Position.value, tabState.index]);

  const {getStaffByPostId} = useGetStaffByPostId({
    onSuccess: staffInfo => {
      setChosenAgent(staffInfo);
    },
    isUpdateContext: false,
  });

  useMount(() => {
    const userHasNotChosenNewAgent = !newPostState.step3Data.chosenAgent?.userId;
    if (isEdit && userHasNotChosenNewAgent) {
      getStaffByPostId(newPostState.originState?.propertyPostId);
    }
  });

  const queryParams = {
    suggestionAgent: {
      query: useGetConsultantsSuggestionC2CLazyQuery,
      responseDataKey: 'consultantsSuggestionC2C',
      options: {
        input: {
          cityId: propertyAddress?.cityId,
          districtId: propertyAddress?.districtId,
          forRent,
          forSale,
          price: forSale ? price : rentPrice,
          propertyTypeId,
        },
      },
      pageSize: 8,
    },
    supportedAgent: {
      query: useGetSupportedConsultantsC2CLazyQuery,
      responseDataKey: 'consultantsSupportedC2C',
      options: {},
      pageSize: 8,
    },
  };

  const getQueryOption = key => {
    switch (key) {
      case initialTabState.routes[0].key:
        return queryParams.supportedAgent;
      case initialTabState.routes[1].key:
        return queryParams.suggestionAgent;
      default:
        return queryParams.searchAgent;
    }
  };

  const onTypeKeyword = text => {
    setSearchState({
      ...searchState,
      keyword: text,
    });
  };

  const onPressItem = item => {
    setChosenAgent(item);
    autoSuggestion && setAutoSuggestion(false);
  };

  const onPressSearchItem = item => {
    setChosenAgent(item);
    autoSuggestion && setAutoSuggestion(false);
    setShouldRefreshSuggestionList(shouldRefreshSuggestionList + 1);
  };

  const onApplyFilter = data => {
    openSearchModal();
    setSearchState({
      ...searchState,
      searchCriteria: data,
    });
  };

  const handleOnIndexChange = index => {
    syncList(initialTabState.routes[index].key);
    setTabState({...tabState, index});
  };

  const onBackPress = () => {
    const suggestedAgent = autoSuggestion ? firstSuggestedAgent : null;
    const agent = chosenAgent ? chosenAgent : suggestedAgent;

    setInputFieldState({
      step3Data: {
        agentAutoSuggestion: autoSuggestion,
        chosenAgent: agent,
        staffUserId: agent?.userId,
      },
      step3Valid: true,
    });

    setTimeout(() => {
      navigation.navigate(ScreenIds.NewPostImages, {reload: true});
    }, NAVIGATION_ANIMATION_DURATION * 0.2);
  };

  const onPressNext = step => {
    const suggestedAgent = autoSuggestion ? firstSuggestedAgent.current : null;
    const agent = chosenAgent ? chosenAgent : suggestedAgent;
    const isNewPost = !isEdit || newPostState.isPrivate;

    if (isNewPost) {
      track(TrackingActions.createPostStep3, {
        consultancy_name: agent?.fullName,
        consultancy_group: agent?.group ?? agent?.agentGroupDescription,
      });

      setInputFieldState({
        step3Data: {
          agentAutoSuggestion: autoSuggestion,
          chosenAgent: agent,
          staffUserId: agent?.userId,
        },
        step3Valid: true,
      });
    }

    switch (step) {
      case NEW_POST_STEP.STEP1:
        navigation.navigate(ScreenIds.GeneralDescription, {reload: true});
        break;
      case NEW_POST_STEP.STEP2:
        navigation.navigate(ScreenIds.NewPostImages, {reload: true});
        break;
      default:
        navigation.navigate(ScreenIds.NewPostContactInfo);
        break;
    }
  };

  const onCheckAutoSuggest = checked => {
    if (checked) {
      setChosenAgent(null);
    }
    setAutoSuggestion(checked);
  };

  const onDismissCancelModal = () => {
    modalConfirmCancel.current?.close();
  };

  const openCancelModal = () => {
    modalConfirmCancel.current?.open();
  };

  const openFilterModal = () => {
    modalFilter.current?.open();
  };

  const openSearchModal = () => {
    modalSearch.current?.open();
  };

  const onPressCall = () => {
    track(TrackingActions.callButtonClicked, {
      click_location: ClickLocation.postPage,
      category: Category.createPostStep2,
    });

    callHotline();
  };

  const onPressMessage = () => {
    track(TrackingActions.messagesButtonClicked, {
      click_location: ClickLocation.postPage,
      category: Category.createPostStep2,
    });

    navigation.navigate(ScreenIds.LiveChatSupport);
  };

  const onScroll = (event, route) => {
    const onRecentAgentTab = route.key === initialTabState.routes[0].key;
    const scrollingY = event.nativeEvent.contentOffset.y;
    if (onRecentAgentTab) {
      userScrollTab1Position.value = scrollingY;
    } else {
      userScrollTab2Position.value = scrollingY;
    }
  };

  const syncList = route => {
    const onRecentAgentTab = route.key === initialTabState.routes[0].key;
    const bothListAreScrolledPassHeader =
      userScrollTab2Position.value > HEADER_CONTAINER_TAB2_HEIGHT &&
      userScrollTab1Position.value > HEADER_CONTAINER_TAB1_HEIGHT;
    if (onRecentAgentTab && !bothListAreScrolledPassHeader) {
      //reset list 2 scroll Y position according to list 1
      const scrollToY = Math.min(userScrollTab1Position.value, HEADER_DIFF_1);
      list2Ref.current?.scrollTo({x: 0, y: scrollToY}, false);
      userScrollTab2Position.value = scrollToY;
    } else if (!bothListAreScrolledPassHeader) {
      //reset list 1 scroll Y position according to list 2
      const scrollToY = Math.min(userScrollTab2Position.value, HEADER_DIFF_2);
      listRef.current?.scrollTo({x: 0, y: scrollToY}, false);
      userScrollTab1Position.value = scrollToY;
    }
  };

  const renderScene = ({route}) => {
    const onRecentAgentTab = route.key === initialTabState.routes[0].key;
    const contentListStyle = {
      ...METRICS.resetMargin,
      ...METRICS.resetPadding,
      marginTop: HeaderContainerHeight,
      marginBottom: 4,
    };
    const queryOption = getQueryOption(route.key);

    //****** move selected agent up to top ******
    const replaceDataWhenRefreshList1 = async items => {
      if (items?.length > 0 && chosenAgent) {
        const chosenAgentOnList1 = items.some(e => e.userId === chosenAgent?.userId);
        if (chosenAgentOnList1) {
          const notChosenAgents = items.filter(e => e.userId !== chosenAgent?.userId);
          const agents = [chosenAgent].concat(notChosenAgents);
          return agents;
        }
      }
      return items;
    };

    const replaceDataWhenRefreshList2 = async items => {
      if (items?.length > 0) {
        firstSuggestedAgent.current = items[0];

        if (chosenAgent) {
          const chosenAgentOnList2 = items.some(e => e.userId === chosenAgent?.userId);

          if (chosenAgentOnList2) {
            const notChosenAgents = items.filter(e => e.userId !== chosenAgent?.userId);
            const agents = [chosenAgent].concat(notChosenAgents);
            return agents;
          }
        }
      }
      return items;
    };

    return (
      <View style={HELPERS.fill}>
        <LazyList
          shouldRefresh={shouldRefreshSuggestionList}
          replaceDataWhenRefresh={
            onRecentAgentTab ? replaceDataWhenRefreshList1 : replaceDataWhenRefreshList2
          }
          emptyType={getEmptyListType(tabState.index)}
          emptyContainerStyle={styles.customEmptyListContainer(tabState.index)}
          onPressSeeAgentList={() => handleOnIndexChange(TAB_INDEX.allAgent)}
          ref={onRecentAgentTab ? listRef : list2Ref}
          renderItem={({item}) => renderItem(item, onPressItem, chosenAgent)}
          itemHeight={item => getFullSizeSellAgentItem(item)}
          useQuery={queryOption.query}
          queryOptions={{variables: queryOption.options, pageSize: queryOption.pageSize}}
          responseDataKey={queryOption.responseDataKey}
          pagingType={PAGING_TYPE.OFFSET_VARIABLES}
          mapToUiModel={item => mapSellConsultantInfoToData(item)}
          uniqueKey={'userId'}
          extractTotalCount={response => {
            const totalCount = response?.[queryOption.responseDataKey]?.totalCount ?? 0;
            return totalCount;
          }}
          contentStyle={contentListStyle}
          extractArray={response => {
            const agents: [] = response?.[queryOption.responseDataKey]?.edges ?? [];
            return agents;
          }}
          scrollEventThrottle={16}
          scrollIndicatorInsets={{top: HeaderContainerHeight}}
          onScroll={e => onScroll(e, route)}
          onScrollEndDrag={() => syncList(route)}
          onMomentumScrollEnd={() => syncList(route)}
        />
      </View>
    );
  };

  const modals = (
    <>
      <ModalWithModalize getModalRef={modalConfirmCancel}>
        <NewPostModalContainer
          state={{modalizeState: NEW_POST_MODAL_STATE.CONFIRM_EDIT}}
          hidePopup={onDismissCancelModal}
          navigation={navigation}
          dismissPopup={onDismissCancelModal}
        />
      </ModalWithModalize>
      <ModalWithModalize getModalRef={modalSearch} scrollViewProps={{scrollEnabled: false}}>
        <View style={styles.modalSearchContainer}>
          <SearchingView
            keywords={searchState.keyword}
            places={searchState.searchCriteria?.places}
            staffGroupIds={searchState.searchCriteria?.staffGroupIds}
            onChangeKeyword={onTypeKeyword}
            onFilterPress={openFilterModal}
            queryParams={queryParams.searchAgent}
            onPressItem={onPressSearchItem}
            chosenAgent={chosenAgent}
          />
        </View>
      </ModalWithModalize>
      <ModalFilterConsultant
        applyFilterConsultant={onApplyFilter}
        hideFilterGroups
        ref={modalFilter}
      />
    </>
  );

  const shouldDisableNextBtn = autoSuggestion ? !autoSuggestion : !chosenAgent;

  return (
    <SafeAreaScreenContainer>
      <View style={HELPERS.fill}>
        <View style={HELPERS.fill}>
          {isEdit && !newPostState?.isPrivate ? (
            <EditStep3View
              chosenAgent={chosenAgent}
              step4Valid={newPostState.step4Valid}
              onPressNext={onPressNext}
              onPressCancel={openCancelModal}
              navigation={navigation}
            />
          ) : (
            <>
              <AnimatedHeader
                onBackPress={onBackPress}
                animatedValue={currentScrollPosition}
                navigationState={tabState}
                modalFilter={modalFilter}
                onChangeTab={handleOnIndexChange}
                setKeyword={onTypeKeyword}
                keyword={searchState.keyword}
                autoSuggestion={autoSuggestion}
                onCheckAutoSuggest={onCheckAutoSuggest}
                firstSuggestedAgent={firstSuggestedAgent.current}
                onPressSearchBar={openSearchModal}
                onFilterPress={openFilterModal}
                step4Valid={newPostState.step4Valid}
                onPressNext={onPressNext}
                onPressCancel={openCancelModal}
              />
              <TabView
                navigationState={tabState}
                renderScene={renderScene}
                renderTabBar={() => {}}
                swipeEnabled={false}
                lazy={false}
              />
            </>
          )}
        </View>
        <View
          style={[
            // On Android shadow attributes will cause the view to appear in front of modals
            Platform.OS === 'ios' ? commonStyles.footerContainer : METRICS.padding,
            styles.footerBorder,
          ]}>
          <FooterButtons
            containerStyle={styles.footer}
            style={shouldDisableNextBtn ? styles.buttonNextbgInactive : styles.buttonNextbgActive}
            nextTextStyle={
              shouldDisableNextBtn ? styles.nextTitleColorInactive : styles.nextTitleColorActive
            }
            nextButtonTitle={translate(STRINGS.NEXT)}
            onPressNext={onPressNext}
            disabledNext={shouldDisableNextBtn}
            onPressCancel={openCancelModal}
            cancelButtonTitle={translate(STRINGS.CANCEL)}
            cancelTextStyle={{color: COLORS.TEXT_DARK_10}}
            cancelButtonStyle={styles.footerCancelBtn}
            showContactButtons
            hiddenCancelButton
            onPressCall={onPressCall}
            onPressMessage={onPressMessage}
          />
        </View>
      </View>
      {modals}
    </SafeAreaScreenContainer>
  );
};

export default SelectSupportAgentScreen;
