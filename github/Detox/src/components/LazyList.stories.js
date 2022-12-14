/* eslint-disable sonarjs/no-duplicate-string */
import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../storybook/utils/configDecorator';
import {ITEM_TYPE} from '../assets/constants';
import {projectPaddingStyle} from '../utils/RenderUtil';
import {LazyListView} from './LazyList';
import ProjectItem from './ProjectItem';
import PropertyItemGuarantee from './PropertyItem/PropertyItemGuarantee';

storiesOf('LazyList', module)
  .addDecorator(
    configDecorator({
      isHaveApolloNetwork: true,
    }),
  ) //format
  .add('b2c', () => {
    return (
      <LazyListView
        renderItem={({item, index, ...otherProps}) => {
          return (
            <ProjectItem
              isTesting
              {...otherProps}
              projectInfo={mappingItemB2C}
              itemType={ITEM_TYPE.full}
            />
          );
        }}
        items={B2CItems}
        {...props}
      />
    );
  })
  .add('c2c', () => {
    return (
      <LazyListView
        renderItem={({item, index, ...otherProps}) => {
          return (
            <PropertyItemGuarantee
              isTesting
              {...otherProps}
              showBrokenInfo={false}
              {...item}
              showForRentBanner={false}
              isShowStatus={true}
              showPriceDetailForRent={'sold'}
              style={projectPaddingStyle(index, false)}
              itemType={ITEM_TYPE.full}
            />
          );
        }}
        items={C2CITems}
        {...props}
      />
    );
  });

const mappingItemB2C = {
  projectId: '3a77c2de-36a2-4f69-b8c3-c7b96d4b4678',
  bannerImage:
    'https://sandbox-citus.topenland.com/gateway/downloader/sale/image-63f32e1c-c87a-4765-b987-60cf4b8d6422.png_560_420.jpeg',
  isFollowed: false,
  followerCount: 2,
  startYear: 2019,
  totalArea: '',
  overallDescription: '',
  investorOwnerLogo:
    'https://sandbox-citus.topenland.com/gateway/downloader/sale/image-2fc2b6b2-1479-42f3-92e0-4b9362f6bee5.png_100_100.jpeg',
  projectStatusId: '966d2a2a-dd36-45d8-b4da-a73a1acc576b',
  backgroundStatus: {backgroundColor: '#E53030'},
  projectStatusName: '??ang m??? b??n',
  investorOwnerName: 'investor1 update 28t5',
  projectName: 'Test update filter 2',
  projectAddress: '2 2, B??nh H??ng, B??nh Ch??nh, H??? Ch?? Minh.',
  commissionRates: '',
  minPrice: '2.5 t???',
  propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
};

const C2CITems = [
  {
    propertyPostId: 'fd6baedf-9037-42eb-bb9e-fbf4e3020ea2',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    images:
      'https://perstoresb.blob.core.windows.net/images-sb/web_425x240_1655978331664_b8772ef8303f4eb2a7012c2551f60c61.jpg',
    isFollowed: false,
    isAgent: true,
    address: 'test, B??nh Chi???u, Th??nh ph??? Th??? ?????c, H??? Ch?? Minh.',
    title: 'Nhap cho du 10 ky tu',
    numberOfBedrooms: 1,
    numberOfBathrooms: 1,
    buildingArea: 100,
    direction: '????ng',
    price: '2 t???',
    propertyCode: 'MTD1022',
    commission: '2%',
    brokenAvatar:
      'https://perstoresb.blob.core.windows.net/upload/1652771660884_a356630052114061a9e2804073b37e27.png',
    brokenName: 'Nguy???n T???n',
    brokenRank: 'rank1',
    brokenRating: 0,
    brokenPhone: '0765154444',
    brokenEmail: 'tannguyenvan_2@nomail.com',
    forRent: false,
    forSale: true,
    isSold: false,
    latitude: 10.8802425,
    longitude: 106.7444747,
    isRented: false,
    isGuaranteed: false,
    contractStatus: '',
    isRequestedUpdate: false,
    isRejected: false,
    isCreatedUser: false,
    imagesSize: 3,
    propertyPostApprovalStatusName: '',
    createdDatetime: '24/06/2022',
    statusStyle: {backgroundColor: '#EBEFFF'},
    statusTextStyle: {color: '#1F3A99'},
    showForRentBanner: true,
    status: '???? duy???t',
  },
  {
    propertyPostId: '0585bb0f-ccbb-4253-b0f5-baff9cef504a',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    images:
      'https://perstoresb.blob.core.windows.net/images-sb/web_425x240_1655863726327_c40274466b654444aac4a086b6197ad4.jpg',
    isFollowed: false,
    isAgent: true,
    address: 'K??nh Ba B??, B??nh Chi???u, Th??nh ph??? Th??? ?????c, H??? Ch?? Minh.',
    title: 'C???n b??n c??n h??? - 50m2 - 5 t??? - Th??nh ph??? Th??? ?????c',
    numberOfBedrooms: 1,
    numberOfBathrooms: 1,
    buildingArea: 50,
    direction: 'B???c',
    price: '5 t???',
    propertyCode: 'MTD1020',
    commission: '1%',
    brokenAvatar:
      'https://perstoresb.blob.core.windows.net/upload/1655860918283_fb2ce82a55d04eaf8b30e0ef78cc1e78.png',
    brokenName: 'Phong FO',
    brokenRank: 'rank1',
    brokenRating: 0,
    brokenPhone: '0919600300',
    brokenEmail: 'phong_fo@sharklasers.com',
    forRent: false,
    forSale: true,
    isSold: false,
    latitude: 10.88241775689748,
    longitude: 106.726043965056,
    isRented: false,
    isGuaranteed: false,
    contractStatus: '',
    isRequestedUpdate: false,
    isRejected: false,
    isCreatedUser: false,
    imagesSize: 3,
    propertyPostApprovalStatusName: '',
    createdDatetime: '24/06/2022',
    statusStyle: {backgroundColor: '#EBEFFF'},
    statusTextStyle: {color: '#1F3A99'},
    showForRentBanner: true,
    status: '???? duy???t',
  },
  {
    propertyPostId: '675d0ff1-5037-4194-bf9a-8bc572e3ac5e',
    propertyTypeId: '48cceac6-e202-494d-9b06-2374042f1044',
    images:
      'https://perstoresb.blob.core.windows.net/images-sb/web_425x240_1655858178614_26e45b9e86d448a4b1484dd2675c6e3d.jpg',
    isFollowed: false,
    isAgent: true,
    address: 'HT17, Hi???p Th??nh, Qu???n 12, H??? Ch?? Minh.',
    title: 'B??n c??n bi???t th??? Qu???n 12 hot',
    numberOfBedrooms: 5,
    numberOfBathrooms: 5,
    buildingArea: 120,
    direction: 'T??y Nam',
    price: '7.5 t???',
    propertyCode: 'MTD1019',
    commission: '500 tri???u',
    brokenAvatar:
      'https://perstoresb.blob.core.windows.net/upload/1653298179747_7e5b12c444ae4c50b87c22cf0984ecf2.png',
    brokenName: 'Nguy???n V?? TP1',
    brokenRank: 'rank1',
    brokenRating: 0,
    brokenPhone: '0000005626',
    brokenEmail: 'vntopener1@nomail.com',
    forRent: false,
    forSale: true,
    isSold: false,
    latitude: 10.8758943,
    longitude: 106.6356113,
    isRented: false,
    isGuaranteed: false,
    contractStatus: '',
    isRequestedUpdate: false,
    isRejected: false,
    isCreatedUser: false,
    imagesSize: 5,
    propertyPostApprovalStatusName: '',
    createdDatetime: '24/06/2022',
    statusStyle: {backgroundColor: '#EBEFFF'},
    statusTextStyle: {color: '#1F3A99'},
    showForRentBanner: true,
    status: '???? duy???t',
  },
  {
    propertyPostId: 'a40589ff-1328-4907-9357-25fcd33c1e52',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    images:
      'https://perstoresb.blob.core.windows.net/images-sb/web_425x240_1655365463128_a1a1f596d1df468ca86e0eb65f2c93f4.jpg',
    isFollowed: false,
    isAgent: true,
    address: '45, B??nh Thu???n, Qu???n 7, H??? Ch?? Minh.',
    title: 'C???n b??n c??n h??? ch??nh ch??? - 100m2 - 1 pn - 1 wc - 1 t??? - Qu???n 7',
    numberOfBedrooms: 1,
    numberOfBathrooms: 1,
    buildingArea: 100,
    direction: '????ng Nam',
    price: '1 t???',
    propertyCode: 'MTD1015',
    commission: '0%',
    brokenAvatar:
      'https://perstoresb.blob.core.windows.net/upload/1654253445114_143b87c97a68472ca4be4b98e69b7376.jpg',
    brokenName:
      'topener T??n R???t D??i N??n ?????ng C?? ?????c H???t, Ch??? ????? Test Th??i. M?? L??? ?????c R???i Th?? Test D??m Lu??n :D',
    brokenRank: 'rank1',
    brokenRating: 0,
    brokenPhone: '0022337476',
    brokenEmail: 'topener102@mail.com',
    forRent: false,
    forSale: true,
    isSold: false,
    latitude: 10.747281,
    longitude: 106.726874,
    isRented: false,
    isGuaranteed: false,
    contractStatus: '',
    isRequestedUpdate: false,
    isRejected: false,
    isCreatedUser: false,
    imagesSize: 3,
    propertyPostApprovalStatusName: '',
    createdDatetime: '24/06/2022',
    statusStyle: {backgroundColor: '#EBEFFF'},
    statusTextStyle: {color: '#1F3A99'},
    showForRentBanner: true,
    status: '???? duy???t',
  },
  {
    propertyPostId: '14a839bc-f8d5-4d00-ad90-766b23f17750',
    propertyTypeId: '48cceac6-e202-494d-9b06-2374042f1044',
    images:
      'https://perstoresb.blob.core.windows.net/images/web_425x240_1651117060393_c678653b08f94e30b4822321f0c92582.jpg',
    isFollowed: false,
    isAgent: true,
    address: '111, An L???c, B??nh T??n, H??? Ch?? Minh.',
    title: 'C???n b??n bi???t th??? ch??nh ch??? h???m 1m - 1000m2 - 1 pn - 1 wc - 100 T??? - B??nh T??n',
    numberOfBedrooms: 1,
    numberOfBathrooms: 1,
    buildingArea: 1000,
    direction: '????ng Nam',
    price: '100 t???',
    propertyCode: 'MTD892',
    commission: '20%',
    brokenAvatar: 'https://perstoresb.blob.core.windows.net/upload/1645776325555_image.png',
    brokenName: '????o To???n',
    brokenRank: 'rank1',
    brokenRating: 0,
    brokenPhone: '0912912912',
    brokenEmail: 'toandn+100@gmail.com',
    forRent: false,
    forSale: true,
    isSold: false,
    latitude: 10.7231349,
    longitude: 106.6111242,
    isRented: false,
    isGuaranteed: false,
    contractStatus: '',
    isRequestedUpdate: false,
    isRejected: false,
    isCreatedUser: false,
    imagesSize: 3,
    propertyPostApprovalStatusName: '',
    createdDatetime: '24/06/2022',
    statusStyle: {backgroundColor: '#EBEFFF'},
    statusTextStyle: {color: '#1F3A99'},
    showForRentBanner: true,
    status: '???? duy???t',
  },
  {
    propertyPostId: '59cfb24e-0d55-4dbc-8672-383e1fb2f356',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    images:
      'https://perstoresb.blob.core.windows.net/images/web_425x240_1652261595934_2d922eb2b5b9409bb3f1dd91df1c2c84.jpg',
    isFollowed: false,
    isAgent: true,
    address: '22, B??nh Chi???u, Th??nh ph??? Th??? ?????c, H??? Ch?? Minh.',
    title: 'C???n b??n c??n h??? ch??nh ch??? - 22m2 - 1 pn - 1 wc - 2.2 t??? - Th??nh ph??? Th??? ?????c',
    numberOfBedrooms: 1,
    numberOfBathrooms: 1,
    buildingArea: 22,
    direction: '????ng',
    price: '2.2 t???',
    propertyCode: 'MTD937',
    commission: '2%',
    brokenAvatar:
      'https://perstoresb.blob.core.windows.net/upload/1652771660884_a356630052114061a9e2804073b37e27.png',
    brokenName: 'Nguy???n T???n',
    brokenRank: 'rank1',
    brokenRating: 0,
    brokenPhone: '0765154444',
    brokenEmail: 'tannguyenvan_2@nomail.com',
    forRent: false,
    forSale: true,
    isSold: false,
    latitude: 10.8802425,
    longitude: 106.7444747,
    isRented: false,
    isGuaranteed: false,
    contractStatus: '',
    isRequestedUpdate: false,
    isRejected: false,
    isCreatedUser: false,
    imagesSize: 3,
    propertyPostApprovalStatusName: '',
    createdDatetime: '24/06/2022',
    statusStyle: {backgroundColor: '#EBEFFF'},
    statusTextStyle: {color: '#1F3A99'},
    showForRentBanner: true,
    status: '???? duy???t',
  },
  {
    propertyPostId: '738a3a5c-efcd-4f15-a662-3f906bb9413a',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    images:
      'https://perstoresb.blob.core.windows.net/images/web_425x240_1652255674115_63cc499cd8a3434eaa4ff91498622853.jpg',
    isFollowed: false,
    isAgent: true,
    address: 'S??? 22, B??nh Chi???u, Th??nh ph??? Th??? ?????c, H??? Ch?? Minh.',
    title: 'c??n h??? pyris 8',
    numberOfBedrooms: 3,
    numberOfBathrooms: 1,
    buildingArea: 22,
    direction: '????ng',
    price: '4.2 t???',
    propertyCode: 'MTD934',
    commission: '5%',
    brokenAvatar:
      'https://perstoresb.blob.core.windows.net/upload/1652771660884_a356630052114061a9e2804073b37e27.png',
    brokenName: 'Nguy???n T???n',
    brokenRank: 'rank1',
    brokenRating: 0,
    brokenPhone: '0765154444',
    brokenEmail: 'tannguyenvan_2@nomail.com',
    forRent: false,
    forSale: true,
    isSold: false,
    latitude: 10.8775897,
    longitude: 106.7264125,
    isRented: false,
    isGuaranteed: false,
    contractStatus: '',
    isRequestedUpdate: false,
    isRejected: false,
    isCreatedUser: false,
    imagesSize: 3,
    propertyPostApprovalStatusName: '',
    createdDatetime: '24/06/2022',
    statusStyle: {backgroundColor: '#EBEFFF'},
    statusTextStyle: {color: '#1F3A99'},
    showForRentBanner: true,
    status: '???? duy???t',
  },
];

const B2CItems = [
  {
    __typename: 'SearchProjectInfoDto',
    projectId: '19d02a75-9bcd-4286-9fa6-70069b5e2804',
    isFollowed: false,
    totalFollower: 1,
    totalShare: 0,
    projectName: 'D??? ??n Test',
    projectCode: 'MDA00510',
    latitude: 10.8830404,
    longitude: 106.7264125,
    minPrice: 0,
    startYear: 2020,
    totalArea: '',
    overallDescription: '',
    commissionRates: '',
    projectStatusName: '??ang m??? b??n',
    featurePhotos:
      'https://perstoresb.blob.core.windows.net/images/1655695617511_b48303580b8144e4a1d517fac68f26de.png_560_420.jpeg',
    investorOwnerName: 'Vinhome New 15/6',
    investorOwnerLogo:
      'https://perstoresb.blob.core.windows.net/images/1655280123113_ebd644b55b3840ae88e59950ae17f678.png_100_100.jpeg',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    projectStatusId: '966d2a2a-dd36-45d8-b4da-a73a1acc576b',
    projectTypeName: null,
    isFeaturesProject: false,
    projectAddress: {
      __typename: 'ProjectAddressInfoDto',
      cityId: 1,
      countryId: 0,
      districtId: 24,
      wardId: 315,
      homeAddress: '12',
      streetName: '12',
      cityName: 'H??? Ch?? Minh',
      districtName: 'Th??nh ph??? Th??? ?????c',
      wardName: 'B??nh Chi???u',
    },
  },
  {
    __typename: 'SearchProjectInfoDto',
    projectId: '894e6d45-c311-414d-914b-e1afcfaa8564',
    isFollowed: false,
    totalFollower: 0,
    totalShare: 0,
    projectName: 'Test SMS',
    projectCode: 'MDA00505',
    latitude: 10.8830404,
    longitude: 106.7264125,
    minPrice: '0',
    startYear: 0,
    totalArea: '',
    overallDescription: '',
    commissionRates: '',
    projectStatusName: '??ang m??? b??n',
    featurePhotos:
      'https://perstoresb.blob.core.windows.net/images/1655258941703_86f6a857ea28465cbe2b0e8fa7374349.png_560_420.jpeg',
    investorOwnerName: 'H',
    investorOwnerLogo:
      'https://perstoresb.blob.core.windows.net/images/1655258954974_c96b63c8fe824e9fbd9c6bc88bbc9caa.png_100_100.jpeg',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    projectStatusId: '966d2a2a-dd36-45d8-b4da-a73a1acc576b',
    projectTypeName: null,
    isFeaturesProject: false,
    projectAddress: {
      __typename: 'ProjectAddressInfoDto',
      cityId: 1,
      countryId: 0,
      districtId: 24,
      wardId: 315,
      homeAddress: '111',
      streetName: 'abc',
      cityName: 'H??? Ch?? Minh',
      districtName: 'Th??nh ph??? Th??? ?????c',
      wardName: 'B??nh Chi???u',
    },
  },
  {
    __typename: 'SearchProjectInfoDto',
    projectId: '80a90596-a508-49e1-bc4e-02b392aa1ea9',
    isFollowed: false,
    totalFollower: 0,
    totalShare: 0,
    projectName: 'New Moon Ha Noi',
    projectCode: 'MDA00504',
    latitude: 21.0231565,
    longitude: 105.8116322,
    minPrice: '33000000000',
    startYear: 1990,
    totalArea: '22',
    overallDescription: '',
    commissionRates: '',
    projectStatusName: '??ang m??? b??n',
    featurePhotos:
      'https://perstoresb.blob.core.windows.net/images/image-4475ec66-c716-41f4-b665-b1cc5fbf8ef4.png_560_420.jpeg',
    investorOwnerName: 'Inovative',
    investorOwnerLogo:
      'https://perstoresb.blob.core.windows.net/images/image-ea010228-d84f-46f3-868f-f288ae234bc9.png_100_100.jpeg',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    projectStatusId: '966d2a2a-dd36-45d8-b4da-a73a1acc576b',
    projectTypeName: null,
    isFeaturesProject: false,
    projectAddress: {
      __typename: 'ProjectAddressInfoDto',
      cityId: 2,
      countryId: 0,
      districtId: 25,
      wardId: 327,
      homeAddress: '12',
      streetName: 'D3',
      cityName: 'H?? N???i',
      districtName: 'Ba ????nh',
      wardName: 'C????ng Vi??',
    },
  },
  {
    __typename: 'SearchProjectInfoDto',
    projectId: '82add9e1-ecea-4ff1-8b4b-c64a50e9c117',
    isFollowed: false,
    totalFollower: 0,
    totalShare: 0,
    projectName: 'D??? ??n C??n C??n H??? AB',
    projectCode: 'MDA00503',
    latitude: 21.0352802,
    longitude: 105.8092161,
    minPrice: 33000000000,
    startYear: 1990,
    totalArea: '100',
    overallDescription: '',
    commissionRates: '1',
    projectStatusName: 'S???p m??? b??n',
    featurePhotos:
      'https://sandbox-citus.topenland.com/gateway/downloader/sale/image-08b30589-fcce-478c-b812-70c47fae90f9.png_560_420.jpeg',
    investorOwnerName: 'CD 1',
    investorOwnerLogo:
      'https://sandbox-citus.topenland.com/gateway/downloader/sale/image-3ca02905-92ab-4599-8de6-42fd46d7f9bf.png_100_100.jpeg',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    projectStatusId: '097a447c-e510-4262-a0f5-a3531feabf21',
    projectTypeName: null,
    isFeaturesProject: false,
    projectAddress: {
      __typename: 'ProjectAddressInfoDto',
      cityId: 2,
      countryId: 0,
      districtId: 25,
      wardId: 327,
      homeAddress: '2',
      streetName: 'T?? Hi???n Thanh',
      cityName: 'H?? N???i',
      districtName: 'Ba ????nh',
      wardName: 'C????ng Vi??',
    },
  },
  {
    __typename: 'SearchProjectInfoDto',
    projectId: '3a77c2de-36a2-4f69-b8c3-c7b96d4b4678',
    isFollowed: false,
    totalFollower: 2,
    totalShare: 0,
    projectName: 'Test update filter 2',
    projectCode: 'MDA00492',
    latitude: 10.7200104,
    longitude: 106.6703963,
    minPrice: '2500000000',
    startYear: 2019,
    totalArea: '',
    overallDescription: '',
    commissionRates: '',
    projectStatusName: '??ang m??? b??n',
    featurePhotos:
      'https://sandbox-citus.topenland.com/gateway/downloader/sale/image-63f32e1c-c87a-4765-b987-60cf4b8d6422.png_560_420.jpeg',
    investorOwnerName: 'investor1 update 28t5',
    investorOwnerLogo:
      'https://sandbox-citus.topenland.com/gateway/downloader/sale/image-2fc2b6b2-1479-42f3-92e0-4b9362f6bee5.png_100_100.jpeg',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    projectStatusId: '966d2a2a-dd36-45d8-b4da-a73a1acc576b',
    projectTypeName: null,
    isFeaturesProject: false,
    projectAddress: {
      __typename: 'ProjectAddressInfoDto',
      cityId: 1,
      countryId: 0,
      districtId: 1,
      wardId: 3,
      homeAddress: '2',
      streetName: '2',
      cityName: 'H??? Ch?? Minh',
      districtName: 'B??nh Ch??nh',
      wardName: 'B??nh H??ng',
    },
  },
];

const props = {
  actions: {},
  loading: false,
  totalCount: 443,
  otherProps: {
    queryOptions: {
      variables: {
        input: {
          keyword: '',
          propertyTypeJson: '[]',
          placeJson: '[]',
          pageSize: 20,
          page: 1,
          orderBy: 'LATEST',
          featureProject: null,
          projectStatus: '',
        },
      },
    },
    uniqueKey: 'projectId',
    pagingType: 'OFFSET',
  },
};
