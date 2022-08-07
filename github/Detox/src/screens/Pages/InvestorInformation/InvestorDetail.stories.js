import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {ScrollView} from 'react-native';

import {configDecorator} from '../../../../storybook/utils/configDecorator';
import {InvestorDetailContainer} from './InvestorDetail';

storiesOf('z|InvestorDetail', module)
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  ) //format
  .add('default', () => {
    return (
      <ScrollView>
        <InvestorDetailContainer {...props} />
      </ScrollView>
    );
  });

const props = {
  investorDetail: {
    introduction: {
      logo: null,
      name: 'Chủ đầu tư mới',
      address: '123 123.',
      website: 'https://google.com',
      phone: '0948228282',
      dateOfEstablishment: '09/03/2022',
      charterCapital: '23000 tỷ',
      areas: 'Công nghệ thông tin',
      introduce: ' 1231231231231',
    },
    activityImages: [
      {
        xhr: {uid: 'rc-upload-1646809916853-5', avatar: true},
        name: '54f5ec2062784ea9a0fef63ba9e0ca73.jpg',
        size: 43683,
        type: 'image/jpeg',
        avatar: true,
        status: 'done',
        percent: 0,
        response: null,
        lastModified: 1470044397000,
        originFileObj: {uid: 'rc-upload-1646809916853-5', avatar: true},
        lastModifiedDate: '2016-08-01T09:39:57.000Z',
      },
    ],
  },
  otherInvestorData: [
    {
      __typename: 'InvestorDto',
      investorId: '0389f914-7b1c-4b07-bca8-afa7b6c99de6',
      investorCode: 'MCDT00060',
      logo: null,
      investorName: 'Chủ đầu tư mới',
      detailPath: null,
      isActive: true,
      isDeleted: false,
    },
  ],
};
