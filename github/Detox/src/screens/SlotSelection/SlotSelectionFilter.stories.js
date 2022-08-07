import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {View} from 'react-native';

import {HELPERS} from '../../assets/theme/helpers';
import SlotSelectionFilter from './SlotSelectionFilter';

storiesOf('z|b2c/FilterFloorModal', module) //format
  .add('default!', () => {
    return (
      <View style={HELPERS.fill}>
        <SlotSelectionFilter {...data} />
      </View>
    );
  });

const data = {
  filterData: {
    bathRoomData: [
      {id: 0, name: 'Tất cả', checked: true},
      {id: 1, name: '1+', checked: false},
      {id: 2, name: '2+', checked: false},
      {id: 3, name: '3+', checked: false},
      {id: 4, name: '4+', checked: false},
      {id: 5, name: '5+', checked: false},
    ],
    bedRoomData: [
      {id: 0, name: 'Tất cả', checked: true},
      {id: 1, name: '1+', checked: false},
      {id: 2, name: '2+', checked: false},
      {id: 3, name: '3+', checked: false},
      {id: 4, name: '4+', checked: false},
      {id: 5, name: '5+', checked: false},
    ],
    directionsData: [
      {id: 'NULL', name: 'Tất cả', checked: true},
      {id: 'EAST', name: 'Đông', checked: false},
      {id: 'WEST', name: 'Tây', checked: false},
      {id: 'SOUTH', name: 'Nam', checked: false},
      {id: 'NORTH', name: 'Bắc', checked: false},
      {id: 'SOUTHEAST', name: 'Đông Nam', checked: false},
      {id: 'NORTHEAST', name: 'Đông Bắc', checked: false},
      {id: 'SOUTHWEST', name: 'Tây Nam', checked: false},
      {id: 'NORTHWEST', name: 'Tây Bắc', checked: false},
    ],
    direction: 'NULL',
    priceRange: [0, 50],
    acreageRange: [0, 500],
    numberOfBathRooms: 0,
    numberOfBedRooms: 0,
  },
  projectTypeName: 'apartment',
  projectStatus: 'MODE_DEPOSIT',
};
