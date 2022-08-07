import styles from './styles';
import Container from '@src/components/Container';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import ProductList from '@src/components/ProductList';


const ShoppingStore = () => {

  const onPressViewMore = () => {

  };

  return (
    <Container isShowHeader={true} isDisplayBackButton={false} title={"Store"}>
      <View style={styles.container}>
        <ProductList
          headerTitle="STORE"
          containerStyles={styles.productListContainer}
          datePickerContainerStyle={styles.datePickerContainer}
          isShowFilter={true}
          isShowStatus={true}
          isShowViewMore={false}
        />
      </View>
    </Container >
  );
};

export default ShoppingStore;
