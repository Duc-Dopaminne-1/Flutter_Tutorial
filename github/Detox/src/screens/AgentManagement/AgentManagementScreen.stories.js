import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../storybook/utils/configDecorator';
import {IMAGES} from '../../assets/images';
import {AgentManagerContainer} from './AgentManagementScreen';

storiesOf('z|auth/AgentManagerContainer', module)
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  ) //format
  .add('AgentManager', () => {
    return <AgentManagerContainer canGoBack={false} {...data} />;
  });

const data = {
  agentInfo: {
    name: 'HX-NVKD-Dương Thị Ngọc My',
    groupName: 'HX-TPKD-Võ Huy Cường',
    agentGroupId: 'c2678fcf-8e63-40cb-a9ab-7c906451f701',
    email: 'mydtn333@gmail.com',
    phoneNumber: '0943493339',
    agentCode: 'MDL000000541',
    image: '',
    rank: 'rank5',
    isAgentLeader: false,
    rateNumber: null,
    interestedProperties: [
      {id: 0, name: 'Căn hộ', icon: IMAGES.IC_ICON_AGENT_APARTMENT},
      {id: 1, name: 'Biệt thự', icon: IMAGES.IC_ICON_AGENT_VILLA},
      {id: 2, name: 'Nhà phố', icon: IMAGES.IC_ICON_AGENT_HOME},
      {id: 3, name: 'Đất nền', icon: IMAGES.IC_ICON_AGENT_PROPERTY},
    ],
    interestedAreas: [
      {id: 0, name: 'Bình Thạnh, Hồ Chí Minh'},
      {id: 1, name: 'Quận 3, Hồ Chí Minh'},
      {id: 2, name: 'Thủ Đức, Hồ Chí Minh'},
      {id: 3, name: 'Quận 9, Hồ Chí Minh'},
    ],
    topenerServiceTypes: [
      {
        requestTypeName: 'AdvancedVerificationPost',
        requestTypeDescription: 'Xác thực tin đăng chuyên sâu',
      },
      {
        requestTypeName: 'PostImprovementAndBasicVerification',
        requestTypeDescription: 'Cải thiện tin đăng và xác thực cơ bản',
      },
    ],
  },
  agentTitle: 'Thành viên nhóm',
  propertyData: {
    totalCount: 1,
    loading: false,
    items: [],
    error: '',
  },
  projectData: {
    totalCount: 1,
    loading: false,
    items: [],
    error: '',
  },
};
