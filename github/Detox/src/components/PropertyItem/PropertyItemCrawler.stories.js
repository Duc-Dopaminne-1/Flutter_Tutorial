import {storiesOf} from '@storybook/react-native';
import React from 'react';

import PropertyItemCrawler from './PropertyItemCrawler';

storiesOf('z|c2c/PropertyPostCrawler', module).add('ItemList', () => {
  return <PropertyItemCrawler {...props} />;
});

const props = {
  item: {
    propertyPostId: 'f76d099b-aa17-4cd2-b66c-3f88006cb92d',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    images: null,
    address: 'Phan Văn Trị, 10, Gò Vấp, Hồ Chí Minh.',
    title:
      'Bán căn hộ chung cư Cityland Park Hills: DT 70m2, 2PN, 2WC giá bán 3.6 tỷ LH 0936.322.476 Hưng',
    numberOfBedrooms: null,
    numberOfBathrooms: null,
    buildingArea: 70,
    price: '3.6 tỷ',
    commission: '',
    forRent: false,
    forSale: false,
    isSold: false,
    contractStatus: '',
    isRequestedUpdate: false,
    isRejected: false,
    isCreatedUser: false,
    imagesSize: 0,
    propertyPostApprovalStatusName: '',
    crawlerProps: {showCrawler: true, contactInfo: {fullname: '', phoneNumber: '093 632 24 76'}},
  },
};
