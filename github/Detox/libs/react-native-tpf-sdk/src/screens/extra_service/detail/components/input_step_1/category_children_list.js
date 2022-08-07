import React, { useContext } from 'react';
import { TouchableOpacity, View, StyleSheet, ScrollView, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from '../../../../../utils/responsive';
import { FONT_SIZE } from '../../../../../constants/appFonts';
import themeContext from '../../../../../constants/theme/themeContext';
import AppText from '../../../../../components/app_text';
import { DEVICE_WIDTH } from '../../../../../constants/size';
import { BodyText, Heading, SmallText, SubHead } from '../../../../../components';
const CategoryChildrenList = props => {
  const {
    data,
    currentCategory,
    setCurrentCategory,
    categoryChildrenIfExist,
    setCategoryChildrenIfExist
  } = props;
  const theme = useContext(themeContext);
  const handleSetCurrentCategory = item => () => {
    setCurrentCategory({
      ...item,
      name: categoryChildrenIfExist?.categoryParentName + ' - ' + item?.name
    });
  };
  const renderItem = ({ item }) => {
    const isActive = currentCategory?.id === item?.id;
    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isActive && { borderWidth: 1, borderColor: theme.app.primaryColor1 }
        ]}
        onPress={handleSetCurrentCategory(item)}>
        <FastImage
          resizeMode={'stretch'}
          source={{ uri: item?.image || '' }}
          style={styles.avatar}
        />
        <View style={{ padding: scale(12) }}>
          <AppText numberOfLines={2} style={[styles.categoryName]}>
            {item?.name}
          </AppText>
          {/*<SubHead bold={false} style={{color: '#E53030'}} numberOfLines={2}>{`Giá tham khảo: ${123} VND`}</SubHead>*/}
        </View>
      </TouchableOpacity>
    );
  };
  const handleGoBack = () => {
    setCategoryChildrenIfExist({ visible: false, data: [] });
    setCurrentCategory(null);
  };
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Heading bold style={{ marginBottom: scale(15) }} translate>
          extra_service_detail.product_and_service
        </Heading>
        <SubHead bold={false} style={{ marginBottom: scale(5) }} translate>
          insurance_screen.products_name
        </SubHead>
        <BodyText bold>
          {currentCategory?.name || categoryChildrenIfExist?.categoryParentName}
        </BodyText>
        <TouchableOpacity
          style={[styles.buttonChoose, { borderColor: theme.app.primaryColor1 }]}
          onPress={handleGoBack}>
          <SmallText bold style={{ color: theme.app.primaryColor1 }} translate>
            extra_service_detail.choose_product_again
          </SmallText>
        </TouchableOpacity>
      </View>
    );
  };
  const numColumns = Math.round(data?.length / 2);
  return (
    <>
      {renderHeader()}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: scale(7) }}>
        <FlatList
          scrollEnabled={false}
          data={data}
          renderItem={renderItem}
          numColumns={numColumns}
        />
      </ScrollView>
    </>
  );
};
export default React.memo(CategoryChildrenList);
const styles = StyleSheet.create({
  categoryItem: {
    width: scale(248),
    borderRadius: scale(6),
    marginHorizontal: scale(8),
    marginBottom: scale(16),
    backgroundColor: '#FFF',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  avatar: {
    borderTopRightRadius: scale(6),
    borderTopLeftRadius: scale(6),
    width: '100%',
    height: scale(140)
  },
  categoryName: { fontSize: FONT_SIZE.BodyText },
  header: {
    padding: scale(16),
    marginBottom: scale(20),
    borderRadius: scale(6),
    marginTop: 2,
    backgroundColor: '#FFF',
    alignSelf: 'center',
    width: DEVICE_WIDTH - scale(15) * 2,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  productName: {
    fontSize: FONT_SIZE.SubHead
  },
  buttonChoose: {
    height: scale(32),
    width: scale(134),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(12),
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: scale(4)
  }
});
