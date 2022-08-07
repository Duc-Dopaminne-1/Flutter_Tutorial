import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {useGetTopenerOfMonthLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {LastModifiedContext} from '../../../appData/lastModifiedContext/useLastModifiedContext';
import {CONSTANTS, FETCH_POLICY, MAP_RANK} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal, small, tiny} from '../../../assets/theme/metric';
import Avatar from '../../../components/Avatar';
import CustomIconButton from '../../../components/CustomIconButton';
import RatingComponent from '../../../components/Rating/RatingComponent';
import Section from '../../../components/Section';
import {Loading} from '../../../components/SectionHorizontalList';
import {useContactInfo} from '../../../hooks';
import {useOpenAgentDetail} from '../../../hooks/useOpenAgentDetail';
import ArrayUtils from '../../../utils/ArrayUtils';
import {testProps} from '../../../utils/testProps';
import {ids} from '../../ids';
import {TrackingActions} from '../../WithSegment';
import ListProperty from '../PropertyHome/ListProperty';
import {useFormatPrice} from '../useFormatPrice';
import {styles} from './styles';
import {AgentProps, defaultAgentProps, mapAgentPropsUi} from './types';

export const useGetTopenerOfMonth = ({onDone}) => {
  const [topeners, setTopeners] = useState([]);
  const {formatPrice} = useFormatPrice();
  const {updateProperty: updatePropertytPrivate} = useContext(LastModifiedContext);
  const {startApi, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetTopenerOfMonthLazyQuery,
    dataField: 'topenerOfMonth',
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
    showSpinner: false,
    onError: () => {
      setTopeners(null);
      onDone();
    },
    onSuccess: response => {
      const agents = response?.edges ?? [];
      setTopeners(agents.map((agent, index) => mapAgentPropsUi(agent, formatPrice, index)));
      onDone();
    },
  });
  const getTopeners = startApi;

  useEffect(() => {
    setTopeners(topeners);
  }, [topeners]);

  const updateItem = updatedItem => {
    updatePropertytPrivate(updatedItem);
    const newItems = [...topeners];
    const arrayIndex = ArrayUtils.findPropertyTwoLevel(newItems, updatedItem.propertyPostId);
    if (arrayIndex[0] >= 0 || arrayIndex[1] >= 0) {
      newItems[arrayIndex[0]].properties[arrayIndex[1]] = {
        ...newItems[arrayIndex[0]].properties[arrayIndex[1]],
        ...updatedItem,
      };
      setTopeners(newItems);
    }
  };
  const actions = {updateItem};

  return [getTopeners, topeners, loading, actions];
};

const ViewContactInfo = ({topener}) => {
  const {callPhone, sendEmail} = useContactInfo(topener?.phone, topener?.email);
  const onPressCall = () => {
    callPhone();
  };

  const onPressSendEmail = () => {
    sendEmail();
  };

  return (
    <>
      <CustomIconButton
        iconColor={COLORS.PRIMARY_A100}
        onPress={onPressCall}
        style={{marginEnd: normal + small + tiny}}
        image={IMAGES.IC_CONTACT_PHONE}
        hitSlop={CONSTANTS.HIT_SLOP}
      />
      <CustomIconButton
        iconColor={COLORS.PRIMARY_A100}
        style={{marginEnd: normal}}
        onPress={onPressSendEmail}
        image={IMAGES.IC_CONTACT_EMAIL}
        hitSlop={CONSTANTS.HIT_SLOP}
      />
    </>
  );
};

const ViewAgentInfo = ({avatar, fullName, groupName, agentId, rating, topener}) => {
  const {openAgentDetail} = useOpenAgentDetail({
    agentId: agentId,
    isAgent: true,
  });
  const {track} = useAnalytics();

  const onPressAvatar = () => {
    track(TrackingActions.topenerClicked, {
      agent_name: fullName ?? '',
      agent_star: rating ?? '0',
    });

    openAgentDetail();
  };

  return (
    <View style={styles.viewNameContainer}>
      <TouchableOpacity onPress={onPressAvatar}>
        <Avatar size={54} url={avatar} />
      </TouchableOpacity>
      <View style={styles.viewName}>
        <Text style={styles.fullName}>{fullName}</Text>
        <Text style={styles.groupTitle}>Nhóm: {groupName}</Text>
        <RatingComponent
          showRatingText
          backgroundColor={COLORS.NEUTRAL_WHITE}
          imageSize={13}
          rateNumber={rating}
        />
      </View>
      <ViewContactInfo topener={topener} />
    </View>
  );
};

export const ViewAgentRank = ({rank, customerStyle, iconStyle, textStyle}) => {
  const rankInfo = MAP_RANK[rank] ?? {};
  return (
    <View
      style={[
        styles.viewRankContainer,
        {backgroundColor: COLORS[rankInfo.color] ?? COLORS.BRAND_GREY},
        customerStyle,
      ]}>
      {rank ? <Image style={[styles.rankImage, iconStyle]} source={IMAGES[rankInfo.icon]} /> : null}
      <Text {...testProps(ids.profile.rankLabel)} style={[styles.rankText, textStyle]}>
        {rankInfo.name ?? 'Thành viên'}
      </Text>
    </View>
  );
};

export const TopenerOfMonth = (props: AgentProps) => {
  const {topeners, loading, onPressViewMore, actions} = props;
  if (!topeners) {
    return null;
  }

  return (
    <Section
      sectionName={'Topener của tháng'}
      isViewMoreVisible
      onViewMore={onPressViewMore}
      titleStyle={styles.sectionText}
      titleContainerStyle={METRICS.retsetVerticalMargin}>
      <Loading loading={loading}>
        {topeners.map(topener => {
          const {
            rankType,
            rank,
            avatar,
            fullName,
            agentId,
            rating,
            groupNameDescription,
            sellingTotal,
            phone,
            email,
          } = topener;
          const soldFormat = `${sellingTotal} sản phẩm`;
          const rankInfo = MAP_RANK[rankType];
          return (
            <View style={styles.itemContainer} key={agentId}>
              <ViewAgentInfo
                agentId={agentId}
                avatar={avatar}
                fullName={fullName}
                groupName={groupNameDescription}
                rating={rating}
                phone={phone}
                email={email}
                topener={topener}
              />
              <View style={styles.infoProperty}>
                <Image source={rank} />
                <View style={styles.infoRank}>
                  <Text style={styles.soldTitle}>Topener</Text>
                  <View style={{...HELPERS.rowCenter}}>
                    <Image source={IMAGES[rankInfo.icon]} />
                    <Text style={{...FONTS.bold, color: COLORS[rankInfo.color]}}>
                      {rankInfo.name}
                    </Text>
                  </View>
                </View>
                <View style={{...HELPERS.center}}>
                  <Text style={styles.soldTitle}>Đã bán</Text>
                  <Text style={styles.soldValue}>{soldFormat}</Text>
                </View>
              </View>

              <ListProperty
                isAgentHome={true}
                actions={actions}
                items={topener.properties}
                showBrokenInfo={false}
                navigation={null}
              />
            </View>
          );
        })}
      </Loading>
    </Section>
  );
};

TopenerOfMonth.defaultProps = defaultAgentProps;
