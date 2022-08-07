import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../../../storybook/utils/configDecorator';
import RequestDetailInfoView from './RequestDetailInfoView';

storiesOf('z|c2c/RequestDetailInfoView', module)
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('default', () => {
    return <RequestDetailInfoView isTesting={true} visibleTransaction isB2C={true} {...data} />;
  })
  .add('Request Detail C2C', () => {
    return <RequestDetailInfoView isTesting={true} visibleTransaction isB2C={false} {...data} />;
  });

const data = {
  state: {
    contactTradingInfo: {
      contactTradingId: '5896f1ab-30e7-454c-ac11-4515afecf874',
      requestCode: 'CT-101',
      assigneeId: 'ac26ca86-3455-43a8-a7e7-09b0a6e9a0d7',
      fullName: 'nguyen nhutv1',
      email: 'nhuqa8@gmail.com',
      phoneNumber: '0007721231',
      createdDate: '20/04/2021 13:53',
      updatedDate: '20/04/2021 13:53',
      priceRange: 2000000000,
      propertyTypeId: '48cceac6-e202-494d-9b06-2374042f1044',
      BDSPropertyType: 'Biệt thự',
      propertyPostId: '1712d769-5210-40b6-85f0-ac33df311f30',
      cityId: 10,
      districtId: 146,
      contactType: 'BUY',
      isFavorite: true,
      description: 'Đây là ghi chú',
      propertyPostInfo: {
        postId: 'MTD76',
        project: 'Richmond City',
        projectId: '',
        interestedNeighborhood: 'Xuyên Mộc, Bà Rịa Vũng Tàu',
        priceRange: 2000000000,
        areaMeasurement: '24 m²',
        direction: 'EAST',
        block: 'ruby',
        floor: 1,
        note: 'Đây là note',
      },
      assigneeFullName: 'TPL Kim-Consultant-Lead',
      assigneePhoneNumber: '0000333333',
      assigneeEmail: 'kimconsultantlead@nomail.com',
      assigneeProfilePhoto:
        'https://qa-citus.topenland.com/gateway/downloader/personal/image-af779bf9-2d08-4955-8280-ae08b698f08c.png',
    },
    rawData: {},
    isAtleastGoldUser: true,
    agentInfo: {
      gender: 'NA',
      phoneNumber: '0353230665',
      userId: '5f2589e4-005a-4531-a3ab-e0403554c681',
      email: 'ththinh11396@gmail.com',
      firstName: 'agentconfirm',
      lastName: '',
      rankId: 2,
      address: {
        city: {key: 4, label: 'Bình Dương', value: 4},
        ward: {key: 1017, label: 'Vĩnh Hòa', value: 1017},
        street: 'dt 743',
        district: {key: 67, label: 'Phú Giáo', value: 67},
      },
      agentAddress:
        '{"cityId": 4, "wardId": 1017, "placeId": "ChIJYz7jfxu5dDERb-0v7fpv7Iw", "cityName": "Bình Dương", "latitude": 11.2655822, "wardName": "Vĩnh Hòa", "longitude": 106.7706458, "districtId": 67, "streetName": "dt 743", "districtName": "Phú Giáo"}',
    },
    summarySentDetailCount: {},
    masterData: {
      contactTradingStatus: {
        __typename: 'OffsetPagingOfContactTradingStatusDto',
        edges: [
          {
            __typename: 'ContactTradingStatusDto',
            contactTradingStatusName: 'New',
            contactTradingStatusId: '722d95b4-dca6-4586-ba4d-6e0ad335ce97',
            contactTradingStatusDescription: 'Mới',
          },
        ],
      },
      contactTradingRelevantPropertyStatus: {
        __typename: 'OffsetPagingOfContactTradingRelevantPropertyStatusDto',
        edges: [
          {
            __typename: 'ContactTradingRelevantPropertyStatusDto',
            contactTradingPropertyConsultationStatusId: '3714a762-495d-4c0d-8ed8-bf97d0afe4e2',
            contactTradingPropertyConsultationStatusName: 'Matching',
            contactTradingPropertyConsultationStatusDescription: 'Phù hợp',
          },
        ],
      },
      projectStatus: {
        __typename: 'OffsetPagingOfProjectStatusDto',
        edges: [
          {
            __typename: 'ProjectStatusDto',
            projectStatusName: 'comingsoon',
            projectStatusId: '097a447c-e510-4262-a0f5-a3531feabf21',
            projectStatusDescription: 'Sắp mở bán',
          },
        ],
      },
      saleSeasonStatuses: {
        __typename: 'OffsetPagingOfSaleSeasonStatusDto',
        edges: [
          {
            __typename: 'SaleSeasonStatusDto',
            saleSeasonStatusId: '3a3d3a88-0da7-4274-8dc2-303eb26f335e',
            saleSeasonStatusName: 'New',
            saleSeasonStatusDescription: 'Mới',
          },
        ],
      },
      saleTrackingStatus: {
        __typename: 'OffsetPagingOfSaleTrackingStatusDto',
        edges: [
          {
            __typename: 'SaleTrackingStatusDto',
            saleTrackingStatusId: '01c246f6-95f7-4a4d-8608-1f2a16e068a4',
            saleTrackingStatusName: 'sold',
            saleTrackingStatusDescription: 'Đã bán',
          },
        ],
      },
      bookingStatus: {
        __typename: 'OffsetPagingOfBookingStatusDto',
        edges: [
          {
            __typename: 'BookingStatusDto',
            bookingStatusId: '6e09af5f-3559-416c-8bbe-bfd7bf29d224',
            bookingStatusName: 'booking_completed',
            bookingStatusDescription: 'Hoàn tất đặt chỗ',
          },
        ],
      },
      projectPostStatus: {
        __typename: 'OffsetPagingOfProjectPostStatusDto',
        edges: [
          {
            __typename: 'ProjectPostStatusDto',
            projectPostStatusName: 'public',
            projectPostStatusId: '04eeb960-5fa3-4f59-a375-c3a4ac0c37dc',
            projectPostStatusDescription: 'Đang đăng',
          },
        ],
      },
      agentRankings: {
        __typename: 'OffsetPagingOfAgentRankingDto',
        totalCount: 5,
        edges: [
          {
            __typename: 'AgentRankingDto',
            agentRankingId: '1645cfca-98bf-49c5-844e-f9a5b61964c0',
            agentRankingName: 'rank5',
            agentRankingDescription: 'Diamond Plus',
          },
        ],
      },
      propertyTypes: {
        __typename: 'OffsetPagingOfPropertyTypeDto',
        edges: [
          {
            __typename: 'PropertyTypeDto',
            propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
            propertyTypeName: 'apartment',
            propertyTypeDescription: 'Căn hộ',
            isActive: true,
          },
        ],
      },
      propertyPostStatus: {
        __typename: 'OffsetPagingOfPropertyPostStatusDto',
        edges: [
          {
            __typename: 'PropertyPostStatusDto',
            propertyPostStatusId: '053b8b22-6f83-41bd-a13c-2f7d617fdbf1',
            propertyPostStatusName: 'available',
            propertyPostStatusDescription: 'Đang không sử dụng',
            isActive: false,
          },
        ],
      },
      legalInfoes: {
        __typename: 'OffsetPagingOfLegalInfoDto',
        edges: [
          {
            __typename: 'LegalInfoDto',
            legalInfoId: '330b1232-692e-4e5b-988f-f2ae95e6ff3d',
            legalInfoName: 'hand-documents-notarized',
            legalInfoDescription: 'Giấy tay, công chứng',
            isActive: false,
            isDeleted: false,
          },
        ],
      },
      banks: {
        __typename: 'OffsetPagingOfBankDto',
        edges: [
          {
            __typename: 'BankDto',
            bankId: '6706039e-2e93-4519-bfb7-a7ffcc606447',
            bankName: 'Ngân hàng Ngoại thương Việt Nam',
            bankDescription: null,
            bankCode: 'VCB',
            isActive: false,
          },
        ],
      },
      unitOfMeasures: {
        __typename: 'OffsetPagingOfUnitOfMeasureDto',
        edges: [
          {
            __typename: 'UnitOfMeasureDto',
            unitOfMeasureId: '2e1b0f25-2772-4d71-aca1-9bd0c8fb9a74',
            unitOfMeasureName: 'Tỷ',
            unitOfMeasureCode: 'billion',
            multiplyWithBaseUnit: 1000000000,
            isRound: true,
          },
        ],
      },
      propertyPostApprovalStatus: {
        __typename: 'OffsetPagingOfPropertyPostApprovalStatusDto',
        totalCount: 7,
        edges: [
          {
            __typename: 'PropertyPostApprovalStatusDto',
            propertyPostApprovalStatusId: '23801694-3ab0-4854-b599-5f9b9b9b36d8',
            propertyPostApprovalStatusName: 'waiting',
            propertyPostApprovalStatusDescription: 'Đang chờ duyệt',
          },
        ],
      },
      postTypes: {
        __typename: 'OffsetPagingOfPostTypeDto',
        edges: [
          {
            __typename: 'PostTypeDto',
            postTypeId: '8fc6b7e6-32a0-4874-8a2e-6035df6b7426',
            postTypeName: 'B2C',
          },
        ],
      },
      cities: {
        __typename: 'OffsetPagingOfCityDto',
        totalCount: 63,
        edges: [
          {__typename: 'CityDto', cityId: 1, cityName: 'Hồ Chí Minh'},
          {__typename: 'CityDto', cityId: 2, cityName: 'Hà Nội'},
        ],
      },
      pendingReasons: {
        __typename: 'OffsetPagingOfPendingReasonDto',
        edges: [
          {
            __typename: 'PendingReasonDto',
            pendingReasonId: '48b426a1-86e8-456d-88ca-96e51f1cdd9d',
            pendingReasonName: 'HaveNotFoundTheRightProduct',
            pendingReasonDescription: 'Chưa tìm được sản phẩm phù hợp',
          },
        ],
      },
    },
    isSending: false,
    isEdit: false,
  },
};
