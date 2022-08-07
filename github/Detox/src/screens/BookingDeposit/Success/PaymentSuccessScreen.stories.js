import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../../storybook/utils/configDecorator';
import {SuccessScreenContainer} from './SuccessScreen';

storiesOf('z|b2c/PaymentSuccessScreen', module)
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('Deposit', () => {
    data.transactionDetail.transactionType = 'Deposite';
    data.transactionType = 'Deposite';
    data.title = 'Xác nhận quyền tham gia đặt cọc thành công';
    data.isBooking = false;
    return (
      <SuccessScreenContainer transactionCode={data.transactionDetail.depositeCode} {...data} />
    );
  })
  .add('Booking', () => {
    data.transactionDetail.transactionType = 'Booking';
    data.transactionType = 'Booking';
    data.title = 'Đặt chỗ thành công';
    data.isBooking = true;
    return (
      <SuccessScreenContainer transactionCode={data.transactionDetail.depositeCode} {...data} />
    );
  });

const data = {
  title: 'Xác nhận quyền tham gia đặt cọc thành công',
  buttonReviewPostTitle: 'Xem trạng thái xác nhận cọc',
  isBooking: false,
  transactionId: 'd525d981-7ebd-4919-be1f-f8994c405f4f',
  transactionDetail: {
    bookingTransactionId: null,
    bookingCode: '#MDA00041A001DE124',
    depositeCode: '#MDA00041A001DE124',
    depositeTransactionId: 'd525d981-7ebd-4919-be1f-f8994c405f4f',
    transactionAmount: 10000000,
    transactionIndex: 1,
    transactionType: 'Deposite',
    propertyPostInfo: {
      blockName: 'Tiểu khu 1',
      floor: 1,
      propertyCode: 'A001',
      propertyTypeName: 'apartment',
      projectInfo: {__typename: 'ProjectInfoDto', projectName: '[Test] NPN biệt thự 0203'},
    },
  },
  consultantInfo: {
    fullName: 'Thinh nguyen',
    profilePhoto: '',
  },
  projectInfo: {
    projectName: 'test test',
  },
  transactionType: 'Deposite',
};
