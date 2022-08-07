import {storiesOf} from '@storybook/react-native';
import React from 'react';

import C2CPropertyItem from './C2CPropertyItem';

storiesOf('z|c2c/PropertyItem', module)
  .add('your-post', () => {
    return <C2CPropertyItem {...props} mode="your-post" />;
  })
  .add('saved-post', () => {
    return <C2CPropertyItem {...props} mode="saved-post" />;
  });

const props = {
  item: {
    address: '2 Le Duy Nhuan, Bình Chiểu, Thành phố Thủ Đức, Hồ Chí Minh.',
    buildingArea: 123,
    createdDatetime: '11/05/2022',
    direction: 'Đông Bắc',
    images:
      'https://perstoresb.blob.core.windows.net/images/1652235550969_3c981111028d4fd2adde6890bb489a3e.jpg',
    price: '12 tỷ',
    propertyPostId: '783d0dae-4c28-4181-b31c-8c932d0cdb6a',
    status: 'Chờ duyệt',
    statusStyle: {backgroundColor: '#FFF3EB'},
    statusTextStyle: {color: '#99521F'},
    title: 'Cần bán căn hộ chính chủ - 123m2 - 1 pn - 1 wc - 12 tỷ - Thành phố Thủ Đức',
  },
  onPress: () => {},
};
