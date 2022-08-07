import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../storybook/utils/configDecorator';
import {AgentProfileContainer} from './AgentProfile/AgentProfileScreen';
import {GuestProfileContainer} from './GuestProfileScreen';
import {MemberProfileContainer} from './MemberProfile/MemberProfileScreen';

storiesOf('z|auth/GuestProfileScreen', module)
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('GuestProfile', () => {
    return <GuestProfileContainer {...data} />;
  })
  .add('AgentProfile', () => {
    return <AgentProfileContainer isShowSignOut={false} {...data} />;
  })
  .add('MemberProfile', () => {
    data.screenData.rank = false;
    return <MemberProfileContainer isShowSignOut={false} {...data} />;
  });

const data = {
  screenData: {
    username: 'agentconfirm',
    teamName: 'Rồng Lửa Q2',
    agentGroupId: 'b203957c-9740-47f5-aae2-49e16fe39ed2',
    rank: 'rank1',
    agentCode: 'MDL000000025',
    isAgentLeader: false,
    rating: 5,
    reward: 'Bạn chưa có phần thưởng và danh hiệu nào',
    profilePhoto: '',
    lastModifiedDate: '18/03/2021',
    initialAccountCode: null,
  },
  goToSaleList: '0 đang quan tâm | 0 tin đăng',
  numberOfRequests: 0,
  numberOfMembers: 0,
};
