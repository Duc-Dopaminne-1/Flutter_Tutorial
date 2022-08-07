import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../storybook/utils/configDecorator';
import {PropertyChangeConfirmView} from './PropertyChangeConfirmScreen';

storiesOf('z|b2c/PropertyChangeConfirm', module)
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  ) //format
  .add('default', () => {
    return (
      <>
        <PropertyChangeConfirmView {...props} />
      </>
    );
  });

const props = {
  screenTitle: 'Xác nhận chuyển đổi',
  changeType: 'deposit',
  originalProperty: {
    blockCode: 'Hot',
    blockName: 'Kindy',
    numberOfFloor: null,
    floor: '2',
    price: 0.25,
    priceVat: 21,
    priceNoVat: 20,
    propertyCode: 'CH-316001',
    propertyName: null,
    propertyPostId: '8cefb119-c69f-42e9-a1a8-c0492960604d',
    propertyTypeName: 'apartment',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    projectInfo: {
      projectCode: 'MDA00511',
      projectName: 'test bug',
    },
    saleSeasonInfo: {
      seasonName: null,
      isSkipBooking: false,
      startBookingDatetime: 1655698200000,
      endBookingDatetime: 1655698800000,
      openDatetime: 1655699100000,
      closeDatetime: 1655699400000,
    },
  },
  consultantInfo: {
    staffId: 'cfc4a6d9-a654-46d0-90b6-656343c39387',
    staffCode: 'MCV000000042',
    fullName: 'staff6',
    profilePhoto: null,
    email: 'staff6@nomail.com',
    rating: null,
    phoneNumber: '0292338383',
  },
  newProperty: {
    errorCode: 0,
    errorMessage: null,
    errorMessageCode: null,
    isSaleAgent: true,
    propertyPostId: '9cb0f898-80a4-4c30-95ea-f3f6d7e2a6d6',
    propertyType: 'apartment',
    propertyTypeName: 'apartment',
    propertyTypeDescription: 'Căn hộ',
    propertyCode: 'CH-316003',
    projectName: 'test bug',
    projectCode: 'MDA00511',
    projectId: 'c3fc0e71-86d8-47d3-83c6-d7bcbef29b3c',
    floorOrSubAreaCode: 'Kindy',
    images: [],
    price: '0 VND',
    propertyPrice: '21 VND',
    expectedPrice: '30',
    commission: '0%',
    buyCommission: '1%',
    saleCommission: '0%',
    numberOfBooking: null,
    staffGroupIds: '["48c89c57-0123-43eb-8b99-450e739e6281"]',
    width: 'null m',
    length: 'null m',
    postDescription: '',
    propertySubTypeDescription: 'Chung cư',
    floor: '2',
    direction: 'Đông Nam',
    balconyDirection: 'NULL',
    numberOfBedrooms: 2,
    numberOfBathrooms: 1,
    heartWellArea: '85 m²',
    clearedArea: '75 m²',
    saleTrackingStatus: 'Đang mở đặt cọc',
    bookingFee: '10.000 VND',
    houseDesign: null,
    numberOfFloor: null,
    tower: 'Kindy',
    totalSiteArea: '0 m²',
    buildingArea: '85 m²',
    capetArea: '75 m²',
    buildingLine: '',
    blockName: 'Kindy',
    saleSeasonId: 'd57722b4-3fb1-4b0e-bc41-231478e521a3',
    isBooked: null,
    ableConfirmDeposite: true,
    bookingTransactionInfo: null,
    contextType: 'MoveDeposit',
    isDeposited: false,
    rawPrice: 0.25,
    isAgentUser: true,
    currentMode: 'MODE_MOVE_DEPOSIT',
    rawBookingFee: 10000,
    detailPath: null,
    timeUpdate: '2022-06-20T10:33:24.323Z',
  },
  policies: [],
  propertyChangeable: false,
  confirmButtonText: 'Chuyển sản phẩm',
  isShowSuccessPopup: false,
  project: {
    __typename: 'ProjectInfoDto',
    projectId: 'c3fc0e71-86d8-47d3-83c6-d7bcbef29b3c',
    projectCode: 'MDA00511',
    projectName: 'test bug',
    saleSeasonInfo: {
      saleSeasonId: 'd57722b4-3fb1-4b0e-bc41-231478e521a3',
      seasonName: null,
      isSkipBooking: false,
      startBookingDatetime: 1655698200000,
      endBookingDatetime: 1655698800000,
      openDatetime: 1655699100000,
      closeDatetime: 1655699400000,
    },
    projectStatus: 'MODE_MOVE_DEPOSIT',
  },
};
