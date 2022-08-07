import React, { useRef } from 'react';
import Container from '@src/components/Container';
import { View } from 'react-native';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { MY_PURCHASE } from '@src/constants/icons';
import { styles } from './styles';
import { CustomFlatList } from '@src/components/FlatList';
import MyPurchaseItem, { IMyPurchaseItem } from '@src/components/FlatListItem/MyPurchaseItem';
import NavigationActionsService from '@src/navigation/navigation';
import { PRODUCT_DETAIL_TENANT } from '@src/constants/screenKeys';
import { CurrencyList, ShoppingProductStatus } from '@reup/reup-api-sdk/libs/api/enum';
import { IProductGetResponse } from '@reup/reup-api-sdk/libs/api/shopping_store/models';

const dummyData: IMyPurchaseItem[] = [
  {
    seller: {
      avatar: 'https://image.freepik.com/free-photo/happy-man-with-newspaper_23-2147694656.jpg',
      name: 'Nulla Facilisi',
      aparment_code: 'Block A - 1071'
    },
    products: [
      {
        id: '1',
        created: '22/05/2020',
        modified: '',
        owner: {
          pk: 'Block A384',
          first_name: 'Su',
          last_name: 'Test',
          email: 'supami@domail.com',
          phone: '08272227',
          phone_code: '+84'
        },
        property_id: '',
        category: {
          id: '1',
          name: 'Shoes for men'
        },
        image_urls: ['https://images-na.ssl-images-amazon.com/images/I/41Leu3gBUFL.jpg'],
        name: 'Lorem ipsum dolor sit amet, cosec tetur adipiscing elit',
        price: 262,
        is_removed: false,
        currency: CurrencyList.Usd,
        description: 'Maecenas rhoncus lacus sed turpis feugiat egestas',
        thumbnail: 'https://images-na.ssl-images-amazon.com/images/I/41Leu3gBUFL.jpg',
        status: ShoppingProductStatus.Denied,
        is_sold: false,

      },
      {
        id: '1',
        created: '22/05/2020',
        modified: '',
        owner: {
          pk: 'Block A383',
          first_name: 'Su',
          last_name: 'Test',
          email: 'supami@domail.com',
          phone: '08272227',
          phone_code: '+84'
        },
        property_id: '',
        category: {
          id: '1',
          name: 'Shoes for men'
        },
        image_urls: ['https://images-na.ssl-images-amazon.com/images/I/41Leu3gBUFL.jpg'],
        name: 'Lorem ipsum dolor sit amet, cosec tetur adipiscing elit',
        price: 262,
        is_removed: false,
        currency: CurrencyList.Usd,
        description: 'Maecenas rhoncus lacus sed turpis feugiat egestas',
        thumbnail: 'https://images-na.ssl-images-amazon.com/images/I/41Leu3gBUFL.jpg',
        status: ShoppingProductStatus.Denied,
        is_sold: false,

      },
    ],
    total_price: 262
  },
  {
    seller: {
      avatar: 'https://image.freepik.com/free-photo/happy-man-with-newspaper_23-2147694656.jpg',
      name: 'Nulla Facilisi',
      aparment_code: 'Block A - 1071'
    },
    products: [
      {
        id: '1',
        created: '22/05/2020',
        modified: '',
        owner: {
          pk: 'Block A385',
          first_name: 'Su',
          last_name: 'Test',
          email: 'supami@domail.com',
          phone: '08272227',
          phone_code: '+84'
        },
        property_id: '',
        category: {
          id: '1',
          name: 'Shoes for men'
        },
        image_urls: ['https://images-na.ssl-images-amazon.com/images/I/41Leu3gBUFL.jpg'],
        name: 'Lorem ipsum dolor sit amet, cosec tetur adipiscing elit',
        price: 262,
        is_removed: false,
        currency: CurrencyList.Usd,
        description: 'Maecenas rhoncus lacus sed turpis feugiat egestas',
        thumbnail: 'https://images-na.ssl-images-amazon.com/images/I/41Leu3gBUFL.jpg',
        status: ShoppingProductStatus.Denied,
        is_sold: false,

      },
    ],
    total_price: 262
  }
];

const MyPurchaseTenant = () => {

  const flatList = useRef<any>(null);

  const onPressFilter = () => {

  };

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => { };

  const onPressContactManager = () => {

  };

  const onPressProductDetail = (item: IProductGetResponse) => {
    NavigationActionsService.push(PRODUCT_DETAIL_TENANT, { data: item });
  };

  const _renderItem = (item: IMyPurchaseItem) => {
    return (
      <MyPurchaseItem
        item={item}
        onPressContactManager={onPressContactManager}
        onPressProductDetail={onPressProductDetail}
      />
    );
  };

  const renderHeader = () => (
    <CustomSectionHeader
      style={styles.sectionHeader}
      title={translate('my_purchase.section_header_title')}
      icon={MY_PURCHASE}
      isShowFilter={true}
      onPressFilter={onPressFilter}
    />
  );

  const renderContentView = () => (
    <View style={styles.listContainer}>
      <CustomFlatList
        ref={flatList}
        onLoad={onLoad}
        data={dummyData}
        renderItem={_renderItem}
        contentContainerStyle={{ flexGrow: 1, }}
      />
    </View>
  );


  return (
    <Container
      spaceBottom={true}
      isShowHeader={true}
      isDisplayBackButton={true}
      title={translate('my_purchase.title')}

    >
      {renderHeader()}
      <View style={styles.container}>
        {renderContentView()}
      </View>

    </Container >
  );
};

export default MyPurchaseTenant;
