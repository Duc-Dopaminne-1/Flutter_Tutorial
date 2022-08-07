import React from "react";
import Container from "@src/components/Container";
import styles from './styles';
import { View } from "react-native";
import MySaleList from "@src/components/MySaleList";
import { CustomButton } from "@src/components/CustomButton";
import translate from "@src/localize";


interface MySaleProps {

}

const MySale = (props: MySaleProps) => {

  const onPressAddProduct = () => {

  };

  const renderBottomButton = () => {
    return (
      <View style={styles.containerButton}>
        <CustomButton
          style={styles.buttonAddNew}
          text={translate("my_sale.add_new_product")}
          textStyle={styles.buttonAddNewtext}
          onPress={onPressAddProduct}
        />
      </View>
    );
  };

  return (
    <Container isShowHeader={true} title={translate("my_sale.title")} spaceBottom={true}>
      <View style={styles.container}>
        <MySaleList
          headerTitle={translate("my_sale.title").toUpperCase()}
          containerStyles={styles.productListContainer}
          isShowFilter={true}
        />
        {renderBottomButton()}
      </View>
    </Container>
  );

};
export default MySale;
