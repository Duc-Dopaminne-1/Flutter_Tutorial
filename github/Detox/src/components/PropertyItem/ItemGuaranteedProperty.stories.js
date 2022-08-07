import {storiesOf} from '@storybook/react-native';
import React from 'react';

import PropertyItemGuarantee from './PropertyItemGuarantee';

storiesOf('z|c2c/ItemProperty', module)
  .add('default guarantee', () => {
    return <PropertyItemGuarantee {...props} />;
  })
  .add('owner guarantee', () => {
    return <PropertyItemGuarantee {...props} isCreatedUser={true} />;
  })
  .add('Is member with guarantee', () => {
    return <PropertyItemGuarantee {...props} isAgent={false} />;
  })
  .add('ItemType Small guarantee', () => {
    return <PropertyItemGuarantee {...props} itemType={'small'} />;
  })
  .add('guarantee mode outline', () => {
    return <PropertyItemGuarantee {...props} showOutline={true} isShowStatus={false} />;
  });

const props = {
  actions: {},
  isAgent: true,
  address: '110 Đường ven biển, Phước Thuận, Xuyên Mộc, Bà Rịa Vũng Tàu.',
  numberOfBedrooms: 2,
  numberOfBathrooms: 2,
  buildingArea: 80,
  direction: 'Đông',
  price: '3 Tỷ',
  commission: '1%',
  brokenAvatar: '',
  brokenName: 'Quách Sâm',
  brokenRank: 'rank2',
  brokenRating: 5,
  brokenPhone: '0336091681',
  brokenEmail: 'quachhaisam@gmail.com',
  height: 424.16666666666663,
  style: {
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    flexWrap: 'nowrap',
    marginEnd: 16,
    alignSelf: 'stretch',
    flex: 0,
    transform: [{scaleY: 1}],
  },
  itemType: 'full',
  isShowFollowButton: false,
  isShowFollower: true,
  propertyInfo: {
    propertyPostId: 'propertyPostId',
    title: 'Bán căn hộ 2PN Chung cư Âu Cơ Tower',
    address: '01 Âu Cơ, Tân Thành, Tân Phú, Hồ Chí Minh.',
    images: '',
    isFollowed: false,
    numberOfBathrooms: 2,
    numberOfBedrooms: 2,
    direction: 'Tây bắc',
    buildingArea: 74.2,
    brokenName: 'Nguyễn Hưng Thịnh',
    brokenRating: 4,
    groupNameDescription: 'Rồng vàng',
    brokenPhone: '0928472261',
    brokenEmail: 'nguyenhungthinh16@gmail.com',
    brokenAvatar: '',
    commission: '1-2%',
    price: '1 Tỷ 3',
  },
  isSmallStyle: true,
  propertyTypeName: 'apartment',
  showForRentBanner: false,
  contractStatus: 'Chưa gửi hợp đồng',
  contractStatusValue: 'UNSENT',
  forRent: false,
  forSale: true,
  guaranteedPackageEndTime: null,
  images: null,
  imagesSize: 3,
  isFollowed: true,
  isRented: false,
  isSold: false,
  postServiceType: 'GUARANTEED',
  propertyCode: 'MTD12',
  propertyPostId: 'd8f4d30a-08b5-40c1-9086-3fac210e4cdc',
  rejectedReason: 'Hình ảnh chưa đúng',
  requestedUpdatingReason: null,
  status: '',
  statusStyle: {
    backgroundColor: '#EBEFFF',
  },
  statusTextStyle: {
    color: '#4259AB',
  },
  title: 'Căn hô Hồ Tràm',
  isGuaranteed: true,
  isShowStatus: true,
  showBrokenInfo: false,
};
