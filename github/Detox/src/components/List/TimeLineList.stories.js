import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {ScrollView} from 'react-native';

import {normal} from '../../assets/theme/metric';
import {getListViews} from '../../screens/Transaction/DetailTransaction/Components/DetailTransactionContainer';
import TimeLineList from './TimeLineList';

storiesOf('z|b2c/TimeLineList', module)
  .add('Future', () => {
    data.depositType = 'Future';
    return (
      <ScrollView style={{padding: normal}}>
        <TimeLineList views={getListViews({data: data})} />
      </ScrollView>
    );
  })
  .add('OpeningDeposit', () => {
    data.depositType = 'OpeningDeposit';
    return (
      <ScrollView style={{padding: normal}}>
        <TimeLineList views={getListViews({data: data})} />
      </ScrollView>
    );
  })
  .add('RefundRequest', () => {
    data.depositType = 'RefundRequest';
    data.ableRequestRefund = false;
    return (
      <ScrollView style={{padding: normal}}>
        <TimeLineList views={getListViews({data: data})} />
      </ScrollView>
    );
  })
  .add('Refunded', () => {
    data.depositType = 'Refunded';
    return (
      <ScrollView style={{padding: normal}}>
        <TimeLineList views={getListViews({data: data})} />
      </ScrollView>
    );
  })
  .add('Deposited', () => {
    data.depositType = 'Deposited';
    return (
      <ScrollView style={{padding: normal}}>
        <TimeLineList views={getListViews({data: data})} />
      </ScrollView>
    );
  })
  .add('Waiting', () => {
    data.depositType = 'Waiting';
    return (
      <ScrollView style={{padding: normal}}>
        <TimeLineList views={getListViews({data: data})} />
      </ScrollView>
    );
  })
  .add('BookDeposited', () => {
    data.depositType = 'BookDeposited';
    return (
      <ScrollView style={{padding: normal}}>
        <TimeLineList views={getListViews({data: data})} />
      </ScrollView>
    );
  })
  .add('DepositTransfer', () => {
    data.depositType = 'DepositTransfer';
    return (
      <ScrollView style={{padding: normal}}>
        <TimeLineList views={getListViews({data: data})} />
      </ScrollView>
    );
  })
  .add('DepositEnded', () => {
    data.depositType = 'DepositEnded';
    data.isCurrentSaleSeason = true;
    return (
      <ScrollView style={{padding: normal}}>
        <TimeLineList views={getListViews({data: data})} />
      </ScrollView>
    );
  })
  .add('TransactionId null', () => {
    data.transactionId = '';
    return (
      <ScrollView style={{padding: normal}}>
        <TimeLineList views={getListViews({data: data})} />
      </ScrollView>
    );
  });

const data = {
  transactionType: 'Deposite',
  transactionCode: '#MDA00110ABC18DE330',
  startTransactionDateTime: '06/02/2021 08:32',
  agentFullName: '',
  agentPhoto: '',
  customerFullName: 'thinh thinh',
  customerPhoneNumber: '0948272726',
  projectName: 'Căn hộ Complete City',
  propertyTypeName: 'apartment',
  propertyCode: 'ABC18',
  floor: '2',
  blockName: 'Vici',
  isMeBuy: true,
  transactionId: '76be34b2-0e56-4a85-9fde-0fc9ebb216e2',
  shortNamePropertyType: 'Căn',
  bookingInfoTime: '',
  transactionStatus: 'deposited',
  transactionAmount: '10,000,000đ',
  transactionIndex: '1',
  price: '110đ',
  depositInfoTime: '06/02/2021 08:32',
  depositType: 'DepositEnded',
  endDepositeDatetime: 123,
  beginDepositeDatetime: '05/02/2021 11:32',
  saleOpenDate: '05/02/2021 11:32',
  transferredDepositCode: '#MD030345838373276',
  depositDuration: 'p',
  canTransferProperty: true,
  isSaleSeasonClosed: false,
  endTransactionTime: '10/02/2021 11:29',
  endTransactionType: 'Completed',
  canConfirmDesposit: false,
  depositeTransactionId: '76be34b2-0e56-4a85-9fde-0fc9ebb216ee',
  ableRequestRefund: true,
  projectId: 'cb47f9e2-734f-4169-95ea-768846b77259',
  saleSeasonId: 'f47a1c60-8c5d-46b3-bb4f-310ca366c1a2',
  isCurrentSaleSeason: false,
  rawData: {
    bookingTransactionId: '76be34b2-0e56-4a85-9fde-0fc9ebb216e2',
    bookingCode: '',
    depositeCode: '#MDA00110ABC18DE330',
    depositeTransactionId: '76be34b2-0e56-4a85-9fde-0fc9ebb216ee',
    confirmedBookingDatetime: null,
    confirmedDepositeDatetime: 1612575137468,
    transactionAmount: 10000000,
    transactionIndex: 1,
    transactionType: 'Deposited',
    transactionStatus: 'Đã xác nhận cọc',
    transactionStatusName: 'deposited',
    isBuyer: true,
    changeToTransaction: null,
    consultantInfo: {
      staffId: '974bdb52-b819-4448-9f79-0dfe01d92b19',
      staffCode: 'MCV000000005',
      fullName: 'saleconsultant saleconsultant',
      profilePhoto: null,
      email: 'saleconsultant@nomail.com',
      rating: 5,
    },
    customerInfo: {
      customerId: '623506da-b2e3-436e-8bc0-66575b7ce02b',
      customerFirstName: 'thinh',
      customerLastName: 'thinh',
      customerNationalId: '123123123',
      customerContactAddress: '123',
      customerPhone: '0948272726',
      customerEmail: 'HungThinh113@topenland.com',
    },
    propertyPostInfo: {
      blockCode: 'ABC18',
      blockName: 'Vici',
      numberOfFloor: null,
      floor: '2',
      price: 1.1,
      priceVat: 110,
      priceNoVat: 100,
      propertyCode: 'ABC18',
      propertyName: null,
      propertyPostId: '8c409815-efd8-4d99-a631-dfa81c570c65',
      propertyTypeName: 'apartment',
      propertyTypeId: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
      projectInfo: {
        projectId: 'cb47f9e2-734f-4169-95ea-768846b77259',
        projectCode: 'MDA00110',
        projectName: '[Nghiep Test] Không cần đặt chỗ - Cho đi đêm',
      },
      saleSeasonInfo: {
        saleSeasonId: 'f47a1c60-8c5d-46b3-bb4f-310ca366c1a2',
        seasonName: '1',
        isSkipBooking: true,
        startBookingDatetime: 1612499520000,
        endBookingDatetime: 1612499820000,
        openDatetime: 1612499520000,
        closeDatetime: 1612931340000,
      },
    },
  },
};
