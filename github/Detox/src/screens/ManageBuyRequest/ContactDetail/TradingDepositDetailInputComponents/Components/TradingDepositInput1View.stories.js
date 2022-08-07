/* eslint-disable sonarjs/no-duplicate-string */
import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {ScrollView} from 'react-native';

import {configDecorator} from '../../../../../../storybook/utils/configDecorator';
import TradingDepositInput1View from './TradingDepositInput1View';

storiesOf('z|c2c/ContactTrading', module)
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  )
  .add('TradingDepositInput1View', () => {
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <TradingDepositInput1View
          errors={data.errors}
          postPrice={data.propertyPostInfo.price}
          postCommission={data.propertyPostInfo.commission}
          propertyCode={data.propertyPostInfo.propertyCode}
          postCommissionUnitId={data.propertyPostInfo.saleCommissionCurrencyUnitId}
          numberOfDepositTimes={data.numberOfDepositTimes}
          depositStatus={data.depositStatus}
          rejectReason={data.rejectReason}
          closingPrice={data.closingPrice}
          commission={data.commission}
          commissionUnitId={data.commissionUnitId}
          commissionTpl={data.commissionTpl}
          depositedAmount={data.depositedAmount}
          depositPaymentTermFrom={data.depositPaymentTermFrom}
          depositPaymentTermTo={data.depositPaymentTermTo}
          depositTerm={data.depositTerm}
          bankName={data.bankName}
          paymentMethodId={data.paymentMethodId}
          banksData={[]}
          isTesting
        />
      </ScrollView>
    );
  });

const data = {
  propertyPostInfo: {
    buildingArea: 100,
    propertyPostId: '7984c9ff-0450-4279-92a9-28d5b181cc27',
    propertyCode: 'MTD858',
    postTitle: 'Cần bán căn hộ chính chủ - 100m2 - 1 pn - 1 wc - 11 Tỷ - Quận 7',
    propertyName: 'Cần bán căn hộ chính chủ - 100m2 - 1 pn - 1 wc - 11 Tỷ - Quận 7',
    numberOfBedrooms: 1,
    numberOfBathrooms: 1,
    price: 11000000000,
    commission: 1,
    createdByUserId: 'ec95d4fd-e2b9-403f-a7a0-cd9969939149',
    direction: 'SOUTHEAST',
    detailPath:
      '/bat-dong-san-ban/ho-chi-minh/quan-7/MTD858-can-ban-can-ho-chinh-chu---100m2---1-pn---1-wc---11-ty---quan-7',
    images:
      '[{"url": "https://perstoresb.blob.core.windows.net/images/1650007512119_8c289c3679304992911830a1a3f37330.jpg", "name": "1650007512119_8c289c3679304992911830a1a3f37330.jpg", "size": 0, "type": "image/jpeg", "width": null, "avatar": false, "height": null, "lastModified": 1650007519544}, {"url": "https://perstoresb.blob.core.windows.net/images/1652069124958_92a39e8d57c4441eb2fd480374e1ee8c.png", "name": "1650007511919_c718801c8292425fb1bf9839af026c37.jpg", "size": 0, "type": "image/jpeg", "width": null, "avatar": true, "height": null, "lastModified": 1650007519544}, {"url": "https://perstoresb.blob.core.windows.net/images/1650007512016_b797b39455d44126bf3cbb368618256f.jpg", "name": "1650007512016_b797b39455d44126bf3cbb368618256f.jpg", "size": 0, "type": "image/jpeg", "width": null, "avatar": false, "height": null, "lastModified": 1650007519544}, {"url": "https://perstoresb.blob.core.windows.net/images/1650007531443_f3dde2e67a794c1ca3e333e0ab6c55a4.jpg", "name": "1650007531443_f3dde2e67a794c1ca3e333e0ab6c55a4.jpg", "size": 0, "type": "image/jpeg", "width": null, "avatar": false, "height": null, "lastModified": 1650007533874}, {"url": "https://perstoresb.blob.core.windows.net/images/1650007592718_3eedca4b5db34cdd8c91224a687a8947.jpg", "name": "1650007592718_3eedca4b5db34cdd8c91224a687a8947.jpg", "size": 0, "type": "image/jpeg", "width": null, "avatar": false, "height": null, "lastModified": 1650007594185}, {"url": "https://perstoresb.blob.core.windows.net/images/1650007592725_3e1b86e156714d5c89288ed10d7a14fd.jpg", "name": "1650007592725_3e1b86e156714d5c89288ed10d7a14fd.jpg", "size": 0, "type": "image/jpeg", "width": null, "avatar": false, "height": null, "lastModified": 1650007594185}]',
    owner: {
      userId: 'ec95d4fd-e2b9-403f-a7a0-cd9969939149',
      customerFullName:
        'topener Tên Rất Dài Nên Đừng Có Đọc Hết, Chỉ Để Test Thôi. Mà Lỡ Đọc Rồi Thì Test Dùm Luôn :D',
      customerPhone: '0022337476',
      customerEmail: 'topener102@mail.com',
      __typename: 'OwnerInfoDto',
    },
    ownerIsAuthor: true,
    sellerInfo: {
      sellerId: 'ec95d4fd-e2b9-403f-a7a0-cd9969939149',
      fullName:
        'topener Tên Rất Dài Nên Đừng Có Đọc Hết, Chỉ Để Test Thôi. Mà Lỡ Đọc Rồi Thì Test Dùm Luôn :D',
      avatar:
        'https://perstoresb.blob.core.windows.net/upload/1651661415279_d68040cb7c274cada5b965c9369fc209.jpg',
      avatars: null,
      email: 'topener102@mail.com',
      phoneNumber: '0022337476',
      isAgent: true,
      agentGroupDescription: 'TopenLand',
      __typename: 'SellerInfo',
    },
    saleCommissionCurrencyUnitId: 'ffbe3353-e555-48f9-9166-8b41464c53b4',
    isCreateByAgent: true,
    propertyAddress: {
      countryName: 'Việt Nam',
      cityName: 'Hồ Chí Minh',
      districtName: 'Quận 7',
      wardName: 'Bình Thuận',
      homeAddress: null,
      streetName: '45',
      __typename: 'PropertyAddressInfoDto',
    },
    propertyPostForRentDto: null,
    __typename: 'PropertyPostForLastPublicVersionDto',
  },
  numberOfDepositTimes: 1,
  canEdit: true,
  invalidPaymentDatetime: false,
  bankName: '6706039e-2e93-4519-bfb7-a7ffcc606447',
  closingPrice: 1000000000,
  commission: 20000000,
  commissionTpl: 15,
  commissionUnitId: 'bda0d67d-769a-4061-9e96-a737d1f70bfe',
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
    depositedDate: '',
    commission: '',
    closingPrice: '',
    depositAmount: '',
    depositTerm: '',
    bankName: '',
  },
};
