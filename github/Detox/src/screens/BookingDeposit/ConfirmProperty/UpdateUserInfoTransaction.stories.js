import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../../storybook/utils/configDecorator';
import {UpdateUserInfoTransaction} from './UpdateUserInfoTransaction';

storiesOf('z|b2c/UpdateUserInfoTransaction', module)
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
      isHaveApolloNetwork: true,
    }),
  )
  .add('default', () => {
    return <UpdateUserInfoTransaction {...props} />;
  });

const props = {
  state: {
    permanentAddress: {
      city: {id: 1, name: 'Hồ Chí Minh'},
      district: {id: 1, name: 'Bình Chánh'},
      ward: {id: 4, name: 'Bình Lợi'},
      street: '123',
    },
    contactAddress: {
      city: {id: 4, name: 'Bình Dương'},
      district: {id: 65, name: 'Dầu Tiếng'},
      ward: {id: 991, name: 'Định An'},
      street: '321',
    },
    firstName: 'Thinh',
    lastName: 'Nguyen',
    email: 'hungthinh222@topenland.com',
    dob: 1628133045685,
    phoneNumber: '0927117271',
    nationalId: null,
    nationalIdIssueDate: 1533427200000,
    nationalIdIssuePlace: '123',
    nationalIdType: {id: 0, title: 'CMND', value: 'CMND'},
    gender: {id: 0, title: 'Nam', value: 'MALE'},
  },
  addressCities: [{id: 1, name: 'Hồ Chí Minh', checked: true}],
  contactCities: [
    {id: 62, name: 'Bắc Kạn', checked: false},
    {id: 63, name: 'Cao Bằng', checked: false},
  ],
  errors: {},
  contextType: 'NewDeposit',
  bookingFee: '20,000 VND',
  isSameAddress: false,
};
