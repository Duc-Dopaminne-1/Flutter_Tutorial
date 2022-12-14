/* eslint-disable sonarjs/no-duplicate-string */
import {storiesOf} from '@storybook/react-native';
import React from 'react';
import reactotron from 'reactotron-react-native';

import {FloorView} from './FloorList';

storiesOf('z|Project/FloorView', module).add('Default!', () => {
  return <FloorView {...data} />;
});

const data = {
  sections: [
    {
      floor: '2',
      floorPlanPhotos: [],
      data: [
        [
          {
            __typename: 'PropertyPostDto',
            propertyPostId: '549c5c9c-a92f-4365-a1fc-98f5472031e5',
            propertyCode: 'A021',
            price: 13750000,
            priceNoVat: 1000000000,
            priceVat: 1100000000,
            numberOfBedrooms: 2,
            numberOfBathrooms: 2,
            direction: 'EAST',
            buildingArea: 70,
            numberOfBookingTransactions: null,
            assigned: false,
            unitOfMeasure: null,
            saleTrackingStatusId: '2382bf70-37dc-4080-806d-72805b793378',
            saleTrackingStatusName: 'waiting-deposit',
            saleTrackingStatusDescription: 'Đang mở đặt cọc',
          },
          {
            __typename: 'PropertyPostDto',
            propertyPostId: '54802c75-f863-45fd-b28a-c48f57b16864',
            propertyCode: 'A022',
            price: 13750000,
            priceNoVat: 1000000000,
            priceVat: 1100000000,
            numberOfBedrooms: 2,
            numberOfBathrooms: 2,
            direction: 'WEST',
            buildingArea: 70,
            numberOfBookingTransactions: null,
            assigned: false,
            unitOfMeasure: null,
            saleTrackingStatusId: '2382bf70-37dc-4080-806d-72805b793378',
            saleTrackingStatusName: 'opening-deposit',
            saleTrackingStatusDescription: 'Đang mở đặt cọc',
          },
        ],
        [
          {
            __typename: 'PropertyPostDto',
            propertyPostId: '13115979-bb65-46c7-80df-0764c67a245c',
            propertyCode: 'A023',
            price: 13750000,
            priceNoVat: 1000000000,
            priceVat: 1100000000,
            numberOfBedrooms: 2,
            numberOfBathrooms: 2,
            direction: 'SOUTH',
            buildingArea: 70,
            numberOfBookingTransactions: null,
            assigned: false,
            unitOfMeasure: null,
            saleTrackingStatusId: '2382bf70-37dc-4080-806d-72805b793378',
            saleTrackingStatusName: 'opening-deposit',
            saleTrackingStatusDescription: 'Đang mở đặt cọc',
          },
        ],
      ],
      total: 5,
    },
    {
      floor: '3',
      floorPlanPhotos: [],
      data: [
        [
          {
            __typename: 'PropertyPostDto',
            propertyPostId: '61675551-ef4c-4384-b0fd-b60f900d180b',
            propertyCode: 'A026',
            price: 13750000,
            priceNoVat: 1000000000,
            priceVat: 1100000000,
            numberOfBedrooms: 2,
            numberOfBathrooms: 2,
            direction: 'EAST',
            buildingArea: 70,
            numberOfBookingTransactions: null,
            assigned: false,
            unitOfMeasure: null,
            saleTrackingStatusId: '2382bf70-37dc-4080-806d-72805b793378',
            saleTrackingStatusName: 'sold',
            saleTrackingStatusDescription: 'Đang mở đặt cọc',
          },
          {
            __typename: 'PropertyPostDto',
            propertyPostId: 'b1343645-d726-4355-93e1-d276cf1defe3',
            propertyCode: 'A027',
            price: 13750000,
            priceNoVat: 1000000000,
            priceVat: 1100000000,
            numberOfBedrooms: 2,
            numberOfBathrooms: 2,
            direction: 'WEST',
            buildingArea: 70,
            numberOfBookingTransactions: null,
            assigned: false,
            unitOfMeasure: null,
            saleTrackingStatusId: '2382bf70-37dc-4080-806d-72805b793378',
            saleTrackingStatusName: 'sold',
            saleTrackingStatusDescription: 'Đang mở đặt cọc',
          },
        ],
        [
          {
            __typename: 'PropertyPostDto',
            propertyPostId: '0d2c1752-c677-42bd-82a6-a6e7c19f5dd7',
            propertyCode: 'A028',
            price: 13750000,
            priceNoVat: 1000000000,
            priceVat: 1100000000,
            numberOfBedrooms: 2,
            numberOfBathrooms: 2,
            direction: 'SOUTH',
            buildingArea: 70,
            numberOfBookingTransactions: null,
            assigned: false,
            unitOfMeasure: null,
            saleTrackingStatusId: '2382bf70-37dc-4080-806d-72805b793378',
            saleTrackingStatusName: 'opening-deposit',
            saleTrackingStatusDescription: 'Đang mở đặt cọc',
          },
          {
            __typename: 'PropertyPostDto',
            propertyPostId: 'ccc62be9-477c-4954-960b-dac79879685e',
            propertyCode: 'A029',
            price: 13750000,
            priceNoVat: 1000000000,
            priceVat: 1100000000,
            numberOfBedrooms: 2,
            numberOfBathrooms: 2,
            direction: 'NORTH',
            buildingArea: 70,
            numberOfBookingTransactions: null,
            assigned: false,
            unitOfMeasure: null,
            saleTrackingStatusId: '2382bf70-37dc-4080-806d-72805b793378',
            saleTrackingStatusName: 'opening-deposit',
            saleTrackingStatusDescription: 'Đang mở đặt cọc',
          },
        ],
        [
          {
            __typename: 'PropertyPostDto',
            propertyPostId: 'e110e964-e9e3-436e-b9b2-32197f512f9e',
            propertyCode: 'A030',
            price: 13750000,
            priceNoVat: 1000000000,
            priceVat: 1100000000,
            numberOfBedrooms: 2,
            numberOfBathrooms: 2,
            direction: 'EAST',
            buildingArea: 70,
            numberOfBookingTransactions: null,
            assigned: false,
            unitOfMeasure: null,
            saleTrackingStatusId: '2382bf70-37dc-4080-806d-72805b793378',
            saleTrackingStatusName: 'opening-deposit',
            saleTrackingStatusDescription: 'Đang mở đặt cọc',
          },
        ],
      ],
      total: 5,
    },
  ],
  propertyType: 'apartment',
  projectStatus: 'MODE_DEPOSIT',
  isAgentUser: true,
  onPressItem: item => reactotron.log(item),
  handleScrollAnimated: {current: {eventNames: ['onScroll'], reattachNeeded: false}},
  scrollSelectionList: {value: 0},
  POSTION_TOP_LIST: 0,
};
