import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {WorkingAreaView} from './WorkingAreas';

storiesOf('z|auth/WorkingAreaView', module) //format
  .add('default', () => {
    return <WorkingAreaView {...data} />;
  });

const data = {
  dropdownCities: [
    {id: 1, name: 'Hồ Chí Minh', checked: false},
    {id: 2, name: 'Hà Nội', checked: false},
    {id: 3, name: 'Đà Nẵng', checked: false},
    {id: 4, name: 'Bình Dương', checked: false},
    {id: 5, name: 'Đồng Nai', checked: false},
    {id: 6, name: 'Khánh Hòa', checked: false},
    {id: 7, name: 'Hải Phòng', checked: false},
  ],
  state: {
    agentCode: 'MDL000000007',
    nationalId: '0123456789',
    referralCode: '0987080100',
    preferPropertyPriceFrom: 15,
    preferPropertyPriceTo: 31,
    workingAreas: [
      {city: {id: 1, name: 'Hồ Chí Minh'}, district: {id: 1, name: 'Bình Chánh'}},
      {city: {id: 3, name: 'Đà Nẵng'}, district: {id: 57, name: 'Hòa Vang'}},
      {city: {id: 3, name: 'Đà Nẵng'}, district: {id: 58, name: 'Hoàng Sa'}},
    ],
    preferPropertyTypes: [
      {
        id: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
        name: 'apartment',
        description: 'Căn hộ',
        checked: false,
      },
      {
        id: '48cceac6-e202-494d-9b06-2374042f1044',
        name: 'villa',
        description: 'Biệt thự',
        checked: true,
      },
      {
        id: 'b2ba5130-faa5-458c-aba8-58c505ac59b9',
        name: 'house',
        description: 'Nhà phố',
        checked: true,
      },
      {
        id: '82cc71b0-704b-470c-bca8-5f967c0e11b7',
        name: 'land',
        description: 'Đất nền',
        checked: false,
      },
    ],
    permanentAddress: {
      city: {id: 2, name: 'Hà Nội'},
      district: {id: 25, name: 'Ba Đình'},
      ward: {id: 328, name: 'Điện Biên'},
      street: '17 Nguyễn Huệ',
    },
    contactAddress: {
      city: {id: 2, name: 'Hà Nội'},
      district: {id: 25, name: 'Ba Đình'},
      ward: {id: 328, name: 'Điện Biên'},
      street: '17 Nguyễn Huệ',
    },
    agentGroup: {id: 'f7c41c4b-c845-4c04-b9a5-1c4187c50ca2', name: 'Rồng Vàng Q1'},
    isAgree: true,
    isAgentLeader: false,
    nationalIdType: 'CMND',
    nationalIdIssuePlace: 'bhh',
    nationalIdIssueDate: 1633885200000,
    initialAccountCode: 'staff001',
    topenerServiceTypes: [],
    allowedCrawler: true,
  },
  districts: [],
  loadingDistrictText: 'Chưa có dữ liệu hiển thị',
  selectedCity: {},
};
