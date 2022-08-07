import React, {useContext, useEffect, useState} from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';

import {useGetAgentGroupInfoByIdLazyQuery} from '../../../api/graphql/generated/graphql';
import {parseGraphqlError} from '../../../api/graphql/parseGraphqlError';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {FETCH_POLICY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal, tiny} from '../../../assets/theme/metric';
import BaseScreen from '../../../components/BaseScreen';
import CenterText from '../../../components/CenterText';
import LinkTextButton from '../../../components/LinkTextButton';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import {renderMemberItem} from './RenderMemberItem';

const styles = StyleSheet.create({
  sectionList: {
    marginTop: tiny,
  },
  sectionHeader: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: tiny,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderButtonText: {
    fontSize: 12,
    color: COLORS.PRIMARY_A100,
  },
  textSectionHeader: {
    fontSize: 15,
    ...FONTS.semiBold,
  },
  sectionFooter: {
    height: normal,
  },
  itemSeparator: {
    height: 1,
    marginHorizontal: normal,
    backgroundColor: COLORS.SEPARATOR_LINE,
  },
});

const renderSectionHeader = (section, navigation) => {
  const title = section.section.title;
  const groupId = section.section.agentGroupId;
  const numberOfMembers = section.section.numberOfMembers;
  const needViewMore = section.section.needViewMore;
  const onPressViewAll = () => {
    navigation.navigate(ScreenIds.YourTeamDetail, {
      screenTitle: title,
      groupId: groupId,
      numberOfMembers: numberOfMembers,
    });
  };

  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.textSectionHeader}>{section.section.title}</Text>
      {!!needViewMore && (
        <LinkTextButton
          textStyle={styles.sectionHeaderButtonText}
          title={translate(STRINGS.VIEW_ALL)}
          onPress={onPressViewAll}
        />
      )}
    </View>
  );
};

const renderSectionFooter = () => {
  return <View style={styles.sectionFooter} />;
};

const renderSeparator = () => {
  return <View style={styles.itemSeparator} />;
};

const isDataEmpty = data => {
  if (data && Array.isArray(data) && data.length) {
    return false;
  }
  return true;
};

const getDataForUi = ({allData, navigation}) => {
  const sections = [];
  let totalMembers = 0;
  if (!Array.isArray(allData)) {
    return {sections, totalMembers};
  }
  for (let index = 0; index < allData.length; index++) {
    const sectionData = allData[index];
    // Get directly agentGroupDescription
    const groupName = sectionData.agentGroupDescription;
    sections.push({
      index: index,
      data: sectionData.allMembers,
      title: `${groupName} (${sectionData.numberOfMembers})`,
      agentGroupId: sectionData.agentGroupId,
      numberOfMembers: sectionData.numberOfMembers,
      needViewMore: sectionData.needViewMore,
      renderItem: item => renderMemberItem(item, navigation, false),
    });
    totalMembers += sectionData.numberOfMembers;
  }
  return {sections, totalMembers};
};

const YourTeamScreen = ({navigation, route}) => {
  const GROUP_SIZE = 5;
  const {agentGroupId} = route.params || {};

  const [execute, {loading, error, data}] = useGetAgentGroupInfoByIdLazyQuery({
    ...FETCH_POLICY.NETWORK_ONLY,
  });
  const {showErrorAlert} = useContext(AppContext);
  const [allData, setAllData] = useState([]);

  useMount(() => {
    execute({
      variables: {
        input: {
          agentGroupId: agentGroupId,
          groupSize: GROUP_SIZE,
          needKpi: false,
        },
      },
    });
  });

  useEffect(() => {
    if (error) {
      const errorMessage = parseGraphqlError(error);
      showErrorAlert(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error]);

  useEffect(() => {
    if (!data) {
      return;
    }
    const resultData = data.agentGroupInfoById;
    let allDataResult = [];
    if (resultData) {
      const {parentAgentGroup, childAgentGroups} = resultData;
      if (parentAgentGroup) {
        allDataResult = [...allDataResult, parentAgentGroup];
      }
      if (childAgentGroups && Array.isArray(childAgentGroups)) {
        allDataResult = [...allDataResult, ...childAgentGroups];
      }
    }

    setAllData(allDataResult);
  }, [data]);

  const {sections, totalMembers} = getDataForUi({allData, navigation});

  return (
    <BaseScreen
      title={`${translate(STRINGS.MEMBER_LIST)} (${totalMembers})`}
      testID={ScreenIds.YourTeam}>
      {(loading || (!loading && isDataEmpty(allData))) && <CenterText loading={loading} />}

      <SectionList
        style={styles.sectionList}
        keyExtractor={item => item.agentId}
        sections={sections}
        renderSectionHeader={section => renderSectionHeader(section, navigation)}
        renderSectionFooter={renderSectionFooter}
        ItemSeparatorComponent={renderSeparator}
        stickySectionHeadersEnabled={false}
      />
    </BaseScreen>
  );
};

export default YourTeamScreen;
