import {storiesOf} from '@storybook/react-native';
import React from 'react';

import InterestedAreaContainer from './InterestedAreaContainer';

storiesOf('z|auth/InterestedAreaContainer', module) //format
  .add('default', () => {
    return <InterestedAreaContainer {...data} />;
  });
const data = {
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
  cities: [
    {id: 1, name: 'Hồ Chí Minh', checked: false},
    {id: 2, name: 'Hà Nội', checked: false},
    {id: 3, name: 'Đà Nẵng', checked: false},
    {id: 4, name: 'Bình Dương', checked: false},
    {id: 5, name: 'Đồng Nai', checked: false},
    {id: 6, name: 'Khánh Hòa', checked: false},
    {id: 7, name: 'Hải Phòng', checked: false},
    {id: 8, name: 'Long An', checked: false},
    {id: 9, name: 'Quảng Nam', checked: false},
    {id: 10, name: 'Bà Rịa Vũng Tàu', checked: false},
    {id: 11, name: 'Đắk Lắk', checked: false},
    {id: 12, name: 'Cần Thơ', checked: false},
    {id: 13, name: 'Bình Thuận  ', checked: false},
    {id: 14, name: 'Lâm Đồng', checked: false},
    {id: 15, name: 'Thừa Thiên Huế', checked: false},
    {id: 16, name: 'Kiên Giang', checked: false},
    {id: 17, name: 'Bắc Ninh', checked: false},
    {id: 18, name: 'Quảng Ninh', checked: false},
    {id: 19, name: 'Thanh Hóa', checked: false},
    {id: 20, name: 'Nghệ An', checked: false},
    {id: 21, name: 'Hải Dương', checked: false},
    {id: 22, name: 'Gia Lai', checked: false},
    {id: 23, name: 'Bình Phước', checked: false},
    {id: 24, name: 'Hưng Yên', checked: false},
    {id: 25, name: 'Bình Định', checked: false},
    {id: 26, name: 'Tiền Giang', checked: false},
    {id: 27, name: 'Thái Bình', checked: false},
    {id: 28, name: 'Bắc Giang', checked: false},
    {id: 29, name: 'Hòa Bình', checked: false},
    {id: 30, name: 'An Giang', checked: false},
    {id: 31, name: 'Vĩnh Phúc', checked: false},
    {id: 32, name: 'Tây Ninh', checked: false},
    {id: 33, name: 'Thái Nguyên', checked: false},
    {id: 34, name: 'Lào Cai', checked: false},
    {id: 35, name: 'Nam Định', checked: false},
    {id: 36, name: 'Quảng Ngãi', checked: false},
    {id: 37, name: 'Bến Tre', checked: false},
    {id: 38, name: 'Đắk Nông', checked: false},
    {id: 39, name: 'Cà Mau', checked: false},
    {id: 40, name: 'Vĩnh Long', checked: false},
    {id: 41, name: 'Ninh Bình', checked: false},
    {id: 42, name: 'Phú Thọ', checked: false},
    {id: 43, name: 'Ninh Thuận', checked: false},
    {id: 44, name: 'Phú Yên', checked: false},
    {id: 45, name: 'Hà Nam', checked: false},
    {id: 46, name: 'Hà Tĩnh', checked: false},
    {id: 47, name: 'Đồng Tháp', checked: false},
    {id: 48, name: 'Sóc Trăng', checked: false},
    {id: 49, name: 'Kon Tum', checked: false},
    {id: 50, name: 'Quảng Bình', checked: false},
    {id: 51, name: 'Quảng Trị', checked: false},
    {id: 52, name: 'Trà Vinh', checked: false},
    {id: 53, name: 'Hậu Giang', checked: false},
    {id: 54, name: 'Sơn La', checked: false},
    {id: 55, name: 'Bạc Liêu', checked: false},
    {id: 56, name: 'Yên Bái', checked: false},
    {id: 57, name: 'Tuyên Quang', checked: false},
    {id: 58, name: 'Điện Biên', checked: false},
    {id: 59, name: 'Lai Châu', checked: false},
    {id: 60, name: 'Lạng Sơn', checked: false},
    {id: 61, name: 'Hà Giang', checked: false},
    {id: 62, name: 'Bắc Kạn', checked: false},
    {id: 63, name: 'Cao Bằng', checked: false},
  ],
};
