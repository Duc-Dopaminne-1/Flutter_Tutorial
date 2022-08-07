import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {ScrollView} from 'react-native';

import ConfirmPropertyMainInfo from './ConfirmPropertyMainInfo';

storiesOf('z/b2c/ConfirmPropertyMainInfo', module) //format
  .add('Default!', () => (
    <ScrollView>
      <ConfirmPropertyMainInfo data={data} />
    </ScrollView>
  ));

const data = {
  __typename: 'CheckCurrentUserIsSaleAgentResponse',
  errorCode: 0,
  errorMessage: null,
  errorMessageCode: null,
  isSaleAgent: true,
  propertyPostId: '54802c75-f863-45fd-b28a-c48f57b16864',
  propertyType: 'apartment',
  propertyTypeName: 'apartment',
  propertyTypeDescription: 'Căn hộ',
  propertyCode: 'A022',
  projectName: 'Thinh test 3',
  projectCode: 'MDA00469',
  projectId: '852998ec-759d-4e9f-9562-32d8a10e11a4',
  floorOrSubAreaCode: 'Vidi',
  images: [
    {uri: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'},
    {
      uri: 'https://images.unsplash.com/photo-1612151855475-877969f4a6cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&w=1000&q=80',
    },
  ],
  price: '13,750,000 VND',
  propertyPrice: '1,100,000,000 VND',
  expectedPrice: '50 triệu/m2',
  commission: '0%',
  buyCommission: '1%',
  saleCommission: '0%',
  numberOfBooking: null,
  staffGroupIds: '["48c89c57-0123-43eb-8b99-450e739e6281"]',
  width: 'null m',
  length: 'null m',
  postDescription:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam ut porttitor leo a diam licitudin ',
  propertySubTypeDescription: 'Chung cư',
  floor: '2',
  direction: 'Tây',
  balconyDirection: 'Đông',
  numberOfBedrooms: 2,
  numberOfBathrooms: 2,
  heartWellArea: '70 m²',
  clearedArea: '80 m²',
  saleTrackingStatus: 'Đang mở đặt cọc',
  bookingFee: '10,000 VND',
  houseDesign: null,
  numberOfFloor: null,
  tower: 'Vidi',
  totalSiteArea: '0 m²',
  buildingArea: '70 m²',
  capetArea: '80 m²',
  buildingLine: '',
  blockName: 'Vidi',
  saleSeasonId: '3899da3b-8969-409b-8ee0-55a22d88566e',
  isBooked: null,
  ableConfirmDeposite: true,
  bookingTransactionInfo: null,
  contextType: 'NewDeposit',
  isDeposited: false,
  rawPrice: 13750000,
  isAgentUser: true,
  currentMode: 'MODE_DEPOSIT',
  rawBookingFee: 10000,
  detailPath: null,
  timeUpdate: '2022-04-20T12:46:31.510Z',
  projectStatusDescription: 'Đang mở bán',
  featurePhotos:
    'https://sandbox-citus.topenland.com/gateway/downloader/sale/image-bb820e59-cfc0-4da7-b66a-bb5e4f4b4b7f.png',
};
