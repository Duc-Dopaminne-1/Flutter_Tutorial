/* eslint-disable no-unused-vars */
import {useNavigation} from '@react-navigation/native';
import {useAnalytics} from '@segment/analytics-react-native';
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {useSelector} from 'react-redux';

import {
  useGetFoC2CPropertyPostsHomePageV1LazyQuery,
  useGetFoProjectsHomePageV1LazyQuery,
} from '../../api/graphql/generated/graphql';
import {refreshTokenAction} from '../../api/userApi';
import {AppContext} from '../../appData/appContext/appContext';
import {getRefreshToken} from '../../appData/authState/selectors';
import {LastModifiedContext} from '../../appData/lastModifiedContext/useLastModifiedContext';
import {isAgent} from '../../appData/user/selectors';
import {categoriesNewsHomepage, FETCH_POLICY} from '../../assets/constants';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {METRICS} from '../../assets/theme/metric';
import {updateSingleItem} from '../../components/LazyList';
import {IntroduceTopenLandModal} from '../../components/Modal/IntroduceTopenLandModal';
import {mapSearchItemUi} from '../../components/SearchProjectItem/types';
import {FeatureConfig} from '../../configs/FeatureConfig';
import {useLogin} from '../Auth/useLogin';
import {useMount, useMountInteraction} from '../commonHooks';
import ScreenIds from '../ScreenIds';
import {useTPFClient} from '../TPF/hooks/useTPFClient';
import {TrackingActions} from '../WithSegment';
import {Block} from './Block';
import ButtonGroup from './ButtonGroup';
import HeaderAnimation from './components/HeaderAnimation';
import Intro from './components/Intro';
import PlusServiceBlock from './components/PlusServiceBlock';
import {getHotProjectsQueryOptions, getNewPropertiesQueryOptions} from './HomeUtil';
import NewsHome, {useGetArticles} from './NewsHome';
import ProjectHome from './ProjectHome';
import PropertyHome from './PropertyHome';
import styles from './styles';
import {TopenerOfMonth, useGetTopenerOfMonth} from './TopenerOfMonth';
import {mapPropertyC2CGuarantee} from './TopenerOfMonth/types';
import TrainingBlock from './TrainingHome/TrainingBlock';
import {BLOCKS, useBlocks} from './useBlocks';
import useDataMapper from './useDataMapper';
import {useFormatPrice} from './useFormatPrice';

const hotProjectsDataFields = ['getFoProjectsHomePageV1'];
const propertiesDataFields = ['getFoC2CPropertyPostsHomePageV1'];
const PADDING_TOP = 210;
const useGetProjects = ({onLoadDone = () => {}}) => {
  const {getMasterData} = useContext(AppContext);
  const {formatPrice} = useFormatPrice();
  const {updateProject: updateProjectPrivate} = useContext(LastModifiedContext);
  const [getHotProjects, hotProjectsPost, hotProjectsResult] = useDataMapper({
    inittialState: [],
    useLazyQuery: useGetFoProjectsHomePageV1LazyQuery,
    queryOptions: {
      ...FETCH_POLICY.CACHE_AND_NETWORK, // ...getHotProjectsQueryOptions(),
      onCompleted: onLoadDone,
      onError: onLoadDone,
    },
    mapper: data => {
      const projects: [] = data?.projectInfoDtos ?? [];
      return projects.map(project => mapSearchItemUi(project, formatPrice, getMasterData));
    },
    dataFieldNameArr: hotProjectsDataFields,
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(hotProjectsPost);
  }, [hotProjectsPost]);

  const updateItem = updatedItem => {
    updateProjectPrivate(updatedItem);
    const newItems = [...items];
    const foundIndex = items.findIndex(it => it.projectId === updatedItem.projectId);
    if (foundIndex !== -1) {
      newItems[foundIndex] = {
        ...newItems[foundIndex],
        ...updatedItem,
      };
      setItems(newItems);
    }
  };
  const actions = {updateItem};
  return [getHotProjects, items, hotProjectsResult, actions];
};

const useGetProperty = ({onLoadDone = () => {}}) => {
  const {updateProperty: updatePropertyrivate} = useContext(LastModifiedContext);
  const {formatPrice} = useFormatPrice();
  const [getNewProperties, newPropertyPost, propertyResult] = useDataMapper({
    inittialState: [],
    useLazyQuery: useGetFoC2CPropertyPostsHomePageV1LazyQuery,
    queryOptions: {
      ...FETCH_POLICY.CACHE_AND_NETWORK,
      onCompleted: () => {
        onLoadDone();
      },
      onError: () => {
        onLoadDone();
      },
    },
    mapper: data => {
      const properties = data?.propertyPostInfoDtos ?? [];
      return properties.map(property => mapPropertyC2CGuarantee(property, formatPrice));
    },
    dataFieldNameArr: propertiesDataFields,
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(newPropertyPost);
  }, [newPropertyPost]);

  const updateItem = updatedItem => {
    updatePropertyrivate(updatedItem);
    setItems([...updateSingleItem(updatedItem, items, 'propertyPostId')]);
  };
  const actions = {updateItem};
  return [getNewProperties, items, propertyResult, actions];
};

const PropertyPostsBlock = forwardRef(({navigation, onPressViewMore}, ref) => {
  const [getNewProperties, newPropertyPost, propertyResult, propertyActions] = useGetProperty({
    onLoadDone: () => {},
  });

  useImperativeHandle(ref, () => ({
    fetchData: () => {
      getNewProperties(getNewPropertiesQueryOptions());
    },
  }));

  useMount(() => {
    getNewProperties(getNewPropertiesQueryOptions());
  });

  return (
    <PropertyHome
      actions={propertyActions}
      loading={!propertyResult.called || propertyResult.loading}
      onPressViewMore={onPressViewMore}
      items={newPropertyPost}
      navigation={navigation}
    />
  );
});

const TopenersBlock = ({onPressViewMore}) => {
  const [getTopeners, topeners, loadingTopeners, topenerActions] = useGetTopenerOfMonth({
    onDone: () => {},
  });

  useMount(() => {
    getTopeners();
  });

  return (
    <TopenerOfMonth
      onPressViewMore={onPressViewMore}
      topeners={topeners}
      loading={loadingTopeners}
      actions={topenerActions}
    />
  );
};

const NewsBlock = ({navigation}) => {
  const {track} = useAnalytics();
  const {
    articles,
    loading: loadingSkeleton,
    getArticle,
    called: getArticlesCalled,
  } = useGetArticles({
    onDone: () => {},
  });
  const [selectedCategory, selectCategory] = useState(categoriesNewsHomepage[0]);

  const changeArticleType = e => {
    if (selectedCategory !== e) {
      getArticle({articleType: e?.id});
      selectCategory(e);
    }
  };

  const onPressItem = data => {
    if (data) {
      track(TrackingActions.newsClicked, {
        category: selectedCategory.text,
        name: data?.title ?? '',
      });

      navigation.navigate(ScreenIds.PageDetail, {
        pageDetail: data,
        isShowDate: true,
        title: selectedCategory.text,
        emptyCommentMessage: translate('news.emptyCommentMessage'),
      });
    }
  };

  const onPressViewMoreNews = () => {
    navigation.navigate(ScreenIds.NewList);
  };

  useMount(() => {
    getArticle({});
  });

  return (
    <View style={styles.blockPadding}>
      <NewsHome
        categories={categoriesNewsHomepage}
        selectedCategory={selectedCategory}
        selectCategory={e => changeArticleType(e)}
        listNews={articles}
        loading={!getArticlesCalled || loadingSkeleton}
        onPressItem={onPressItem}
        onPressViewMore={onPressViewMoreNews}
      />
    </View>
  );
};

const HighlightedProductsBlock = ({
  openSearchB2C,
  openSearchC2C,
  hotProjectsResult,
  hotProjectsPost,
  projectActions,
  navigation,
  propertyPostsBlockRef,
}) => {
  return (
    <View style={styles.blockPadding}>
      <ProjectHome
        onPressViewMore={openSearchB2C}
        loading={!hotProjectsResult.called || hotProjectsResult.loading}
        items={hotProjectsPost}
        actions={projectActions}
        navigation={navigation}
      />

      <PropertyPostsBlock
        ref={propertyPostsBlockRef}
        navigation={navigation}
        onPressViewMore={openSearchC2C}
      />
    </View>
  );
};

const PADDING_TO_BOTTOM = 20;
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - PADDING_TO_BOTTOM;
};

const HomeContainer = ({
  onSearch,
  onPressServiceItem,
  openSearchB2C,
  openSearchC2C,
  openSearchRental,
  openSearchAgent,
  onNews,
  onKnowledge,
  openService,
  onUtilities360,
  keyword,
  setKeyword,
  plusServices,
  onPressViewMoreKnowledge,
}) => {
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const propertyPostsBlockRef = useRef();
  const blocks = useBlocks();
  const isAgentUser = useSelector(isAgent);
  const {setHomePageScrollRef} = useContext(AppContext);
  const {notLoggedIn} = useLogin();
  const tpfClient = useTPFClient();
  const [refreshing, setRefreshing] = useState(false);
  const animatedValue = useSharedValue(0);
  const [getHotProjects, hotProjectsPost, hotProjectsResult, projectActions] = useGetProjects({
    onLoadDone: () => {
      setRefreshing(false);
    },
  });

  const loadAllData = () => {
    getHotProjects(getHotProjectsQueryOptions());
    propertyPostsBlockRef.current?.fetchData();
  };

  const onKeywordChange = text => setKeyword(text);

  useMountInteraction(() => {
    loadAllData();
    setHomePageScrollRef(scrollRef.current);
  });

  const refreshToken = useSelector(getRefreshToken);
  const onRefresh = async () => {
    setRefreshing(true);

    // setLastUpdatedTime(getNowTimeStamp());
    if (!notLoggedIn && !isAgentUser) {
      //force refresh token first to handle case user upgrade to agent from other places
      const response = await refreshTokenAction(refreshToken);
      response && loadAllData(); //only refresh if get token success
    } else {
      loadAllData();
    }

    blocks.setItems([]);
  };

  const onScroll = nativeEvent => {
    if (isCloseToBottom(nativeEvent)) {
      blocks.loadMore();
    }
    animatedValue.value = nativeEvent.contentOffset.y;
  };

  const onScrollEndDrag = e => {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (offsetY >= 50 && offsetY < 140) {
      scrollRef.current.scrollTo({y: 140, animated: true});
    } else if (offsetY >= 0 && offsetY < 50) {
      scrollRef.current.scrollTo({y: 0, animated: true});
    }
  };

  return (
    <SafeAreaView>
      <HeaderAnimation
        onSearch={onSearch}
        keyword={keyword}
        animatedValue={animatedValue}
        setKeyword={setKeyword}
        onKeywordChange={onKeywordChange}
      />
      <ScrollView
        ref={scrollRef}
        refreshControl={
          <RefreshControl progressViewOffset={160} refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        directionalLockEnabled={true}
        scrollEventThrottle={16}
        onScrollEndDrag={onScrollEndDrag}
        contentContainerStyle={{paddingTop: PADDING_TOP}}
        onScroll={({nativeEvent}) => onScroll(nativeEvent)}>
        <ButtonGroup
          openSearchB2C={openSearchB2C}
          openSearchC2C={openSearchC2C}
          openSearchRental={openSearchRental}
          onPressSearchAgent={openSearchAgent}
          onPressService={openService}
          onPressUtilities360={onUtilities360}
          onPressKnowledge={onKnowledge}
          onPressNews={onNews}
        />
        <Image style={styles.imgSlogan} source={IMAGES.IMG_SLOGAN} />
        <HighlightedProductsBlock
          openSearchB2C={openSearchB2C}
          openSearchC2C={openSearchC2C}
          hotProjectsResult={hotProjectsResult}
          hotProjectsPost={hotProjectsPost}
          projectActions={projectActions}
          navigation={navigation}
          propertyPostsBlockRef={propertyPostsBlockRef}
        />
        <Intro navigation={navigation} plusServicesDefault={plusServices.default} />
        <PlusServiceBlock
          onPressServiceItem={onPressServiceItem}
          onPressSendRequest={tpfClient.showCreateRequest}
          plusServices={plusServices}
          isHomePage={true}
        />

        {FeatureConfig.enableNews && (
          <Block loading={blocks.isLoading(BLOCKS.NEWS)}>
            <NewsBlock navigation={navigation} />
          </Block>
        )}

        <Block loading={blocks.isLoading(BLOCKS.KNOWLEDGE)}>
          <TrainingBlock onPressViewMore={onPressViewMoreKnowledge} navigation={navigation} />
        </Block>

        <View style={METRICS.verticalMargin}>
          {blocks.isLastItem() === false && (
            <ActivityIndicator animating color={COLORS.PRIMARY_A100} />
          )}
        </View>
      </ScrollView>
      <IntroduceTopenLandModal />
    </SafeAreaView>
  );
};

export default HomeContainer;
