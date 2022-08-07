import {storiesOf} from '@storybook/react-native';
import React from 'react';

import HomePropertyItem from './HomePropertyItem';

storiesOf('z|c2c/HomePropertyItem', module).add('default', () => {
  return <HomePropertyItem {...props} />;
});

const props = {
  showBrokenInfo: true,
  isTesting: true,
  style: [
    {marginBottom: 20, borderRadius: 5, backgroundColor: '#FFFFFF', flexWrap: 'nowrap'},
    {marginEnd: 16},
  ],
  propertyPostId: '8a97fc87-f90c-432b-bf1d-6c4bfd64c324',
  propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
  images:
    'https://perstoresb.blob.core.windows.net/images/web_248x140_1625911807239_house-in-the-landscape-niko-arcjitect-architecture-residential-russia-houses-khurtin_dezeen_2364_hero.jpg',
  isFollowed: true,
  isAgent: true,
  address: 'Bành Văn Trân, Phường 1, Tân Bình, Hồ Chí Minh.',
  title: 'Test căn hộ Bành Văn Trân, Phường 1, Tân Bình, Hồ Chí Minh.',
  numberOfBedrooms: 1,
  numberOfBathrooms: 1,
  buildingArea: 222,
  direction: 'Đông',
  price: '1.111 Triệu',
  commission: '1%',
  brokenAvatar:
    'https://sandbox-citus.topenland.com/gateway/downloader/personal/image-9fee450a-fc1c-46fc-8e2a-06dfaad3797d.png',
  brokenName: 'Nguyen Khuong',
  brokenRank: 'rank1',
  brokenRating: 0,
  brokenPhone: '0939331012',
  brokenEmail: 'dinhthinh@gmail.com',
  forRent: false,
  forSale: true,
  isSold: false,
  isRented: false,
  isGuaranteed: false,
  contractStatus: '',
  isRequestedUpdate: false,
  isRejected: false,
  imagesSize: 1,
  propertyPostApprovalStatusName: '',
  actions: {},
  isShowFollowButton: true,
  isShowFollower: true,
  isSmallStyle: true,
  propertyTypeName: 'apartment',
  buyRequestMode: false,
  rentCommission: 1,
  rentPrice: 1000000,
};
