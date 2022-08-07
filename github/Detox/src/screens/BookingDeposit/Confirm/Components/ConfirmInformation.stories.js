import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';

import {configDecorator} from '../../../../../storybook/utils/configDecorator';
import {ConfirmInformationContainer} from './ConfirmInformation';

storiesOf('z|b2c/ConfirmInformation', module) //format
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
      isHaveApolloNetwork: true,
    }),
  )
  .add('Default', () => {
    return (
      <ScrollView>
        <ConfirmInformationContainer {...data} />
      </ScrollView>
    );
  });

const data = {
  state: {
    locale: 'vn',
    paymentMethod: '',
    paymentTransactionInfo: '',
    isChangingPaymentMethod: false,
    isBuyer: true,
    customerFullName: 'Nguyễn Nhu',
    customerPhone: '0987080100',
    customerEmail: 'nhudl1@g.com',
    customerNationalId: '0123456789',
    customerNationalIdIssueDate: 1633885200000,
    customerNationalIdIssuePlace: 'bhh',
    permanentAddress: {
      city: {id: 2, name: 'Hà Nội'},
      district: {id: 25, name: 'Ba Đình'},
      ward: {id: 328, name: 'Điện Biên'},
      street: '17 Nguyễn Huệ',
    },
    nationalIdType: 'CMND',
    customerGender: 'MALE',
    customerBirthDay: '1991-05-11T05:38:32.000Z',
    customerContactAddress: '',
    propertyPost: {
      errorCode: 0,
      errorMessage: null,
      errorMessageCode: null,
      isSaleAgent: true,
      propertyPostId: '8cefb119-c69f-42e9-a1a8-c0492960604d',
      propertyType: 'apartment',
      propertyTypeName: 'apartment',
      propertyTypeDescription: 'Căn hộ',
      propertyCode: 'CH-316001',
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
      numberOfBooking: 1,
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
      isBooked: true,
      ableConfirmDeposite: true,
      bookingTransactionInfo: {
        bookingTransactionId: '28784f62-8144-4dd1-bf63-d2f7a28aa545',
        beginDepositeDatetime: 1655699100000,
        endDepositeDatetime: 1655699700000,
      },
      contextType: 'NewDeposit',
      isDeposited: false,
      rawPrice: 0.25,
      isAgentUser: true,
      currentMode: 'MODE_DEPOSIT',
      rawBookingFee: 10000,
      detailPath: null,
      timeUpdate: '2022-06-21T07:50:04.910Z',
      projectStatusDescription: 'Đang mở bán',
      featurePhotos:
        'https://perstoresb.blob.core.windows.net/upload/1655697958128_4c061f161b93452e88ad8871ff36da8d.png',
    },
    saleAgentInfo: {},
    consultantInfo: {
      staffId: '4a0e1047-b909-4348-9143-9d97a0aed9e9',
      staffCode: 'MCV000000028',
      profilePhoto: null,
      profilePhotos: '{}',
      fullName: 'Nguyen KenTestLeadCVTV',
      phoneNumber: '0000001230',
      staffGroupId: '48c89c57-0123-43eb-8b99-450e739e6281',
      staffGroupDescription: 'Chuyên viên tư vấn',
      rating: 5,
      isGroupLeader: true,
      name: 'Nguyen KenTestLeadCVTV',
      group: 'Chuyên viên tư vấn',
      itemId: '4a0e1047-b909-4348-9143-9d97a0aed9e9',
      height: 101,
    },
    project: {
      isFollowed: null,
      totalFollower: null,
      bankInfo: '',
      commissionRates: '',
      projectStatusDescription: 'Đang mở bán',
      projectTypeName: 'apartment',
      projectTypeDescription: 'Căn hộ',
      facilitiesDescription: '',
      facilitiesMediaInfo: '{}',
      startYear: 2021,
      totalArea: '',
      overallDescription: '',
      featurePhotos:
        'https://perstoresb.blob.core.windows.net/upload/1655697958128_4c061f161b93452e88ad8871ff36da8d.png',
      groundPlanDescription: '',
      groundPlanMediaInfo: '{}',
      investorOwnerName: 'Vinhome New 15/6',
      investorDetailPath: '/chu-dau-tu/MCDT00083-vinhome-new-156',
      investorId: '7c5cbaf3-d1da-4e81-a6bd-c393d606a76f',
      investorOwnerLogo:
        'https://perstoresb.blob.core.windows.net/upload/1655280123113_ebd644b55b3840ae88e59950ae17f678.png',
      isFeaturesProject: false,
      locationDescription: '',
      locationMediaInfo: '{}',
      overviewDescription: '',
      overviewMediaInfo:
        '{"images": [{"url": "https://perstoresb.blob.core.windows.net/upload/1655697986591_7222b3cc74d54426af9d86c82925bcfa.png", "name": "Screen Shot 2022-03-13 at 17.15.29.png", "size": 1462417}, {"url": "https://perstoresb.blob.core.windows.net/upload/1655697986556_d04d658a91fd45eb9cc4117b084f8a22.png", "name": "Screen Shot 2022-03-13 at 17.15.49.png", "size": 2247047}]}',
      partnersInfo: '',
      projectAddressId: null,
      projectAddress: {
        projectAddressId: '7fe8a86f-92f7-4953-a9e1-2f04baee9faf',
        cityId: 1,
        districtId: 24,
        wardId: 315,
        streetName: '12',
        homeAddress: '12',
        longitude: 106.7264125,
        latitude: 10.8830404,
        cityName: 'Hồ Chí Minh',
        districtName: 'Thành phố Thủ Đức',
        wardName: 'Bình Chiểu',
      },
      projectItems: [],
      projectCode: 'MDA00511',
      projectDescription: 'test',
      projectId: 'c3fc0e71-86d8-47d3-83c6-d7bcbef29b3c',
      totalShare: null,
      projectName: 'test bug',
      projectPostStatusId: '04eeb960-5fa3-4f59-a375-c3a4ac0c37dc',
      projectPostStatusName: 'public',
      projectProgress: null,
      projectStatusId: '966d2a2a-dd36-45d8-b4da-a73a1acc576b',
      propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
      saleProgramDescription: '',
      saleProgramMediaInfo: '{}',
      handoverMaterialDescription: '',
      handoverMaterialMediaInfo: '{}',
      legalInformationDescription: '',
      legalInformationMediaInfo: '{}',
      sizingDescription: '',
      sizingMediaInfo: '{}',
      sortOrder: 0,
      minPrice: 0,
      projectStatusName: 'open',
      saleSeasonInfo: {
        saleSeasonId: 'd57722b4-3fb1-4b0e-bc41-231478e521a3',
        seasonName: '12',
        saleSeasonStatusId: '5b011310-3a9a-453b-b5ad-3bed9211f5b6',
        startBookingDatetime: 1655698200000,
        genericBasketDatetime: 1655698500000,
        endBookingDatetime: 1655698800000,
        openDatetime: 1655699100000,
        closeDatetime: 1655699400000,
        allTopenersCanViewProducts: false,
        maxBookingNumber: 3,
      },
      detailPath: null,
      projectStatus: 'MODE_DEPOSIT',
    },
    paymentResult: {},
    isLoggedInUserSaleAgent: true,
    originTransaction: null,
    fundAccountId: '',
    saleSeasonId: 'd57722b4-3fb1-4b0e-bc41-231478e521a3',
    contactAddress: {
      city: {id: 2, name: 'Hà Nội'},
      district: {id: 25, name: 'Ba Đình'},
      ward: {id: 328, name: 'Điện Biên'},
      street: '17 Nguyễn Huệ',
    },
  },
  errors: {
    customerName: '',
    customerPhone: '',
    customerNationalId: '',
    customerNationalIssueDate: '',
    customerNationalIssuePlace: '',
    permanentAddress: '',
    customerContactAddress: '',
    customerBirthDay: '',
    customerGender: '',
    customerDob: '',
  },
  saleAgentInfo: {},
  policies: [
    {
      startDate: 1629279900000,
      endDate: 1629363660000,
      policyTypeId: '4fce41ee-0a75-4db7-b62b-693b87347f07',
      policyName: 'Ch\u00EDnh s\u00E1ch \u0111\u1EB7t c\u1ECDc 1',
      attachment:
        'https://sandbox-citus.topenland.com/gateway/downloader/sale/file-example_PDF_1MB-677215e1-c5d8-4c85-a3bb-f146ed9bd855.pdf',
    },
    {
      startDate: 1629279900000,
      endDate: 1629363660000,
      policyTypeId: '4fce41ee-0a75-4db7-b62b-693b87347f08',
      policyName: 'Ch\u00EDnh s\u00E1ch \u0111\u1EB7t c\u1ECDc 2',
      attachment:
        'https://sandbox-citus.topenland.com/gateway/downloader/sale/file-example_PDF_1MB-677215e1-c5d8-4c85-a3bb-f146ed9bd855.pdf',
    },
    {
      startDate: 1629279900000,
      endDate: 1629363660000,
      policyTypeId: '4fce41ee-0a75-4db7-b62b-693b87347f07',
      policyName: 'chinh sach dat coc 2',
      attachment: 'file-sample_1MB.docx',
    },
  ],
  isUpdateInfo: false,
  checkedBuyer: true,
  masterData: {
    contactTradingStatus: {
      edges: [
        {
          contactTradingStatusName: 'Waiting',
          contactTradingStatusId: '722d95b4-dca6-4586-ba4d-6e0ad335ce97',
          contactTradingStatusDescription: 'Chờ xác nhận',
        },
      ],
    },
    contactTradingRelevantPropertyStatus: {
      edges: [
        {
          contactTradingPropertyConsultationStatusId: '3714a762-495d-4c0d-8ed8-bf97d0afe4e2',
          contactTradingPropertyConsultationStatusName: 'Matching',
          contactTradingPropertyConsultationStatusDescription: 'Phù hợp',
        },
      ],
    },
    projectStatus: {
      edges: [
        {
          projectStatusName: 'comingsoon',
          projectStatusId: '097a447c-e510-4262-a0f5-a3531feabf21',
          projectStatusDescription: 'Sắp mở bán',
        },
      ],
    },
    saleSeasonStatuses: {
      edges: [
        {
          saleSeasonStatusId: '3a3d3a88-0da7-4274-8dc2-303eb26f335e',
          saleSeasonStatusName: 'New',
          saleSeasonStatusDescription: 'Mới',
        },
      ],
    },
    saleTrackingStatus: {
      edges: [
        {
          saleTrackingStatusId: '01c246f6-95f7-4a4d-8608-1f2a16e068a4',
          saleTrackingStatusName: 'sold',
          saleTrackingStatusDescription: 'Đã bán',
        },
      ],
    },
    bookingStatus: {
      edges: [
        {
          bookingStatusId: '6e09af5f-3559-416c-8bbe-bfd7bf29d224',
          bookingStatusName: 'booking_completed',
          bookingStatusDescription: 'Hoàn tất đặt chỗ',
        },
        {
          bookingStatusId: 'd2a92489-684e-49b1-b889-b63e61528228',
          bookingStatusName: 'deposit_cancel',
          bookingStatusDescription: 'Hủy/Trả QTGĐC',
        },
      ],
    },
    projectPostStatus: {
      edges: [
        {
          projectPostStatusName: 'public',
          projectPostStatusId: '04eeb960-5fa3-4f59-a375-c3a4ac0c37dc',
          projectPostStatusDescription: 'Đang đăng',
        },
      ],
    },
    agentRankings: {
      totalCount: 5,
      edges: [
        {
          agentRankingId: '1645cfca-98bf-49c5-844e-f9a5b61964c0',
          agentRankingName: 'rank5',
          agentRankingDescription: 'Diamond Plus',
        },
      ],
    },
    propertyTypes: {
      edges: [
        {
          propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
          propertyTypeName: 'apartment',
          propertyTypeDescription: 'Căn hộ',
          isActive: true,
        },
      ],
    },
    propertyPostStatus: {
      edges: [
        {
          propertyPostStatusId: '053b8b22-6f83-41bd-a13c-2f7d617fdbf1',
          propertyPostStatusName: 'available',
          propertyPostStatusDescription: 'Đang không sử dụng',
          isActive: false,
        },
      ],
    },
    legalInfoes: {
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
      edges: [
        {
          bankId: '6706039e-2e93-4519-bfb7-a7ffcc606447',
          bankName: 'Ngân hàng Ngoại thương Việt Nam',
          bankDescription: null,
          bankCode: 'VCB',
          isActive: false,
        },
      ],
    },
    unitOfMeasures: {
      edges: [
        {
          unitOfMeasureId: '2e1b0f25-2772-4d71-aca1-9bd0c8fb9a74',
          unitOfMeasureName: 'Tỷ',
          unitOfMeasureCode: 'billion',
          multiplyWithBaseUnit: 1000000000,
          isRound: true,
        },
      ],
    },
    propertyPostApprovalStatus: {
      totalCount: 7,
      edges: [
        {
          propertyPostApprovalStatusId: '23801694-3ab0-4854-b599-5f9b9b9b36d8',
          propertyPostApprovalStatusName: 'waiting',
          propertyPostApprovalStatusDescription: 'Đang chờ duyệt',
        },
      ],
    },
    postTypes: {
      edges: [
        {
          postTypeId: '8fc6b7e6-32a0-4874-8a2e-6035df6b7426',
          postTypeName: 'B2C',
        },
        {
          postTypeId: 'd809d587-4a8d-439c-8245-5bab62ab56fb',
          postTypeName: 'C2C',
        },
      ],
    },
    cities: {
      totalCount: 63,
      edges: [
        {__typename: 'CityDto', cityId: 1, cityName: 'Hồ Chí Minh'},
        {__typename: 'CityDto', cityId: 2, cityName: 'Hà Nội'},
      ],
    },
    pendingReasons: {
      edges: [
        {
          pendingReasonId: '48b426a1-86e8-456d-88ca-96e51f1cdd9d',
          pendingReasonName: 'HaveNotFoundTheRightProduct',
          pendingReasonDescription: 'Chưa tìm được sản phẩm phù hợp',
        },
      ],
    },
    subscriptionPackageStatus: {
      edges: [
        {
          subscriptionPackageStatusId: 'fc622352-6110-4fc6-89a4-78268ad42d40',
          subscriptionPackageStatusName: 'not_expired_yet',
          subscriptionPackageStatusDescription: 'Chưa hết hạn',
        },
      ],
    },
    internalFacilities: {
      edges: [
        {
          internalFacilityId: '9f433eca-e7cf-4778-8d90-ad87bb1cf30f',
          internalFacilityName: 'Bàn ăn',
          internalFacilityCode: 'InternalFacilityCode1',
        },
      ],
    },
    nearFacilities: {
      edges: [
        {
          nearFacilityId: '0620ac3f-0332-4203-afd1-ab8092d2cdd2',
          nearFacilityName: 'Gần chợ / siêu thị',
          nearFacilityCode: 'NearFacilityCode1',
        },
      ],
    },
    fundAccounts: {
      edges: [
        {
          cityId: 1,
          fundAccountId: '9cd00003-292d-4ce8-b39e-ba18f591ad57',
          fundAccountCode: 1,
          branchAddress: 'VP Kế toán 110 -112 Trần Quốc Toản, P.Võ Thị Sáu, Q3, TpHCM',
          branchName: 'VP 110 -112 Trần Quốc Toản',
          phoneNumber: '(028) 7307 5888',
          faxNumber: null,
          fundEmail: ' info@hungthinhcorp.com.vn',
        },
      ],
    },
    paymentUnits: {
      edges: [
        {
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
          feedObjectTypeId: '6703f639-64fa-471e-a317-7c276c83908d',
          feedObjectTypeName: 'project',
          feedObjectTypeDescription: 'Dự án',
          isActive: true,
        },
      ],
      totalCount: 5,
    },
    getContactTradingRejectReasons: {
      edges: [
        {
          contactTradingRejectReasonId: 'e997800c-0071-4ad8-acf5-81b781a0cc7a',
          rejectReasonName: 'NoNeed',
          rejectReasonDescription: 'Không còn nhu cầu giao dịch',
          sortOrder: 1,
          isActive: true,
        },
        {
          contactTradingRejectReasonId: '4a2039c1-6261-4f5a-a42b-8d8f185ec495',
          rejectReasonName: 'Other',
          rejectReasonDescription: 'Khác',
          sortOrder: 2,
          isActive: true,
        },
      ],
    },
    getC2CDepositRejectReasons: {
      edges: [
        {
          c2CDepositRejectReasonId: '477fefbc-4034-47ab-99db-17618af412cf',
          rejectReasonName: 'NoNeed',
          rejectReasonDescription: 'Không còn nhu cầu giao dịch',
          isActive: true,
          sortOrder: 1,
        },
      ],
    },
    getSupportServiceTypesForFrontOffice: {
      requestTypes: [
        {
          price: 4000000,
          requestTypeId: '9f133df2-6cf1-4830-93af-807268c54f0d',
          requestTypeName: 'VerificationPost',
          requestTypeDescription: 'Xác minh tin đăng nâng cao',
        },
      ],
    },
    supportServiceTicketStatuses: {
      __typename: 'OffsetPagingOfSupportServiceTicketStatusDto',
      edges: [
        {
          supportServiceTicketStatusId: '24901447-b94d-48ee-a0de-a867cabe4fd4',
          supportServiceTicketStatusName: 'Cancelled',
          supportServiceTicketStatusDescription: 'Đã hủy',
        },
      ],
    },
    supportServiceTicketProcessingStatuses: {
      edges: [
        {
          supportServiceTicketProcessingStatusId: '045821c0-416a-440a-898c-b615b72f720d',
          supportServiceTicketProcessingStatusName: 'Cancelled',
          supportServiceTicketProcessingStatusDescription: 'Đã hủy',
        },
      ],
    },
    supportServiceTicketCancelReasons: {
      edges: [
        {
          supportServiceTicketCancelReasonId: '3a5d3091-e9e7-49e3-85b5-8a097b1a7658',
          supportServiceTicketCancelReasonName: 'NoNeed',
          supportServiceTicketCancelReasonDescription: 'Không còn nhu cầu',
        },
      ],
    },
    supportServiceTicketRejectReasons: {
      edges: [
        {
          supportServiceTicketRejectReasonId: '539b8165-5c5c-414a-9ed4-719623d66e7d',
          supportServiceTicketRejectReasonName: 'InappropriateSupportTime',
          supportServiceTicketRejectReasonDescription: 'Thời gian hỗ trợ không phù hợp',
        },
      ],
    },
  },
  isAgree: false,
};
