import {storiesOf} from '@storybook/react-native';
import React from 'react';

import PoliciesList from './PoliciesList';

storiesOf('z|b2c/Policies', module) //format
  .add('default', () => <PoliciesList policies={POLICIES} />);

const POLICIES = [
  {
    startDate: 1629279900000,
    endDate: 1629363660000,
    policyTypeId: '4fce41ee-0a75-4db7-b62b-693b87347f07',
    policyName: 'Ch\u00EDnh s\u00E1ch \u0111\u1EB7t c\u1ECDc 1',
    attachment:
      'https://sandbox-citus.topenland.com/gateway/downloader/sale/file-example_PDF_1MB-677215e1-c5d8-4c85-a3bb-f146ed9bd855.pdf',
    __typename: 'PolicyDto',
  },
  {
    startDate: 1629279900000,
    endDate: 1629363660000,
    policyTypeId: '4fce41ee-0a75-4db7-b62b-693b87347f08',
    policyName: 'Ch\u00EDnh s\u00E1ch \u0111\u1EB7t c\u1ECDc 2',
    attachment:
      'https://sandbox-citus.topenland.com/gateway/downloader/sale/file-example_PDF_1MB-677215e1-c5d8-4c85-a3bb-f146ed9bd855.pdf',
    __typename: 'PolicyDto',
  },
  {
    startDate: 1629279900000,
    endDate: 1629363660000,
    policyTypeId: '4fce41ee-0a75-4db7-b62b-693b87347f07',
    policyName: 'chinh sach dat coc 2',
    attachment: 'file-sample_1MB.docx',
    __typename: 'PolicyDto',
  },
];
