/* eslint-disable sonarjs/no-duplicate-string */
import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {ScrollView} from 'react-native';

import {configDecorator} from '../../../../../../storybook/utils/configDecorator';
import TradingDepositInput2View from './TradingDepositDetail2View';

storiesOf('z|c2c/ContactTrading', module)
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('TradingDepositInput2View', () => {
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <TradingDepositInput2View
          paymentProgressDtos={data.paymentProgressDtos}
          notarizationDatetime={data.notarizationDatetime}
          notaryOffice={data.notaryOffice}
          attachment={data.attachment}
          canEdit={data.canEdit}
          invalidPaymentDatetime={data.invalidPaymentDatetime}
          errors={data.errors}
          isTesting
        />
      </ScrollView>
    );
  });

const data = {
  canEdit: true,
  invalidPaymentDatetime: false,
  attachment: [
    {
      checked: true,
      id: 0,
      lastModified: 1652864834948,
      name: 'HopDongDatCoc_Kytay-4-3.docx',
      size: 45525,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uri: 'https://perstoresb.blob.core.windows.net/secured/1652864831126_HopDongDatCoc_Kytay-4-3.docx',
    },
    {
      checked: false,
      id: 1,
      lastModified: 1652864834948,
      name: 'BienBanXacNhan-7-3.pdf',
      size: 251822,
      type: 'application/pdf',
      uri: 'https://perstoresb.blob.core.windows.net/secured/1652864831131_BienBanXacNhan-7-3.pdf',
    },
    {
      checked: true,
      id: 0,
      lastModified: 1646714017607,
      name: '4.jpg',
      size: 254859,
      type: 'image/jpeg',
      uri: 'https://perstoresb.blob.core.windows.net/upload/1650895307973_9619baada5d74e19baa35978b76de598.jpg',
    },
    {
      checked: false,
      id: 1,
      lastModified: 1646714026136,
      name: '7.jpg',
      size: 288265,
      type: 'image/jpeg',
      uri: 'https://perstoresb.blob.core.windows.net/upload/1650895308245_53e6be268dfe4baca7e24b175f2347c6.jpg',
    },
    {
      checked: false,
      id: 2,
      lastModified: 1646714028899,
      name: '8.jpg',
      size: 500593,
      type: 'image/jpeg',
      uri: 'https://perstoresb.blob.core.windows.net/upload/1650895308286_3016ba27f0c84ff2a6b4a6e15b087c44.jpg',
    },
    {
      checked: false,
      id: 3,
      lastModified: 1646714490712,
      name: '14.jpg',
      size: 1297698,
      type: 'image/jpeg',
      uri: 'https://perstoresb.blob.core.windows.net/upload/1650895308339_23344133e39c418aab31054093d04a31.jpg',
    },
    {
      checked: false,
      id: 4,
      lastModified: 1652864936455,
      name: '20220514_203546.jpg',
      size: 2838153,
      type: 'image/jpeg',
      uri: 'https://perstoresb.blob.core.windows.net/upload/1652864930409_5785640061fc4175864a9acea214c203.jpg',
    },
    {
      checked: false,
      id: 5,
      lastModified: 1652864936455,
      name: '1(120).jpg',
      size: 37257,
      type: 'image/jpeg',
      uri: 'https://perstoresb.blob.core.windows.net/upload/1652864930523_ae25a99755c945b1aca745f41613c05f.jpg',
    },
    {
      id: 6,
      lastModified: 1652865641721,
      name: '86A06E73-2361-4E1F-A4DC-22900D051FB1.jpg',
      size: 4075105,
      type: 'image/jpeg',
      url: 'https://perstoresb.blob.core.windows.net/upload/1652865638655_2afa9632573848069a1137b2d1223a8a.jpg',
    },
    {
      id: 7,
      lastModified: 1652865641721,
      name: '0C20E15B-3AA1-4629-9BFB-543B072CB4EB.jpg',
      size: 2505426,
      type: 'image/jpeg',
      url: 'https://perstoresb.blob.core.windows.net/upload/1652865638753_e257f58b6185429e9b2fde70f95e35e0.jpg',
    },
  ],
  bankName: '6706039e-2e93-4519-bfb7-a7ffcc606447',
  closingPrice: 1000000000,
  consultantFee: 0,
  contractAttachment: null,
  depositNote:
    "Stainless steel case with a stainless steel bracelet. Fixed stainless steel bezel. Black dial with luminous rose gold-tone hands and index hour markers. Minute markers around the outer rim. Dial Type: Analog. Luminescent hands and markers. Day of the week and date display at the 3 o'clock position. TAG Heuer calibre 5 automatic movement, based upon ETA 2824-2, containing 26 Jewels, bitting at 28800 vph, and has a power reserve of approximately 38 hours. Scratch resistant sapphire crystal. uuw",
  depositPaymentTermFrom: 1650819600000,
  depositPaymentTermTo: 1651165199999,
  depositStatus: 'DEPOSITSENT',
  depositTerm: 1,
  depositUpdatedNumber: 19,
  depositedAmount: 300000000,
  depositedDate: 1650896473422,
  depositorEmail: null,
  depositorIdentityCard: null,
  depositorName: null,
  depositorPhoneNumber: null,
  moveInDate: null,
  notarizationDatetime: 1650460375133,
  notaryOffice: 'A',
  paymentMethodId: 'bf43f932-fe77-4ebc-8508-470a860d551f',
  paymentProgressDtos: [
    {
      amount: 3,
      minDate: new Date('2022-04-24T17: 00: 00.000Z'),
      paymentDatetime: 1650978869979,
      paymentProgressId: '019cdadb-af72-4f77-afa8-aac52269a904',
      paymentTerms: '',
      remainingPayAmount: 999999997,
    },
    {
      amount: 999999997,
      minDate: new Date('2022-04-27T13: 14: 29.979Z'),
      paymentDatetime: 1651066373218,
      paymentProgressId: 'ecf76a56-7f1f-4d43-acbb-0e1fdcf9e5bf',
      paymentTerms: '',
      remainingPayAmount: 0,
    },
  ],
  recipientEmail: null,
  recipientIdentityCard: null,
  recipientName: null,
  recipientPhoneNumber: null,
  rejectReason: null,
  rejectReasonId: null,
  rentPeriod: null,
  rentPeriodUnit: 'MONTH',

  errors: {
    paymentProgressDtos: '',
    notarizationDatetime: '',
    notaryOffice: '',
    note: '',
  },
};
