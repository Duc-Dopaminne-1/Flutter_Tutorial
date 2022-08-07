import {storiesOf} from '@storybook/react-native';
import React from 'react';

import FilterAgentContainer from './FilterAgentContainer';

storiesOf('z|search/FilterAgentContainer', module).add('default', () => {
  return <FilterAgentContainer {...props} />;
});

const props = {
  isShowFilterLocation: false,
  state: {
    place: {},
    propertyTypes: [
      {id: '2e2b0611-e1fc-4406-b13f-8afafff1c675', name: 'apartment', description: 'Căn hộ'},
      {id: '48cceac6-e202-494d-9b06-2374042f1044', name: 'villa', description: 'Biệt thự'},
      {id: 'b2ba5130-faa5-458c-aba8-58c505ac59b9', name: 'house', description: 'Nhà phố'},
      {id: '82cc71b0-704b-470c-bca8-5f967c0e11b7', name: 'land', description: 'Đất nền'},
    ],
    agentRankings: [
      {id: '1645cfca-98bf-49c5-844e-f9a5b61964c0', name: 'rank5', description: 'Diamond Plus'},
      {id: '5901295a-e2de-4075-bf7e-6fe216de6080', name: 'rank4', description: 'Diamond'},
    ],
    topenerServiceTypes: [
      {id: '948eaed8-4c0c-11ec-ba35-cf06209f6850'},
      {id: '9735b9b0-4c0c-11ec-b119-8351240470bf'},
    ],
    agentGroupIds: [],
    findNearest: false,
    geolocation: null,
    isResetCity: false,
  },
  itemsData: {
    propertyTypes: [
      {id: '2e2b0611-e1fc-4406-b13f-8afafff1c675', name: 'apartment', description: 'Căn hộ'},
      {id: '48cceac6-e202-494d-9b06-2374042f1044', name: 'villa', description: 'Biệt thự'},
      {id: 'b2ba5130-faa5-458c-aba8-58c505ac59b9', name: 'house', description: 'Nhà phố'},
      {id: '82cc71b0-704b-470c-bca8-5f967c0e11b7', name: 'land', description: 'Đất nền'},
    ],
    agentRankings: [
      {id: '1645cfca-98bf-49c5-844e-f9a5b61964c0', name: 'rank5', description: 'Diamond Plus'},
      {id: '5901295a-e2de-4075-bf7e-6fe216de6080', name: 'rank4', description: 'Diamond'},
      {id: '104895fe-4448-49ec-95ce-7447f5b0dc0a', name: 'rank3', description: 'Platinum'},
      {id: '2f97eb50-665f-49f9-8773-773e79209f10', name: 'rank2', description: 'Gold'},
      {id: '4ee09bcf-f299-4dcc-ad80-f4527619e810', name: 'rank1', description: 'Silver'},
    ],
    agentGroups: [
      {id: 'c4ffea71-516e-4d4f-baa5-6d0e98677d2b', name: 'Rồng Lửa Q1', checked: false},
      {id: 'b203957c-9740-47f5-aae2-49e16fe39ed2', name: 'Rồng Lửa Q2', checked: false},
      {id: 'f7c41c4b-c845-4c04-b9a5-1c4187c50ca2', name: 'Rồng Vàng Q1', checked: false},
      {id: 'd2e1605f-c65d-4bb0-bcc4-783e6d5d3ead', name: 'Rồng Vàng NCT', checked: false},
    ],
    topenerServiceTypes: [
      {
        id: '948eaed8-4c0c-11ec-ba35-cf06209f6850',
        name: 'PostImprovementAndBasicVerification',
        description: 'Cải thiện tin đăng và xác thực cơ bản',
      },
      {
        id: '95d33840-4c0c-11ec-99c1-c7095eab38ae',
        name: 'AdvancedVerificationPost',
        description: 'Xác thực tin đăng chuyên sâu',
      },
      {
        id: '9735b9b0-4c0c-11ec-b119-8351240470bf',
        name: 'KeyKeeperAndHouseViewing',
        description: 'Dịch vụ giữ chìa khóa và dẫn khách đi xem nhà',
      },
    ],
  },
};
