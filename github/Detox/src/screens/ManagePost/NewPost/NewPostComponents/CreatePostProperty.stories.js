/* eslint-disable sonarjs/no-duplicate-string */
import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../../../storybook/utils/configDecorator';
import {GeneralDescriptionView} from './GeneralDescriptionContainer';
import NewPostContactInfoContainer from './NewPostContactInfoContainer';

storiesOf('z|c2c/CreatePostProperty', module)
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('step 1: Thông tin liên hệ', () => {
    return <NewPostContactInfoContainer {...props} />;
  })
  .add('step 2: Thông tin BĐS', () => {
    return <GeneralDescriptionView isTesting={true} {...props2} />;
  });

const masterData = {
  contactTradingStatus: {
    __typename: 'OffsetPagingOfContactTradingStatusDto',
    edges: [
      {
        __typename: 'ContactTradingStatusDto',
        contactTradingStatusName: 'Waiting',
        contactTradingStatusId: '722d95b4-dca6-4586-ba4d-6e0ad335ce97',
        contactTradingStatusDescription: 'Chờ xác nhận',
      },
      {
        __typename: 'ContactTradingStatusDto',
        contactTradingStatusName: 'Connected',
        contactTradingStatusId: '399108dc-0b43-428a-8fa6-e70accd4f929',
        contactTradingStatusDescription: 'Két nối',
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
      {
        __typename: 'ContactTradingRelevantPropertyStatusDto',
        contactTradingPropertyConsultationStatusId: '1b15575c-50c3-49bf-93dd-625e3982f5de',
        contactTradingPropertyConsultationStatusName: 'Favorite',
        contactTradingPropertyConsultationStatusDescription: 'Yêu thích',
      },
      {
        __typename: 'ContactTradingRelevantPropertyStatusDto',
        contactTradingPropertyConsultationStatusId: 'bec5f5f6-9cdf-4140-a438-968111c7d7c3',
        contactTradingPropertyConsultationStatusName: 'Unsuccessful',
        contactTradingPropertyConsultationStatusDescription: 'Không thành công',
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
      {
        __typename: 'ProjectStatusDto',
        projectStatusName: 'open',
        projectStatusId: '966d2a2a-dd36-45d8-b4da-a73a1acc576b',
        projectStatusDescription: 'Đang mở bán',
      },
      {
        __typename: 'ProjectStatusDto',
        projectStatusName: 'sold',
        projectStatusId: '18363157-595f-47dd-84ef-5c3dca6a8676',
        projectStatusDescription: 'Đã bán',
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
      {
        __typename: 'SaleSeasonStatusDto',
        saleSeasonStatusId: '60401950-f147-4140-977e-297aeac1eb2a',
        saleSeasonStatusName: 'ReservationOpening',
        saleSeasonStatusDescription: 'Đang mở đặt chỗ',
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
      {
        __typename: 'SaleTrackingStatusDto',
        saleTrackingStatusId: '83ba9e1d-8d0b-47e3-906f-ba633110ac54',
        saleTrackingStatusName: 'pile-outside',
        saleTrackingStatusDescription: 'Đã cọc bên ngoài',
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
      {
        __typename: 'BookingStatusDto',
        bookingStatusId: 'ae97bb9b-7696-4c57-8d28-c75444981e04',
        bookingStatusName: 'sold',
        bookingStatusDescription: 'Đã bán',
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
      {
        __typename: 'ProjectPostStatusDto',
        projectPostStatusName: 'hidden',
        projectPostStatusId: '42c5f36b-993b-49c6-afaa-4ade3b33b12d',
        projectPostStatusDescription: 'Đang ẩn',
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
      {
        __typename: 'AgentRankingDto',
        agentRankingId: '5901295a-e2de-4075-bf7e-6fe216de6080',
        agentRankingName: 'rank4',
        agentRankingDescription: 'Diamond',
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
      {
        __typename: 'PropertyTypeDto',
        propertyTypeId: '48cceac6-e202-494d-9b06-2374042f1044',
        propertyTypeName: 'villa',
        propertyTypeDescription: 'Biệt thự',
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
      {
        __typename: 'PropertyPostStatusDto',
        propertyPostStatusId: '7f8f1f03-a6ae-4356-a74e-05ec4cdce6e3',
        propertyPostStatusName: 'living',
        propertyPostStatusDescription: 'Đang ở',
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
      {
        __typename: 'LegalInfoDto',
        legalInfoId: '210c9557-df2e-4d52-adef-d7c215f1a5bc',
        legalInfoName: 'contract',
        legalInfoDescription: 'Các loại hợp đồng',
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
      {
        __typename: 'BankDto',
        bankId: '91d42c2b-e1f7-4b91-ae34-550e5942861c',
        bankName: 'Ngân hàng TNHH một thành viên HSBC (Việt Nam)',
        bankDescription: null,
        bankCode: 'HSBC',
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
      {
        __typename: 'UnitOfMeasureDto',
        unitOfMeasureId: 'bba3d3d5-47ef-44fe-a06d-3dd313fb8924',
        unitOfMeasureName: 'Triệu',
        unitOfMeasureCode: 'million',
        multiplyWithBaseUnit: 1000000,
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
      {
        __typename: 'PropertyPostApprovalStatusDto',
        propertyPostApprovalStatusId: 'cd55e8d0-4491-4d51-9abe-27321918f1f3',
        propertyPostApprovalStatusName: 'approval',
        propertyPostApprovalStatusDescription: 'Đã duyệt',
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
      {
        __typename: 'PostTypeDto',
        postTypeId: 'd809d587-4a8d-439c-8245-5bab62ab56fb',
        postTypeName: 'C2C',
      },
    ],
  },
  cities: {
    __typename: 'OffsetPagingOfCityDto',
    totalCount: 63,
    edges: [
      {__typename: 'CityDto', cityId: 1, cityName: 'Hồ Chí Minh'},
      {__typename: 'CityDto', cityId: 2, cityName: 'Hà Nội'},
      {__typename: 'CityDto', cityId: 3, cityName: 'Đà Nẵng'},
      {__typename: 'CityDto', cityId: 4, cityName: 'Bình Dương'},
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
      {
        __typename: 'PendingReasonDto',
        pendingReasonId: '0b912ffe-5fa4-476a-95e8-c8c047a47ae6',
        pendingReasonName: 'CannotContactTheCustomer',
        pendingReasonDescription: 'Không liên hệ được với khách hàng',
      },
    ],
  },
  subscriptionPackageStatus: {
    __typename: 'OffsetPagingOfSubscriptionPackageStatusDto',
    edges: [
      {
        __typename: 'SubscriptionPackageStatusDto',
        subscriptionPackageStatusId: 'fc622352-6110-4fc6-89a4-78268ad42d40',
        subscriptionPackageStatusName: 'not_expired_yet',
        subscriptionPackageStatusDescription: 'Chưa hết hạn',
      },
    ],
  },
  internalFacilities: {
    __typename: 'OffsetPagingOfInternalFacilityDto',
    edges: [
      {
        __typename: 'InternalFacilityDto',
        internalFacilityId: '9f433eca-e7cf-4778-8d90-ad87bb1cf30f',
        internalFacilityName: 'Bàn ăn',
        internalFacilityCode: 'InternalFacilityCode1',
      },
      {
        __typename: 'InternalFacilityDto',
        internalFacilityId: 'c4bda6dd-5c9f-490f-88cd-dba752ffb3d7',
        internalFacilityName: 'Bàn đầu giường',
        internalFacilityCode: 'InternalFacilityCode2',
      },
    ],
  },
  nearFacilities: {
    __typename: 'OffsetPagingOfNearFacilityDto',
    edges: [
      {
        __typename: 'NearFacilityDto',
        nearFacilityId: '0620ac3f-0332-4203-afd1-ab8092d2cdd2',
        nearFacilityName: 'Gần chợ / siêu thị',
        nearFacilityCode: 'NearFacilityCode1',
      },
    ],
  },
  fundAccounts: {
    __typename: 'OffsetPagingOfFundAccountDto',
    edges: [
      {
        __typename: 'FundAccountDto',
        cityId: 1,
        fundAccountId: '1d94ed2c-a01d-428d-9d29-47cc47fd9e74',
        fundAccountCode: 0,
        branchAddress: '207 đường Nguyễn Xí, Phường 25, Quận Bình Thạnh, TP.HCM',
        branchName: 'VP TopenLand - Richmond Nguyễn Xí',
        phoneNumber: null,
        faxNumber: null,
        fundEmail: null,
      },
      {
        __typename: 'FundAccountDto',
        cityId: 1,
        fundAccountId: '9cd00003-292d-4ce8-b39e-ba18f591ad57',
        fundAccountCode: 1,
        branchAddress: 'VP Kế toán 110 -112 Trần Quốc Toản, P.Võ Thị Sáu, Q3, TpHCM',
        branchName: 'VP 110 -112 Trần Quốc Toản',
        phoneNumber: '(028) 7307 5888',
        faxNumber: null,
        fundEmail: ' info@hungthinhcorp.com.vn',
      },
      {
        __typename: 'FundAccountDto',
        cityId: 1,
        fundAccountId: '8330cc94-05bd-4351-b768-2aaa492ff3d7',
        fundAccountCode: 2,
        branchAddress: 'Lầu 2 - VP 53 Trần Quốc Thảo, P.Võ Thị Sáu, Q3, TpHCM',
        branchName: 'Lầu 2 - VP 53 Trần Quốc Thảo',
        phoneNumber: '(028) 7307 5888 - 3824 9897',
        faxNumber: '(028) 3934 9142',
        fundEmail: null,
      },
      {
        __typename: 'FundAccountDto',
        cityId: 1,
        fundAccountId: '0b9e0e0b-a46d-4721-a14f-f209827e51d9',
        fundAccountCode: 3,
        branchAddress: 'Lầu 3 - VP 53 Trần Quốc Thảo, P.Võ Thị Sáu, Q3, TpHCM',
        branchName: 'Lầu 3 - VP 53 Trần Quốc Thảo',
        phoneNumber: '(028) 7307 5888 - 3824 9897',
        faxNumber: '(028) 3934 9142',
        fundEmail: null,
      },
    ],
  },
  paymentUnits: {
    __typename: 'OffsetPagingOfPaymentUnitDto',
    edges: [
      {
        __typename: 'PaymentUnitDto',
        paymentUnitId: '39a3cb45-bbb0-48ed-9293-4f8fae630bab',
        paymentMethod: 'EWALLET',
        paymentUnitCode: 0,
        paymentUnitName: 'vnpay',
      },
    ],
  },
  feedObjectTypes: {
    edges: [
      {
        __typename: 'FeedObjectTypeDto',
        feedObjectTypeId: '6703f639-64fa-471e-a317-7c276c83908d',
        feedObjectTypeName: 'project',
        feedObjectTypeDescription: 'Dự án',
        isActive: true,
      },
    ],
    totalCount: 5,
  },
  getContactTradingRejectReasons: {
    __typename: 'OffsetPagingOfContactTradingRejectReasonDto',
    edges: [
      {
        __typename: 'ContactTradingRejectReasonDto',
        contactTradingRejectReasonId: 'e997800c-0071-4ad8-acf5-81b781a0cc7a',
        rejectReasonName: 'NoNeed',
        rejectReasonDescription: 'Không còn nhu cầu giao dịch',
        sortOrder: 1,
        isActive: true,
      },
    ],
  },
  getC2CDepositRejectReasons: {
    __typename: 'OffsetPagingOfC2CDepositRejectReasonDto',
    edges: [
      {
        __typename: 'C2CDepositRejectReasonDto',
        c2CDepositRejectReasonId: '477fefbc-4034-47ab-99db-17618af412cf',
        rejectReasonName: 'NoNeed',
        rejectReasonDescription: 'Không còn nhu cầu giao dịch',
        isActive: true,
        sortOrder: 1,
      },
      {
        __typename: 'C2CDepositRejectReasonDto',
        c2CDepositRejectReasonId: 'cb7b7c23-865f-4ed6-81f0-1798ff180f89',
        rejectReasonName: 'Other',
        rejectReasonDescription: 'Khác',
        isActive: true,
        sortOrder: 4,
      },
    ],
  },
};

const props = {
  dispatch: () => {},
  onWrongMime: () => {},
  onNoPermission: () => {},
  onSelectedImages: () => {},
  onDeleteImage: () => {},
  onChosenOtherServices: () => {},
  onServiceItemPress: () => {},
  onChoosePostServiceType: () => {},
  onChooseGuaranteedPackage: () => {},
  onPackageDetailPress: () => {},
  state: {
    ownerIsAuthor: true,
    ownerEmail: 'topener008@gmail.com',
    ownerName: 'Pham Van Nghe',
    ownerPhoneNumber: '0000000123',
    errorState: {
      ownerEmail: '',
      ownerName: '',
      ownerPhoneNumber: '',
    },
    modalizeState: 'CONFIRM_EDIT',
    legalDocuments: [
      {
        id: 0,
        uri: null,
        name: 'Unknown1',
        size: 0,
        type: 'image/jpeg',
        lastModified: 1638937720521,
      },
      {
        id: 1,
        uri: null,
        name: 'Unknown2',
        size: 0,
        type: 'image/jpeg',
        lastModified: 1638937720521,
      },
    ],
    legalFiles: [],
    editingId: -1,
    otherServiceOptions: [
      {
        id: 'd98ade1b-a88c-405a-a538-37325213419c',
        typeId: 'd98ade1b-a88c-405a-a538-37325213419c',
        checked: true,
        description: 'Thẩm định giá bất động sản',
      },
      {
        id: 'b620ba0d-149a-4846-a5ba-b7835f088bdf',
        typeId: 'b620ba0d-149a-4846-a5ba-b7835f088bdf',
        checked: true,
        description: 'Pháp lý bất động sản',
      },
      {
        id: 'fb020586-5333-41eb-8e02-0e0cfe45df72',
        typeId: 'fb020586-5333-41eb-8e02-0e0cfe45df72',
        checked: true,
        description: 'Tư vấn thủ tục bất động sản',
      },
    ],
    postServiceTypes: [
      {
        id: 'GUARANTEED',
        name: 'Tin đăng cam kết',
        checked: true,
        disabled: false,
      },
      {
        id: 'NORMAL',
        name: 'Tin đăng thường',
        checked: false,
        disabled: false,
      },
    ],
    postServiceType: 'GUARANTEED',
    guaranteedPackageId: 'ce30e043-911f-4732-a1a1-8889366ec8fb',
    guaranteedPackages: [
      {
        id: 'ce30e043-911f-4732-a1a1-8889366ec8fb',
        name: 'Cam kết giao dịch – 1 năm',
        value: 12,
        checked: true,
      },
      {
        id: '97db22be-110d-47ea-b8a9-1c785cc852e2',
        name: 'Cam kết giao dịch – 6 tháng',
        value: 6,
        checked: false,
      },
      {
        id: '37b0f873-c1ec-4d71-b3ed-417a004e4b3b',
        name: 'Cam kết giao dịch – 3 tháng',
        value: 3,
        checked: false,
      },
    ],
    postType: {
      forSale: true,
      forRent: false,
    },
    legalFilesSize: 0,
    isPrivate: false,
  },
  data: {
    __typename: 'UserDto',
    firstName: 'Nghe',
    lastName: 'Pham Van',
    userName: 'topener008',
    phoneNumber: '0000000123',
    email: 'topener008@gmail.com',
    emailConfirmed: false,
    dob: null,
    referralCode: '0000000001',
    gender: 'NA',
    userId: 'be14630e-bd0b-413f-b0e5-93d79f748b75',
    roleId: 'ed1d286e-2bd8-4687-b73a-2815b526b4e4',
    roleName: 'agent',
    profilePhoto: '/static/images/defaultAvatar.png',
    profilePhotos: null,
    updatedDatetime: null,
    createdDatetime: 1638525936062,
    pushNotificationId: '754092f5-f381-41bd-8048-d7569360b9b4',
  },
  errorState: {ownerEmail: '', ownerName: '', ownerPhoneNumber: ''},
};

const props2 = {
  dispatch: () => {},
  showPopup: () => {},
  masterData: masterData,
  errorState: {
    postTitle: '',
    postType: '',
    propertyType: '',
    project: '',
    projectText: '',
    streetName: '',
    homeAddress: '',
    city: '',
    district: '',
    ward: '',
    postDescription: '',
    isValid: false,
    price: '',
    commission: '',
    rentPrice: '',
    rentCommission: '',
    lastFullAddress: '',
    coordinateText: '',
    postDescriptionPlainText: '',
  },
  state: {
    postTitle: 'Bán căn hộ',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    propertyTypeName: 'apartment',
    propertyTypeDescription: 'Căn hộ',
    projectInfo: {projectName: 'TEST SON', projectId: 'b304df74-11e3-4c4b-b238-06c7bd8b5067'},
    projectId: 'b304df74-11e3-4c4b-b238-06c7bd8b5067',
    freeTextProject: '',
    propertyAddress: {
      __typename: 'ProjectAddressInfoDto',
      projectAddressId: '6d56fa02-23ed-43b0-a970-27a3c2c66496',
      cityId: 1,
      districtId: 6,
      wardId: 78,
      streetName: 'An Duong Vuong',
      homeAddress: '112',
      longitude: 106.6198512,
      latitude: 10.7214755,
      cityName: 'Hồ Chí Minh',
      districtName: 'Gò Vấp',
      wardName: 'Phường 10',
    },
    lastFullAddress: '112 An Duong Vuong, Phường 10, Gò Vấp, Hồ Chí Minh',
    postDescription: '<div>Bán căn hộ</div>',
    errorState: {
      postTitle: '',
      postType: '',
      propertyType: '',
      project: '',
      projectText: '',
      streetName: '',
      homeAddress: '',
      city: '',
      district: '',
      ward: '',
      postDescription: '',
      isValid: false,
      price: '',
      commission: '',
      rentPrice: '',
      rentCommission: '',
      lastFullAddress: '',
      coordinateText: '',
      postDescriptionPlainText: '',
    },
    forSale: true,
    forRent: false,
    price: 88000000000,
    commission: {value: 8, id: 'ffbe3353-e555-48f9-9166-8b41464c53b4'},
    negotiable: true,
    rentPrice: '',
    rentCommission: {id: 'bda0d67d-769a-4061-9e96-a737d1f70bfe', value: ''},
    rentPeriod: {id: '', value: ''},
    detailInfo: {
      PROPERTY_STATUS: '7f8f1f03-a6ae-4356-a74e-05ec4cdce6e3',
      LEGAL_STATUS: '9ec2ce9f-a616-4de3-8f68-b5400c0cce0f',
      DIRECTION: 'SOUTHEAST',
      WIDTH: '12',
      LENGTH: '12',
      TOWER: 'Diamon',
      FLOOR: 'Diamon-8',
      LAND_ACREAGE: '144',
      NUMBER_OF_BATHROOM: '8',
      NUMBER_OF_BEDROOM: '8',
      dropdownData: {
        propertyStatus: [
          {
            __typename: 'PropertyPostStatusDto',
            propertyPostStatusId: '053b8b22-6f83-41bd-a13c-2f7d617fdbf1',
            propertyPostStatusName: 'available',
            propertyPostStatusDescription: 'Đang không sử dụng',
            isActive: false,
            id: '053b8b22-6f83-41bd-a13c-2f7d617fdbf1',
            name: 'Đang không sử dụng',
            checked: false,
          },
        ],
        legalStatus: [
          {
            __typename: 'LegalInfoDto',
            legalInfoId: '330b1232-692e-4e5b-988f-f2ae95e6ff3d',
            legalInfoName: 'hand-documents-notarized',
            legalInfoDescription: 'Giấy tay, công chứng',
            isActive: false,
            isDeleted: false,
            id: '330b1232-692e-4e5b-988f-f2ae95e6ff3d',
            name: 'Giấy tay, công chứng',
            checked: false,
          },
        ],
        directions: [
          {id: 'EAST', name: 'Đông', checked: false},
          {id: 'WEST', name: 'Tây', checked: false},
          {id: 'SOUTH', name: 'Nam', checked: false},
          {id: 'NORTH', name: 'Bắc', checked: false},
          {id: 'SOUTHEAST', name: 'Đông Nam', checked: true},
          {id: 'NORTHEAST', name: 'Đông Bắc', checked: false},
          {id: 'SOUTHWEST', name: 'Tây Nam', checked: false},
          {id: 'NORTHWEST', name: 'Tây Bắc', checked: false},
        ],
        banks: [
          {
            __typename: 'BankDto',
            bankId: '6706039e-2e93-4519-bfb7-a7ffcc606447',
            bankName: 'Ngân hàng Ngoại thương Việt Nam',
            bankDescription: null,
            bankCode: 'VCB',
            isActive: false,
            id: '6706039e-2e93-4519-bfb7-a7ffcc606447',
            name: 'Ngân hàng Ngoại thương Việt Nam',
            checked: false,
          },
          {
            __typename: 'BankDto',
            bankId: '5af03f8e-74c5-49db-95e1-a8f00150d587',
            bankName: 'Ngân hàng Phương Đông',
            bankDescription: null,
            bankCode: 'OCB',
            isActive: false,
            id: '5af03f8e-74c5-49db-95e1-a8f00150d587',
            name: 'Ngân hàng Phương Đông',
            checked: false,
          },
        ],
        currencyUnits: [
          {
            __typename: 'UnitOfMeasureDto',
            unitOfMeasureId: '2e1b0f25-2772-4d71-aca1-9bd0c8fb9a74',
            unitOfMeasureName: 'Tỷ',
            unitOfMeasureCode: 'billion',
            multiplyWithBaseUnit: 1000000000,
            isRound: true,
            id: '2e1b0f25-2772-4d71-aca1-9bd0c8fb9a74',
            name: 'Tỷ',
            checked: true,
          },
          {
            __typename: 'UnitOfMeasureDto',
            unitOfMeasureId: 'bba3d3d5-47ef-44fe-a06d-3dd313fb8924',
            unitOfMeasureName: 'Triệu',
            unitOfMeasureCode: 'million',
            multiplyWithBaseUnit: 1000000,
            isRound: true,
            id: 'bba3d3d5-47ef-44fe-a06d-3dd313fb8924',
            name: 'Triệu',
            checked: false,
          },
        ],
      },
    },
    modalizeState: 'ADD_AREA_FACILITY',
    buildingFacility: {
      nearFacility: [
        {
          id: '0620ac3f-0332-4203-afd1-ab8092d2cdd2',
          description: 'Gần chợ / siêu thị',
          name: 'Gần chợ / siêu thị',
          checked: true,
        },
      ],
      internalFacility: [
        {
          id: '9f433eca-e7cf-4778-8d90-ad87bb1cf30f',
          description: 'Bàn ăn',
          name: 'Bàn ăn',
          checked: true,
        },
        {
          id: 'c4bda6dd-5c9f-490f-88cd-dba752ffb3d7',
          description: 'Bàn đầu giường',
          name: 'Bàn đầu giường',
          checked: true,
        },
        {
          id: '6ead7f3a-83be-45c5-83f7-2622847d2a52',
          description: 'Chậu rửa',
          name: 'Chậu rửa',
          checked: false,
        },
        {
          id: '2d744509-0ce0-49f4-8192-db1dcbbfd452',
          description: 'Thảm',
          name: 'Thảm',
          checked: false,
        },
      ],
    },
    coordinate: {latitude: 10.7214755, longitude: 106.6198512},
    coordinateText: '10.7214755, 106.6198512',
    postDescriptionPlainText: 'Bán căn hộ',
    isPrivate: false,
    commissionTpl: 20,
    commissionBuyer: 60,
    commissionSeller: 20,
  },
};
