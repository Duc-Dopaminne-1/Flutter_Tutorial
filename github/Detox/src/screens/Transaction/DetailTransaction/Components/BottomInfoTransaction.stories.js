import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {View} from 'react-native';

import {configDecorator} from '../../../../../storybook/utils/configDecorator';
import {normal} from '../../../../assets/theme/metric';
import BottomInfoTransaction from './BottomInfoTransaction';

storiesOf('z|b2c/BottomInfoTransaction', module) //format
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('Default', () => {
    return (
      <View style={{padding: normal}}>
        <BottomInfoTransaction {...props} />
      </View>
    );
  });

const props = {
  projectName: 'Reverside Đà nẵng',
  code: 'R01-2392',
  floor: '1',
  block: 'Ruby',
  propertyType: 'apartment',
  transactionCode: '#MD123SDFHJKL213',
  contractDueDate: '12/12/2022',
  customerInfo: {
    customerFirstName: 'Nguyễn văn A',
    customerEmail: 'tranvanc@gmail.com',
    customerPhone: '0948227472',
    customerNationalId: '213123123',
    customerNationalIdIssueDate: '12/12/2022',
    customerNationalIdIssuePlace: 'TP.HCM',
    customerDob: '08/09/1992',
    gender: 'Nam',
  },
  permanentAddress: '18a Kỳ Đồng, Phường 9, Quận 3, Tp.HCM',
  customerContactAddress: '11 Huỳnh Tịnh Của',
  consultantInfo: {
    fullName: 'Trần Hoa Hồng',
    email: 'hoangtran@gmail.com',
    phoneNumber: '0922812231',
  },
  navigation: () => {},
};
