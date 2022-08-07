import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../storybook/utils/configDecorator';
import {PropertyItem} from './FloorList';

storiesOf('z|b2c/SlotSelectItem', module) //format
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('default', () => {
    return (
      <>
        <PropertyItem
          status={'pening-deposit'}
          item={item}
          isAgentUser={false}
          propertyType={'land'}
          direction={'NORTH'}
        />
        <PropertyItem status={'booking'} item={item} />
        <PropertyItem status={'pile-outside'} item={item} />
        <PropertyItem status={'waiting-deposit'} item={item} isAgentUser={false} />
        <PropertyItem status={'booked'} item={item} />
      </>
    );
  });

const item = {
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
};
