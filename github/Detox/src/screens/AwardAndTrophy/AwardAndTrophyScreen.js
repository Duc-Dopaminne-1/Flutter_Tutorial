import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

import {useGetAgentPerformanceTrackingsByAgentIdCurentLazyQuery} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {getUserId} from '../../appData/user/selectors';
import {FETCH_POLICY, MAP_RANK, NUMBER_AIM_TO_UPGRADE_RANK} from '../../assets/constants';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal, small} from '../../assets/theme/metric';
import BaseScreen from '../../components/BaseScreen';
import CenterText from '../../components/CenterText';
import {dateToString} from '../../utils/TimerCommon';
import ScreenIds from '../ScreenIds';
import GuildToUpgrade from './GuildToUpgrade';
import ListTarget from './ListTarget';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: normal,
    paddingBottom: 20,
    flex: 1,
  },
  summary: {
    borderRadius: 5,
    marginTop: 50,
  },
  summaryBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
    alignItems: 'center',
    borderRadius: 5,
  },
  medal: {
    width: 56,
    height: 56,
    marginTop: -28,
  },
  name: {
    ...FONTS.regular,
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.BLACK_21,
    paddingTop: 20,
  },
  medalName: {
    ...FONTS.semiBold,
    fontSize: 18,
    textAlign: 'center',
    marginTop: small,
    color: COLORS.BLACK_21,
    paddingBottom: 20,
  },
  date: {
    borderBottomColor: COLORS.SEPARATOR_LINE,
    borderBottomWidth: 1,
    paddingBottom: 20,
    paddingTop: 21,
    flexDirection: 'row',
  },
  dateTitle: {
    ...FONTS.regular,
    textAlign: 'center',
    color: COLORS.GRAY_BUTTON_TITLE,
    fontSize: 12,
  },
  dateValue: {
    ...FONTS.regular,
    textAlign: 'center',
    color: COLORS.BLACK_33,
    fontSize: 14,
  },
  dateContainer: {
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
  },
});

const mapRankData = currentP => {
  const listT = [];
  listT.push({
    title: translate(STRINGS.NUMBER_B2C_TRANSACTION),
    current: currentP.numberOfB2CTransaction,
    target: currentP.targetNumberOfB2CTransaction,
  });
  listT.push({
    title: translate(STRINGS.NUMBER_C2C_TRANSACTION),
    current: currentP.numberOfC2CTransaction,
    target: currentP.targetNumberOfC2CTransaction,
  });
  listT.push({
    title: translate(STRINGS.NUMBER_APPROVED_POSTS),
    current: currentP.numberApprovedPosts,
    target: currentP.targetNumberApprovedPosts,
  });
  listT.push({
    title: translate(STRINGS.NUMBER_REFERAL_AGENTS),
    current: currentP.numberOfReferalAgents,
    target: currentP.targetNumberOfReferalAgents,
  });
  return listT;
};

const AwardAndTrophyScreen = ({route}) => {
  const {name} = route?.params || {};
  const userId = useSelector(getUserId);
  const [currentPerformance, setCurrentPerformance] = useState({});
  const [listTargets, setListTargets] = useState([]);
  const [mapRank, setMapRank] = useState({});

  const onSuccess = data => {
    if (data && data.edges && data.edges[0]) {
      const currentP = data.edges[0];
      setCurrentPerformance(currentP);
      const listT = mapRankData(currentP);
      setListTargets(listT);
    }
  };
  const {startApi, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetAgentPerformanceTrackingsByAgentIdCurentLazyQuery,
    dataField: 'agentPerformanceTrackingsByAgentIds',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess,
    // showSpinner: true,
  });

  useEffect(() => {
    startApi({variables: {input: {agentIds: userId, forCurrentPeriod: true}}});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    const rankName = currentPerformance.newAgentRankingName || MAP_RANK.DEFAULT_NAME;
    if (rankName && MAP_RANK[rankName]) {
      setMapRank(MAP_RANK[rankName]);
    }
  }, [currentPerformance.newAgentRankingName]);

  const renderSummary = () => {
    if (!mapRank.icon) {
      return null;
    }
    return (
      <View style={styles.summary}>
        <ImageBackground
          source={IMAGES.BACKGROUND_RANKING}
          style={[styles.summaryBackground, {backgroundColor: COLORS[mapRank.color]}]}>
          <Image source={IMAGES[mapRank.icon]} style={styles.medal} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.medalName}>{currentPerformance.newAgentRankingDescription}</Text>
        </ImageBackground>
      </View>
    );
  };

  const renderDate = () => {
    if (!currentPerformance.reviewFromDate) {
      return null;
    }
    return (
      <View style={styles.date}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateTitle}>{translate(STRINGS.LAST_DAY_REVIEW_YOUR_RANK)}</Text>
          <Text style={styles.dateValue}>
            {dateToString(new Date(currentPerformance.reviewFromDate))}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateTitle}>{translate(STRINGS.NEXT_DAY_REVIEW_YOUR_RANK)}</Text>
          <Text style={styles.dateValue}>
            {dateToString(new Date(currentPerformance.reviewToDate))}
          </Text>
        </View>
      </View>
    );
  };

  const guideUpgrade =
    currentPerformance.newAgentRankingName === currentPerformance.targetAgentRankingName
      ? STRINGS.NOTE_AIM_KEEP_RANK
      : STRINGS.NOTE_AIM;
  return (
    <BaseScreen title={translate(STRINGS.AGENT_RANK)} testID={ScreenIds.AwardAndTrophy}>
      <ScrollView>
        <View style={styles.container}>
          {renderSummary()}
          {renderDate()}
          {currentPerformance.targetAgentRankingDescription ? (
            <GuildToUpgrade
              title={translate(guideUpgrade, {
                number: NUMBER_AIM_TO_UPGRADE_RANK,
                agentRankingName: currentPerformance.targetAgentRankingDescription,
              })}
            />
          ) : (
            <CenterText loading={loading} />
          )}
          <ListTarget listTargets={listTargets} />
        </View>
      </ScrollView>
    </BaseScreen>
  );
};

export default AwardAndTrophyScreen;
