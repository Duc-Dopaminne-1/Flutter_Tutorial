import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {normal} from '../../../../assets/theme/metric';
import ContactTradingItem, {ContactTradingItemB2C} from './ContactTradingItem';

const Story = ({storyName, children}) => {
  return (
    <>
      <View style={styles.container}>
        <Text style={{fontSize: normal}}>{storyName}</Text>
      </View>
      {children}
    </>
  );
};

storiesOf('Items/ItemContactTrading', module) //format
  .add('B2C', () => (
    <View style={{padding: normal}}>
      <Story storyName={'B2C recived item'}>
        <ContactTradingItemB2C statusCode={'Processing'} data={data} />
      </Story>
      <Story storyName={'B2C sent item'}>
        <ContactTradingItemB2C statusCode={'Processing'} isSending={true} data={data} />
      </Story>
    </View>
  ))
  .add('C2C', () => (
    <View style={{padding: normal}}>
      <Story storyName={'C2C sent item'}>
        <ContactTradingItem isSending={true} data={dataC2C} />
      </Story>
      <Story storyName={'C2C received item'}>
        <ContactTradingItem isSending={false} data={dataC2C} />
      </Story>
    </View>
  ));

const dataC2C = {
  districtName: 'Quận 3',
  cityName: 'Hồ Chí Minh',
  contactTradingCode: 'CT-8',
  contactTradingId: '0f7717f3-6893-48d2-91b6-f16886cfa8cd',
  contactTradingStatusId: '722d95b4-dca6-4586-ba4d-6e0ad335ce97',
  createdDatetime: 1637936112918,
  customerFullName: 'Phạm Văn Nghệ',
  date: '26/11/2021 21:15',
  height: 206,
  price: '8 Tỷ',
  propertyCode: 'MTD12',
  requesterFullName: 'Lê Hoàng Trọng Khôi',
  statusObject: {
    backgroundColor: '#FFEAD2',
    color: '#D5600C',
    name: 'Chờ xác nhận',
  },
  updatedDatetime: 1637936112918,
};

const data = {
  contactTradingCode: 'CT-84',
  districtName: 'Thành phố Thủ Đức',
  additionData: 'MTD24',
  contactTradingB2CCode: 'YCLHMB2C000000006',
  contactTradingB2CStatusName: 'Processing',
  contactTrading: {
    __typename: 'ContactTradingDto',
    requesterFullName: 'nguyen nhudl4',
    contactTradingCode: 'CT-116',
    contactType: 'BUY',
  },
  propertyPostData:
    '{"price": 3000000000, "cityId": 1, "wardId": 172, "cityName": "Hồ Chí Minh", "wardName": "Hiệp Thành", "districtId": 13, "streetName": "ALI", "homeAddress": "22", "buildingArea": 100, "districtName": "Quận 12", "propertyCode": "MTD45"}',
  contactTradingB2CStatusDescription: 'Đang xử lý',
  customerFullName: 'Nguyễn Hưng Thịnh',
  projectInfoDto: {
    projectId: 'dda3e356-7dc3-478e-a9d1-0fba2d0d1c7d',
    projectName: 'NPN Căn hộ 2309',
    propertyPostCode: 'A023',
    propertyPostId: '749de12b-bf4b-4edf-874c-f95a69c63178',
  },
  requestDate: 1632449376152,
  height: 225,
  date: '24/09/2021 09:09',
  isRequester: false,
  itemType: 'Mua',
  postType: 'Dự án',
  status: 'Đang xử lý',
};

const styles = StyleSheet.create({
  container: {backgroundColor: 'lightgray', marginTop: normal, padding: 4},
});
