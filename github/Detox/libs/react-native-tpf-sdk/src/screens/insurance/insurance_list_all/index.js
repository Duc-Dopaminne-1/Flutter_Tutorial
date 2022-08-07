import { useNavigation } from '@react-navigation/native';
import { compareProductsClear, compareProductsHandle } from '../../../redux/actions/credit';
import { getInsuranceByCategoryHandle } from '../../../redux/actions/insurance';
import { getShowAlertError } from '../../../redux/actions/system';
import { CREDIT } from '../../../redux/actionsType';
import { ICClose03 } from '../../../assets/icons';
import { PrimaryButton, WithLoading } from '../../../components/';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { COMPARE_PRODUCT } from '../../../constants/errors';
import { SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';
import InsuranceProduct from '../components/product';
import { PRODUCT_CATEGORY_TYPE } from '../../../global/app';
import { handleTouchItem } from '../../../helpers/handleTouchItem';
import SCREENS_NAME from '../../../constants/screens';
import { isIphoneX } from '../../../helpers/device';
import themeContext from '../../../constants/theme/themeContext';

const ImageItem = ({ item, removeImage, theme }) => {
  const onPress = () => {
    removeImage(item.id);
  };

  return (
    <View style={styles.groupContainer}>
      <TouchableOpacity onPress={onPress} style={styles.close}>
        <ICClose03 />
      </TouchableOpacity>
      <FastImage source={{ uri: item.image }} style={styles.image} />
      <Text
        style={[
          styles.textTitle,
          { color: theme?.text?.primary, fontFamily: theme?.fonts?.SEMIBOLD }
        ]}>
        {item.name}
      </Text>
    </View>
  );
};

const AllInsuranceListScreen = props => {
  const { route } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const category = route?.params?.category;
  const items = useSelector(state => state.insurance.insuranceProduct['' + category?.id] || []);
  const totalCount = useSelector(
    state => state.insurance.insuranceProductCount['' + category?.id] || 0
  );
  const loading = useSelector(state => state.insurance.insuranceByCategoryLoading);
  const success = useSelector(state => state.credit?.action);
  const { topenId } = useSelector(state => state.auth);
  const [comparationList, setComparationList] = useState([]);

  const theme = useContext(themeContext);

  useEffect(() => {
    navigation.setOptions({ title: category?.name, translate: false });
  }, [category, navigation]);

  useEffect(() => {
    dispatch(
      getInsuranceByCategoryHandle({
        categoryId: category?.id,
        skipCount: 0,
        maxResultCount: 5
      })
    );
  }, [dispatch, category]);

  const loadMore = useCallback(() => {
    if (totalCount > items.length && !loading) {
      dispatch(
        getInsuranceByCategoryHandle({
          categoryId: category?.id,
          skipCount: items.length
        })
      );
    }
  }, [items, totalCount, category, dispatch, loading]);

  const renderFooter = useCallback(() => (loading ? <ActivityIndicator /> : null), [loading]);

  const [isRefreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    dispatch(
      getInsuranceByCategoryHandle({
        categoryId: category?.id,
        skipCount: 0
      })
    );
  }, [dispatch, category]);

  useEffect(() => {
    return () => {
      dispatch(compareProductsClear());
    };
  }, [dispatch]);

  const onPress = useCallback(
    (event, item) => {
      handleTouchItem(
        event,
        'InsuranceItem',
        route,
        { ...item, categoryId: category?.id },
        topenId
      );
      navigation.navigate(SCREENS_NAME.INSURANCE_DETAIL_SCREEN, { item });
    },
    [route, category?.id, topenId, navigation]
  );

  const onAddComparation = useCallback(
    (checked, item) => {
      if (checked) {
        if (comparationList?.length < 2) {
          setComparationList(pre => {
            return [...pre, item];
          });
        } else {
          dispatch(getShowAlertError(COMPARE_PRODUCT));
        }
      } else {
        setComparationList(pre => {
          return [...pre.filter(t => t != item)];
        });
      }
    },
    [comparationList]
  );

  const renderProductItem = useCallback(
    ({ item }) => (
      <InsuranceProduct
        item={item}
        key={'Insurance' + item.id}
        style={styles.item}
        containerStyle={styles.itemContainer}
        fullWidth
        onPress={onPress}
        hasComparation
        checkedComparation={comparationList.indexOf(item) > -1}
        onAddComparation={onAddComparation}
      />
    ),
    [comparationList, onAddComparation, onPress]
  );
  const renderSeparator = () => <View style={styles.separator} />;

  const removeImage = id => {
    const temp = [...comparationList];
    const newArr = temp.filter(el => el?.id !== id);
    setComparationList(newArr);
  };

  if (success) {
    navigation.navigate(SCREENS_NAME.LOAN_COMPARISON, {
      type: PRODUCT_CATEGORY_TYPE.INSURANCE,
      categoryName: category?.name,
      data: comparationList
    });
  }

  const onCompare = () => {
    dispatch(
      compareProductsHandle({
        ProductId1: comparationList[0]?.id,
        ProductId2: comparationList[1]?.id
      })
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderProductItem}
        style={styles.productList}
        contentContainerStyle={styles.contentListContainer}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        ListFooterComponent={renderFooter}
      />

      <View
        style={[
          styles.comparationContainer,
          comparationList.length > 0 ? { ...Shadow } : { borderTopWidth: 1 }
        ]}>
        <View style={styles.compareContainer}>
          {comparationList.map(el => {
            return <ImageItem item={el} key={el.id} removeImage={removeImage} theme={theme} />;
          })}
        </View>
        <PrimaryButton
          translate
          title={'common.compare_products'}
          onPress={onCompare}
          disabled={comparationList?.length < 2}
        />
      </View>
    </View>
  );
};

export default WithLoading(AllInsuranceListScreen, [CREDIT.COMPARE_PRODUCTS.HANDLER]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  productList: {},
  contentListContainer: {
    paddingTop: SPACING.Medium,
    paddingBottom: SPACING.HtmlBottom,
    paddingHorizontal: SPACING.Medium
  },
  separator: {
    height: SPACING.Medium
  },
  comparationContainer: {
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    borderColor: CUSTOM_COLOR.GalleryDark,
    backgroundColor: BACKGROUND_COLOR.White
  },
  compareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap'
  },
  groupContainer: {
    width: scale(153),
    marginBottom: scale(16)
  },
  image: {
    width: scale(153),
    height: scale(90)
  },
  textTitle: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginTop: scale(4)
  },
  close: {
    zIndex: 9999,
    top: scale(-8),
    right: scale(-8),
    position: 'absolute',
    backgroundColor: BACKGROUND_COLOR.Primary,
    padding: scale(3),
    borderRadius: scale(30)
  }
});
