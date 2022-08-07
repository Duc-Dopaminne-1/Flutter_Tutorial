import React, {useEffect, useState} from 'react';
import {SectionList, StyleSheet, Text} from 'react-native';

import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal} from '../../assets/theme/metric';
import BaseScreen from '../../components/BaseScreen';
import ScreenIds from '../ScreenIds';
import MenuItem from './components/MemberItem';
import {IParticipant} from './types';

type ChatMemberScreenProps = {
  route: {
    params: {
      participants: IParticipant[],
    },
  },
};

const ChatMemberScreen = ({route, navigation}: ChatMemberScreenProps) => {
  const {participants} = route.params ?? {};
  const [sections, setSections] = useState([]);

  useEffect(() => {
    setSections([
      {
        title: translate('chatMember.section.consultant'),
        data: participants.filter(value => !value.isAgent && !value.isMember),
      },
      {
        title: translate('chatMember.section.agent'),
        data: participants.filter(value => value.isAgent),
      },
      {
        title: translate('chatMember.section.member'),
        data: participants.filter(value => value.isMember),
      },
    ]);
  }, [participants]);

  const renderItem = ({item, index, section: {data}}: {item: IParticipant}) => {
    const isLastItem = data?.length - 1 === index;
    return (
      <MenuItem
        {...item}
        isLastItem={isLastItem}
        onPress={() => {
          navigation.navigate(ScreenIds.AgentManagement, {
            agentId: item.agentId,
          });
        }}
      />
    );
  };

  return (
    <BaseScreen title={translate('chatMember.title') + ` (${participants.length})`}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
        renderSectionHeader={({section: {title, data}}) => {
          return !!data?.length && <Text style={styles.section}>{title}</Text>;
        }}
      />
    </BaseScreen>
  );
};

export default ChatMemberScreen;

const styles = StyleSheet.create({
  section: {
    ...FONTS.bold,
    fontSize: 20,
    backgroundColor: COLORS.BACKGROUND,
    color: COLORS.BLACK_31,
    padding: normal,
  },
});
