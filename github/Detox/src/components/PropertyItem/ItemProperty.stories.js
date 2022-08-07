import {storiesOf} from '@storybook/react-native';
import React from 'react';

import PropertyItemGuarantee from './PropertyItemGuarantee';

storiesOf('z|c2c/ItemProperty', module)
  .add('default', () => {
    return <PropertyItemGuarantee {...props} />;
  })
  .add('Hide BrokenInfo', () => {
    return <PropertyItemGuarantee {...props} showBrokenInfo={false} />;
  })
  .add('Is menberInfo', () => {
    return <PropertyItemGuarantee {...props} isAgent={false} />;
  })
  .add('ItemType Small', () => {
    return <PropertyItemGuarantee {...props} itemType={'small'} />;
  });

const props = {
  actions: {},
  showBrokenInfo: true,
  propertyPostId: '018fc69f-8ee5-438c-a1fd-1d51580037ec',
  images: '',
  isFollowed: false,
  isAgent: true,
  address: '110 Đường ven biển, Phước Thuận, Xuyên Mộc, Bà Rịa Vũng Tàu.',
  title: 'Căn hô Hồ Tràm',
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
};
