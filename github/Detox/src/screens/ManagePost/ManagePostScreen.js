import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SpringScrollView} from 'react-native-spring-scrollview';
import {useSelector} from 'react-redux';

import {useGetSummaryPropertyPostLazyQuery} from '../../api/graphql/generated/graphql';
import {parseGraphqlError} from '../../api/graphql/parseGraphqlError';
import {refreshTokenAction} from '../../api/userApi';
import {AppContext} from '../../appData/appContext/useAppContext';
import {getRefreshToken} from '../../appData/authState/selectors';
import {isAgent} from '../../appData/user/selectors';
import {FETCH_POLICY} from '../../assets/constants';
import {ICONS} from '../../assets/icons';
import CustomIcon from '../../assets/icons/CustomIcon';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal, small, tiny} from '../../assets/theme/metric';
import BaseScreen from '../../components/BaseScreen';
import ScrollViewHeader from '../../components/ScrollViewHeader';
import JsonDataUtils from '../../utils/JsonDataUtils';
import NumberUtils from '../../utils/NumberUtils';
import ScreenIds from '../ScreenIds';

const styles = StyleSheet.create({
  constainer: {
    ...HELPERS.fill,
    ...METRICS.verticalPadding,
    ...METRICS.horizontalPadding,
  },
  widgetContainer: {
    ...HELPERS.row,
    ...HELPERS.center,
    marginBottom: normal,
  },
  leftContainer: {
    ...HELPERS.center,
    width: 100,
    height: 100,
    borderTopLeftRadius: small,
    borderBottomLeftRadius: small,
  },
  leftText: {
    ...FONTS.regular,
    fontSize: 48,
    color: COLORS.NEUTRAL_WHITE,
  },
  rightContainer: {
    ...HELPERS.fill,
    ...HELPERS.mainCenter,
    alignSelf: 'stretch',
    borderTopRightRadius: small,
    borderBottomRightRadius: small,
    paddingHorizontal: small * 3,
  },
  rightText: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.NEUTRAL_WHITE,
  },
  image: {
    position: 'absolute',
    bottom: tiny,
    end: small,
  },
});

const formatLeftText = value => {
  return NumberUtils.parseIntValue(value) > 99 ? '99+' : value;
};

const NavigationWidget = ({leftText, leftColor, rightText, rightColor, image, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.widgetContainer}>
        <View style={[styles.leftContainer, {backgroundColor: leftColor}]}>
          <Text style={styles.leftText}>{formatLeftText(leftText)}</Text>
        </View>
        <View style={[styles.rightContainer, {backgroundColor: rightColor}]}>
          <Text style={styles.rightText}>{rightText}</Text>
        </View>
        <CustomIcon style={styles.image} size={56} name={image} color={COLORS.BLACK_OPACITY_1A} />
      </View>
    </TouchableOpacity>
  );
};

const safeCount = data => {
  return data?.count ?? 0;
};

const mapResponseToState = data => {
  const {propertyPostInfoByApproveStatus} = data.summaryPropertyPosts;
  const {
    saleProject,
    projectFollowCount,
    postFollowC2CCount,
    postPrivate,
    postPublish,
    postApprovalStatusList,
    postSuggestionCount,
    projectSuggestionCount,
  } = JsonDataUtils.parseJSONObject(propertyPostInfoByApproveStatus);

  return {
    saleProject: safeCount(saleProject),
    allPost: safeCount(postPublish),
    privatePost: safeCount(postPrivate),
    followedPost: safeCount(projectFollowCount) + safeCount(postFollowC2CCount),
    followedProject: safeCount(projectFollowCount),
    followedC2C: safeCount(postFollowC2CCount),
    postApprovalStatusList,
    suggestionPost: {
      postFollowB2CCount: safeCount(projectSuggestionCount),
      postFollowC2CCount: safeCount(postSuggestionCount),
      totalCount: safeCount(projectSuggestionCount) + safeCount(postSuggestionCount),
    },
    crawler: data?.summaryByCrawlerTrackingStatus?.totalCount ?? 0,
  };
};

const initialState = {
  saleProject: 0,
  allPost: 0,
  followedPost: 0,
  privatePost: 0,
  postApprovalStatusList: [],
  followedProject: 0,
  followedC2C: 0,
  suggestionPost: {
    postFollowB2CCount: 0,
    postFollowC2CCount: 0,
    totalCount: 0,
  },
  crawler: 0,
};

const ManagePostScreen = ({navigation}) => {
  const [state, setState] = useState(initialState);
  const {showErrorAlert} = useContext(AppContext);
  const scrollRef = useRef(null);
  const [execute, {loading, error, refetch, data}] = useGetSummaryPropertyPostLazyQuery({
    ...FETCH_POLICY.CACHE_AND_NETWORK,
    onCompleted: () => scrollRef.current?.endRefresh(),
  });

  const isAgentUser = useSelector(isAgent);
  const refreshToken = useSelector(getRefreshToken);
  const onRefresh = async () => {
    if (!isAgentUser) {
      //force refresh token first to handle case user upgrade to agent from other places
      const response = await refreshTokenAction(refreshToken);
      if (response) {
        //only refresh this component if got new tokens
        refetch();
      }
    } else {
      refetch();
    }
  };

  useEffect(() => {
    if (error) {
      scrollRef.current?.endRefresh(); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
      const errorMsg = parseGraphqlError(error);
      showErrorAlert(errorMsg);
    }
    if (data) {
      scrollRef.current?.endRefresh(); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
      const newState = mapResponseToState(data);
      setState(newState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, data]);

  useFocusEffect(
    useCallback(() => {
      execute();
    }, [execute]),
  );

  return (
    <BaseScreen title={translate(STRINGS.YOUR_SALES_ITEM)}>
      <SpringScrollView
        ref={scrollRef}
        onRefresh={onRefresh}
        refreshHeader={ScrollViewHeader}
        showsVerticalScrollIndicator={false}
        style={styles.constainer}>
        {isAgentUser && (
          <NavigationWidget
            leftColor={COLORS.ORANGE_34}
            rightColor={COLORS.ORANGE_4A}
            leftText={`${state.saleProject}`}
            rightText={translate(STRINGS.PROPERTY_POST_DELIVERED)}
            onPress={() => navigation.navigate(ScreenIds.ProjectDelivered)}
            image={ICONS.BUILDING}
          />
        )}
        <NavigationWidget
          leftColor={COLORS.PINK_6F}
          rightColor={COLORS.PINK_7F}
          leftText={`${state.allPost}`}
          rightText={translate(STRINGS.YOUR_PROPERTY_POST)}
          onPress={() =>
            navigation.navigate(ScreenIds.YourPropertyPost, {
              postApprovalStatusList: state.postApprovalStatusList,
            })
          }
          image={ICONS.HOME_PADDING}
        />
        <NavigationWidget
          leftColor={COLORS.PURPLE_78}
          rightColor={COLORS.PURPLE_7D}
          leftText={`${state.followedPost}`}
          rightText={translate(STRINGS.PROPERTY_POST_TRACKING)}
          onPress={() =>
            navigation.navigate(ScreenIds.PropertyPostTracking, {
              postFollowB2CCount: state.followedProject,
              postFollowC2CCount: state.followedC2C,
            })
          }
          image={ICONS.BINOCULARS}
        />
        <NavigationWidget
          leftColor={COLORS.GREY_92}
          rightColor={COLORS.TEXT_DARK_40}
          leftText={`${state.privatePost}`}
          rightText={translate(STRINGS.PROPERTY_POST_SAVED)}
          onPress={() => navigation.navigate(ScreenIds.PropertyPostSaved)}
          image={ICONS.DISK_PADDING}
        />
        {isAgentUser && (
          <>
            <NavigationWidget
              leftColor={COLORS.BLUE_ROYAL}
              rightColor={COLORS.BLUE_INDIGO}
              leftText={`${state.suggestionPost.totalCount}`}
              rightText={translate(STRINGS.PROPERTY_POST_SUGGESTION)}
              onPress={() => navigation.navigate(ScreenIds.SuggestionPost, state.suggestionPost)}
              image={ICONS.HOME_PADDING}
            />
            <NavigationWidget
              leftColor={COLORS.BOOKING_TRANSFER}
              rightColor={COLORS.GREEN_A9}
              leftText={state.crawler}
              rightText={translate('propertyPost.crawler.menuTitleRefer')}
              onPress={() => navigation.navigate(ScreenIds.PropertyPostCrawler)}
              image={ICONS.FLAG}
            />
          </>
        )}
      </SpringScrollView>
    </BaseScreen>
  );
};

export default ManagePostScreen;
