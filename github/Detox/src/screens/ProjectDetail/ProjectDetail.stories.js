import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../storybook/utils/configDecorator';
import MeasureUtils from '../../utils/MeasureUtils';
import {ProjectDetailView, ViewBottom} from './ProjectDetailContainer';
import Selector from './Selector';

storiesOf('z|b2c/ProjectDetail', module)
  .addDecorator(
    configDecorator({
      notHaveTestId: 'isHtmlLoading',
      isCaptureScrollViewContent: true,
    }),
  ) //format
  .add('default!', () => {
    return (
      <>
        <ProjectDetailView {...data} />
        <ViewBottom {...dataViewBottom} />
      </>
    );
  })
  .add('MODE_DEPOSIT', () => {
    data.projectStatus = 'MODE_DEPOSIT';
    return (
      <>
        <ProjectDetailView {...data} />
        <ViewBottom {...dataViewBottom} />
      </>
    );
  })
  .add('MODE_BOOKING and have maxBookingNumber', () => {
    data.projectStatus = 'MODE_BOOKING';
    data.saleSeasonInfo = {
      maxBookingNumber: 3,
    };
    return (
      <>
        <ProjectDetailView {...data} />
        <ViewBottom {...dataViewBottom} />
      </>
    );
  });

const dataViewBottom = {
  projectStatus: 'MODE_DEPOSIT', //MODE_NOTHING, MODE_BOOKING, MODE_DEPOSIT, MODE_MOVE_DEPOSIT ,
  isShowButtonBook: true,
};

const projectDetailMock = {
  isFollowed: null,
  totalFollower: 1,
  bankInfo: '',
  commissionRates: '1%',
  projectStatusDescription: 'Đang mở bán',
  projectTypeName: 'apartment',
  projectTypeDescription: 'Căn hộ',
  facilitiesDescription:
    /* eslint-disable sonarjs/no-duplicate-string */
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non. Quis hendrerit dolor magna eget est lorem ipsum dolor sit. Volutpat odio facilisis mauris sit amet massa. Commodo odio aenean sed adipiscing diam donec adipiscing tristique. Mi eget mauris pharetra et. Non tellus orci ac auctor augue. Elit at imperdiet dui accumsan sit. Ornare arcu dui vivamus arcu felis. Egestas integer eget aliquet nibh praesent. In hac habitasse platea dictumst quisque sagittis purus. Pulvinar elementum integer enim neque volutpat ac.</p>\n',
  facilitiesMediaInfo:
    '{"images": [{"url": "https://sandbox-citus.topenland.com/gateway/downloader/sale/house_test-ce26ec6a-6308-43a8-abd7-0aec10ecda99.jpg", "name": "house_test.jpg", "size": 224277}], "documents": [{"url": "https://sandbox-citus.topenland.com/gateway/downloader/sale/%5BUser%20Story%5D%20C2C%20-%20FO%20MO%20-%20Lie%CC%82n%20he%CC%A3%CC%82%20mua%20v1.0-f506b40c-ca1a-4357-b2d4-f288f614f318.docx", "name": "[User Story] C2C - FO MO - Liên hệ mua v1.0.docx", "size": 34995}]}',
  startYear: 2021,
  totalArea: '1000',
  overallDescription: '- 1500 hecta',
  featurePhotos:
    'https://sandbox-citus.topenland.com/gateway/downloader/sale/image-f2966f27-dd71-4db0-9647-f23f7034cc87.png',
  groundPlanDescription: '<p>Sơ đồ mặt bằng</p>\n',
  groundPlanMediaInfo: '{}',
  investorOwnerName: 'Test ',
  investorDetailPath: '/chu-dau-tu/MCDT00063-test',
  investorId: '5fa3d006-f935-4738-9298-63e31d2977d3',
  investorOwnerLogo:
    'https://sandbox-citus.topenland.com/gateway/downloader/sale/image-a5c8bfd6-360b-4c63-b15b-3960bcc0c67e.png',
  isFeaturesProject: false,
  locationDescription:
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non. Quis hendrerit dolor magna eget est lorem ipsum dolor sit. Volutpat odio facilisis mauris sit amet massa. Commodo odio aenean sed adipiscing diam donec adipiscing tristique. Mi eget mauris pharetra et. Non tellus orci ac auctor augue. Elit at imperdiet dui accumsan sit. Ornare arcu dui vivamus arcu felis. Egestas integer eget aliquet nibh praesent. In hac habitasse platea dictumst quisque sagittis purus. Pulvinar elementum integer enim neque volutpat ac.</p>\n',
  locationMediaInfo:
    '{"images": [{"url": "https://sandbox-citus.topenland.com/gateway/downloader/sale/1649335571082_f457b08ca4994cb38bca0ddf3329e768-bbb175db-1102-4c4c-916e-4e369ed7aa34.jpeg", "name": "1649335571082_f457b08ca4994cb38bca0ddf3329e768.jpeg", "size": 129439}], "documents": [{"url": "https://sandbox-citus.topenland.com/gateway/downloader/sale/%5BUser%20Story%5D%20C2C%20-%20FO%20MO%20-%20Lie%CC%82n%20he%CC%A3%CC%82%20mua%20v1.0-52dbe9a4-067d-4b90-8162-a88a516a19a9.docx", "name": "[User Story] C2C - FO MO - Liên hệ mua v1.0.docx", "size": 34995}]}',
  overviewDescription:
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non. Quis hendrerit dolor magna eget est lorem ipsum dolor sit. Volutpat odio facilisis mauris sit amet massa. Commodo odio aenean sed adipiscing diam donec adipiscing tristique. Mi eget mauris pharetra et. Non tellus orci ac auctor augue. Elit at imperdiet dui accumsan sit. Ornare arcu dui vivamus arcu felis. Egestas integer eget aliquet nibh praesent. In hac habitasse platea dictumst quisque sagittis purus. Pulvinar elementum integer enim neque volutpat ac.</p>\n',
  overviewMediaInfo: '{}',
  partnersInfo: '',
  projectAddressId: null,
  projectAddress: {
    projectAddressId: '12f2ff75-dddd-441f-b899-e7a7f3e600a0',
    cityId: 1,
    districtId: 19,
    wardId: 256,
    streetName: 'Huỳnh Tấn Phát',
    homeAddress: '922',
    longitude: 106.73243,
    latitude: 10.7295809,
    cityName: 'Hồ Chí Minh',
    districtName: 'Quận 7',
    wardName: 'Tân Phú',
    __typename: 'ProjectAddressInfoDto',
  },
  projectCode: 'MDA00470',
  projectDescription: 'Bán căn hộ test',
  projectId: '146d6d61-667b-41e1-a1b8-22706f96ac53',
  totalShare: null,
  projectName: 'Dự án test file pháp lý và vật liệu',
  projectPostStatusId: '04eeb960-5fa3-4f59-a375-c3a4ac0c37dc',
  projectPostStatusName: 'public',
  projectProgress: null,
  projectStatusId: '966d2a2a-dd36-45d8-b4da-a73a1acc576b',
  propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
  saleProgramDescription: '',
  saleProgramMediaInfo:
    '{"documents": [{"url": "https://sandbox-citus.topenland.com/gateway/downloader/sale/%5BUser%20Story%5D%20C2C%20-%20FO%20MO%20-%20Lie%CC%82n%20he%CC%A3%CC%82%20mua%20v1.0-77fe7877-5215-47fc-b986-b726aa588da3.docx", "name": "[User Story] C2C - FO MO - Liên hệ mua v1.0.docx", "size": 34995}]}',
  handoverMaterialDescription: '',
  handoverMaterialMediaInfo:
    '{"images": [{"url": "https://sandbox-citus.topenland.com/gateway/downloader/sale/thumbnail_KY_2a-918f31c8-b415-4622-b97b-b6df99f49a41.png", "name": "thumbnail_KY_2a-918f31c8-b415-4622-b97b-b6df99f49a41.png"}, {"url": "https://sandbox-citus.topenland.com/gateway/downloader/sale/1649335571082_f457b08ca4994cb38bca0ddf3329e768-bc2c3e8d-3f9d-4342-8af3-67ce1b355e43.jpeg", "name": "1649335571082_f457b08ca4994cb38bca0ddf3329e768.jpeg", "size": 129439}], "documents": [{"url": "https://sandbox-citus.topenland.com/gateway/downloader/sale/%5BUser%20Story%5D%20C2C%20-%20FO%20MO%20-%20Lie%CC%82n%20he%CC%A3%CC%82%20mua%20v1.0-38cb5f19-7543-4d33-8591-ef825f66b529.docx", "name": "[User Story] C2C - FO MO - Liên hệ mua v1.0.docx", "size": 34995}]}',
  legalInformationDescription: '',
  legalInformationMediaInfo:
    '{"images": [{"url": "https://sandbox-citus.topenland.com/gateway/downloader/sale/1635560948912_20200813175652-6b11_wm-76e28104-4283-4de7-9f1c-a25240d70e83.jpeg", "name": "1635560948912_20200813175652-6b11_wm.jpeg", "size": 148062}], "documents": [{"url": "https://sandbox-citus.topenland.com/gateway/downloader/sale/%5BUser%20Story%5D%20C2C%20-%20FO%20MO%20-%20Lie%CC%82n%20he%CC%A3%CC%82%20mua%20v1.0-f228287c-00c4-4b99-a15d-8c8db8f4b4c8.docx", "name": "[User Story] C2C - FO MO - Liên hệ mua v1.0.docx", "size": 34995}]}',
  sizingDescription: '',
  sizingMediaInfo: '{}',
  sortOrder: 0,
  minPrice: 2000000000,
  projectStatusName: 'open',
  saleSeasonInfo: {
    saleSeasonId: '061066f2-0753-4c8c-ab8c-1c68c6cb21aa',
    seasonName: '1',
    saleSeasonStatusId: '5b011310-3a9a-453b-b5ad-3bed9211f5b6',
    startBookingDatetime: 1650534720000,
    genericBasketDatetime: 1650535020000,
    endBookingDatetime: 1650535320000,
    openDatetime: 1650535620000,
    closeDatetime: 1650535920000,
    allTopenersCanViewProducts: false,
    maxBookingNumber: 3,
    __typename: 'sale_SaleSeasonInfoDto',
  },
  detailPath: null,
  projectItems: [
    {
      id: 'c6650d30-a23a-41d0-a47f-8b588b0d6af2',
      title: 'Căn hộ mẫu 1',
      photo:
        'https://sandbox-citus.topenland.com/gateway/downloader/sale/image-3bea880b-c879-431d-b587-d2396ab2eaf5.png',
      cost: '2 tỷ',
      commission: '2%',
      sortOrder: '1',
    },
    {
      id: 'b23fd85e-a21b-48c6-8e63-44df58b82112',
      title: 'Căn hộ mẫu 2',
      photo:
        'https://sandbox-citus.topenland.com/gateway/downloader/sale/image-45e7a983-1733-4876-a6b3-9e438521efe7.png',
      cost: '1 tỷ',
      commission: '1%',
      sortOrder: '2',
    },
  ],
  __typename: 'FOProjectDto',
};

const data = {
  isTesting: true,
  onPressPhotoLibrary: () => {},
  images: [
    {
      url: '',
    },
  ],
  minPrice: MeasureUtils.getPriceDescriptionNoUnitInput(projectDetailMock.minPrice),
  projectName: projectDetailMock.projectName,
  projectTypeName: projectDetailMock.projectTypeName,
  startYear: projectDetailMock.startYear,
  projectStatusDescription: projectDetailMock.projectStatusDescription,
  commission: `${projectDetailMock.commissionRates}`,
  projectType: projectDetailMock.projectTypeDescription,
  investor: projectDetailMock.investorOwnerName,
  isFollowed: projectDetailMock.isFollowed,
  totalFollower: projectDetailMock.totalFollower,
  video: '{}',
  projectId: projectDetailMock.projectId,
  totalShare: 0,
  investorId: projectDetailMock.investorId,
  investorCode: 'MCDT00058',
  navigator: null,
  address: '117 Lê Thị Hồng Phường 17 Quận Gò Vấp',
  projectStatus: 'MODE_NOTHING',
  saleSeasonInfo: projectDetailMock?.saleSeasonInfo,
  saleProgramDocs: JSON.parse(projectDetailMock.saleProgramMediaInfo)?.documents,
  legalDocs: JSON.parse(projectDetailMock.legalInformationMediaInfo)?.documents,
  handoverMaterialDocs: JSON.parse(projectDetailMock.handoverMaterialMediaInfo)?.documents,
  projectDetailInfoSections: Selector.getProjectSectionData(projectDetailMock),
  projectItems: projectDetailMock.projectItems,
};
