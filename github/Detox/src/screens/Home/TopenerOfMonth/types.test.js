import {mapProperty} from './types';

export const mapPropertySample = () => {
  const data = {
    propertyPostId: 'ea7267e3-21f9-482c-8a9f-0644072d7b75',
    images:
      '[{"url": "https://sandbox-new.topenland.com/gateway/downloader/sale/260031-pic0_new-5b11826f-bc72-4d6f-a07b-87e57d2e3cba.jpg"}, {"url": "https://sandbox-new.topenland.com/gateway/downloader/sale/260031-pic1_new-a64312a8-7915-4bd3-8beb-c1ac7303d0c6.jpg"}, {"url": "https://sandbox-new.topenland.com/gateway/downloader/sale/260031-pic6_new-d2848083-6fdb-4ce3-9fe0-0f3804228d6e.jpg"}, {"url": "https://sandbox-new.topenland.com/gateway/downloader/sale/260031-pic8_new-d5bcb6c5-2f3d-4e31-af08-d5b2a52ebd57.jpg"}, {"url": "https://sandbox-new.topenland.com/gateway/downloader/sale/260031-pic11_new-4033a38b-d69e-4abb-bed2-4c55995d90fb.jpg"}]',
    price: 2650000000,
    postTitle: 'Bán căn chung cư Miếu nỗi, diện tích sàn 53 m2. 1 phòng ngủ, tầng cao',
    unitOfMeasureId: '2e1b0f25-2772-4d71-aca1-9bd0c8fb9a74',
    propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
    propertyAddress: {
      homeAddress: '01',
      streetName: 'Vũ Huy Tấn',
      wardName: 'Phường 13',
      districtName: 'Bình Thạnh',
      cityName: 'Hồ Chí Minh',
      __typename: 'PropertyAddressInfo',
    },
    forRent: true,
    forSale: true,
    isSold: false,
    isRented: false,
    numberOfBedrooms: 2,
    numberOfBathrooms: 2,
    buildingArea: 53,
    totalSiteArea: null,
    capetAreas: null,
    commission: 1,
    isCreatedByAgent: true,
    isFollowed: false,
    direction: 'east',
    sellerInfo: {
      sellerId: '377dc01c-72cd-4cf8-8a24-8def5e71c16e',
      fullName: 'Võ Khắc Phúc',
      avatar:
        'https://sandbox-new.topenland.com/gateway/downloader/personal/image-5d2c59c7-c46b-4102-81e4-d8425ee6f6ff.png',
      email: 'baongn02@nomail.com',
      phoneNumber: '0349679120',
      isAgent: true,
      agentRating: 4.7,
      agentRankingName: 'rank5',
      agentGroupDescription: 'Rồng Vàng 1',
    },
    __typename: 'SearchPropertyPostInfoDto',
  };
  return mapProperty(data, () => data.price);
};

it('map property', () => {
  expect(mapPropertySample()).toMatchSnapshot();
});
