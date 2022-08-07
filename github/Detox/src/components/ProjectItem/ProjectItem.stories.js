import {storiesOf} from '@storybook/react-native';
import React from 'react';

import ProjectItem from '.';

storiesOf('z|b2c/ItemProject', module).add('default', () => {
  return <ProjectItem {...props} />;
});

const props = {
  style: [
    {marginBottom: 20, borderRadius: 5, backgroundColor: '#FFFFFF', flexWrap: 'nowrap'},
    {marginEnd: 16},
  ],
  projectInfo: {
    projectId: 'b21d4a35-504b-4f5f-b84a-a290222162d5',
    bannerImage:
      'https://sandbox-citus.topenland.com/gateway/downloader/sale/image-e6ed2056-7c84-401b-8a75-ae306118d61c.png_248_140.jpeg',
    isFollowed: false,
    startYear: 2021,
    totalArea: '100',
    overallDescription: '',
    investorOwnerLogo:
      'https://sandbox-citus.topenland.com/gateway/downloader/sale/image-83725f99-6fa7-47bf-870d-7eec71c42ddd.png_30_30.jpeg',
    projectStatusName: 'Đang mở bán',
    investorOwnerName: 'ten chu dau tu',
    projectName: '[binh2] du an can ho',
    projectAddress: 'so nha ten duong, Phường 1, Bình Thạnh, Hồ Chí Minh.',
    minPrice: '4 Tỷ',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
  },
  actions: {},
  isShowFollowButton: true,
  isTop: false,
  isTesting: true,
  isShowFollower: true,
  projectPostId: 1,
};
