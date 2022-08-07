import {storiesOf} from '@storybook/react-native';
import React from 'react';

import Filter, {Props} from './Filter';

storiesOf('z/Search/Filter', module) //format
  .add('default', () => {
    return <Filter {...props} />;
  });

const props: Props = {
  isShowPlaces: false,
  searchType: 0,
  onPressConfirm: () => {},
  onProjectPriceChanged: () => {},
  duplicateCityError: {},
  state: {
    keyword: '',
    itemsData: {
      propertyTypes: [
        {id: '2e2b0611-e1fc-4406-b13f-8afafff1c675', name: 'apartment', description: 'Căn hộ'},
        {id: '48cceac6-e202-494d-9b06-2374042f1044', name: 'villa', description: 'Biệt thự'},
        {id: 'b2ba5130-faa5-458c-aba8-58c505ac59b9', name: 'house', description: 'Nhà phố'},
        {id: '82cc71b0-704b-470c-bca8-5f967c0e11b7', name: 'land', description: 'Đất nền'},
      ],
      cities: [
        {id: 1, name: 'Hồ Chí Minh'},
        {id: 2, name: 'Hà Nội'},
        {id: 3, name: 'Đà Nẵng'},
        {id: 4, name: 'Bình Dương'},
        {id: 5, name: 'Đồng Nai'},
        {id: 6, name: 'Khánh Hòa'},
      ],
      directions: [
        {id: 'ALL', name: 'Tất cả', checked: true},
        {id: 'EAST', name: 'Đông', checked: false},
        {id: 'WEST', name: 'Tây', checked: false},
        {id: 'SOUTH', name: 'Nam', checked: false},
        {id: 'NORTH', name: 'Bắc', checked: false},
        {id: 'SOUTHEAST', name: 'Đông Nam', checked: false},
        {id: 'NORTHEAST', name: 'Đông Bắc', checked: false},
        {id: 'SOUTHWEST', name: 'Tây Nam', checked: false},
        {id: 'NORTHWEST', name: 'Tây Bắc', checked: false},
      ],
      numberOfRooms: [
        {id: 0, name: 'Tất cả', checked: true},
        {id: 1, name: '1+', checked: false},
        {id: 2, name: '2+', checked: false},
        {id: 3, name: '3+', checked: false},
        {id: 4, name: '4+', checked: false},
        {id: 5, name: '5+', checked: false},
      ],
      numberOfBathRooms: [
        {id: 0, name: 'Tất cả', checked: true},
        {id: 1, name: '1+', checked: false},
        {id: 2, name: '2+', checked: false},
        {id: 3, name: '3+', checked: false},
        {id: 4, name: '4+', checked: false},
        {id: 5, name: '5+', checked: false},
      ],
      propertyOrderBys: [
        {id: 'LATEST', name: 'Tin mới nhất', checked: true},
        {id: 'PRICELOWEST', name: 'Giá thấp nhất', checked: false},
        {id: 'PRICEHIGHEST', name: 'Giá cao nhất', checked: false},
        {id: 'SQUARELARGE', name: 'Diện tích lớn', checked: false},
        {id: 'SQUARESMALL', name: 'Diện tích nhỏ', checked: false},
      ],
      projectOrderBys: [
        {id: 'LATEST', name: 'Mới nhất', checked: true},
        {id: 'OLDEST', name: 'Lâu nhất', checked: false},
        {id: 'OPENING', name: 'Đang mở bán', checked: false},
        {id: 'COMINGSOON', name: 'Sắp mở bán', checked: false},
      ],
    },
    propertyTypeJson: [{id: '2e2b0611-e1fc-4406-b13f-8afafff1c675'}],
    rangePriceJson: [0, 50000000000],
    projectPriceJson: [0, 50000000000],
    rangeSquareJson: [0, 500],
    numberOfBedRoom: 0,
    numberOfBathRoom: 0,
    directionJson: '',
    placeJson: [],
    propertyPostOrderBy: 'LATEST',
    projectOrderBy: 'LATEST',
  },
};
