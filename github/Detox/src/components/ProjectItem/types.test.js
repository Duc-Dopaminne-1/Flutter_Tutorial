const {mapProjectUi} = require('./types');

const mapProjectSample = () => {
  const project = {
    projectId: 'e94f41e0-d299-4172-91cf-0f637d01e4ac',
    projectName: 'New Galaxy',
    featurePhotos:
      'https://sandbox-new.topenland.com/gateway/downloader/personal/image-0197c078-9a71-4778-b557-1a92d96b967f.png',
    overviewMediaInfo:
      '{"video": "https://www.youtube.com/watch?v=_ULzt-o4FfE", "images": [{"url": "https://sandbox-new.topenland.com/gateway/downloader/sale/1-phoi-canh-tong-the-du-an-new-galxay-hungthinh-0932101106-f6490f46-f37f-4e52-8330-a725f4c398c8.jpg"}, {"url": "https://sandbox-new.topenland.com/gateway/downloader/sale/phoi-canh-tien-ich-new-galaxy-binh-duong-9-3ef14b7a-57a3-4a77-861e-b6913bfa30ce.jpg"}, {"url": "https://sandbox-new.topenland.com/gateway/downloader/sale/c%C4%83n-h%E1%BB%99-new-galaxy-h%C6%B0ng-th%E1%BB%8Bnh-46-scaled-dff1e952-f533-420c-9706-171aa3e97c8c.jpg"}]}',
    isFollowed: false,
    investorOwnerName: 'Công ty TNHH Đại Phúc',
    investorOwnerLogo:
      'https://sandbox-new.topenland.com/gateway/downloader/personal/image-48b64bdf-afc8-46a1-bf24-2f4bf0c31670.png',
    investorOwnerInfo: 'Thành Viên Tập Đoàn Hưng Thịnh',
    projectStatusId: '966d2a2a-dd36-45d8-b4da-a73a1acc576b',
    projectStatusName: 'Đang mở bán',
    sortOrder: 1,
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    totalArea: '10000m2',
    minPrice: 10000000,
    overallDescription:
      '<p><strong>200 </strong>Căn hộ | <strong>20 </strong>Tầng | <strong>20 </strong>Shop</p>\n',
    startYear: 2019,
    projectItems: [
      {
        title: '1 Phòng Ngủ',
        photo:
          'https://sandbox-new.topenland.com/gateway/downloader/sale/A001_1-4fdf83de-f8d4-4650-ae3a-bd1a70c0c37c.PNG',
        commission: '2%',
        cost: '1.25 tỷ',
        sortOrder: 1,
      },
      {
        title: '2 Phòng Ngủ',
        photo:
          'https://sandbox-new.topenland.com/gateway/downloader/sale/A002_1-2fdf34eb-4e33-40e3-9682-388e9bcef1ce.PNG',
        commission: '2.5%',
        cost: '2.1 tỷ',
        sortOrder: 2,
      },
      {
        title: '3 Phòng Ngủ',
        photo:
          'https://sandbox-new.topenland.com/gateway/downloader/sale/A003_1-9fb5f991-c2c6-4408-b5d9-41d8868f1922.PNG',
        commission: '2.8%',
        cost: '2.75 tỷ',
        sortOrder: 3,
      },
      {
        title: '4 Phòng Ngủ',
        photo:
          'https://sandbox-new.topenland.com/gateway/downloader/sale/A004_1-63f3d89b-10d8-4bba-bf88-3c01294f0cda.PNG',
        commission: '3.2%',
        cost: '3.75 tỷ',
        sortOrder: 4,
      },
    ],
    saleSeasonStatistic: {
      saleSeasonId: 'f66cd612-e9cd-4d0b-ab02-313d20952728',
      depositCount: 1,
      availableCount: 98,
      soldCount: 1,
      bookedCount: 0,
      viewingCount: 256,
    },
    saleSeason: {
      saleSeasonId: 'f66cd612-e9cd-4d0b-ab02-313d20952728',
      startBookingDatetime: 1603879200000,
      endBookingDatetime: 1604224800000,
      openDatetime: 1604484000000,
      closeDatetime: 1604743200000,
      saleSeasonStatusId: '60401950-f147-4140-977e-297aeac1eb2a',
      seasonStatusName: 'ReservationOpening',
    },
    projectAddress: {
      cityId: 1,
      cityName: 'Hồ Chí Minh',
      districtId: 17,
      districtName: 'Quận 5',
      wardId: 222,
      wardName: 'Phường 10',
      streetName: 'Hùng Vương',
      homeAddress: '132',
      __typename: 'ProjectAddressInfoDto',
    },
    __typename: 'SearchProjectInfoDto',
  };
  return mapProjectUi(project);
};

it('map project', () => {
  expect(mapProjectSample()).toMatchSnapshot();
});
