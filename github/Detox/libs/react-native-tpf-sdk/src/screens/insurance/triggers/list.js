import { useNavigation } from '@react-navigation/native';
import {
  compareProductsClear,
  compareProductsHandle,
  getLoanProductListHandle
} from '../../../redux/actions/credit';
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
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';
import { PRODUCT_CATEGORY_TYPE } from '../../../global/app';

import SCREENS_NAME from '../../../constants/screens';
import { isIphoneX } from '../../../helpers/device';
import {
  getFlowByTriggerCodeClear,
  getFlowByTriggerCodeHandle
} from '../../../redux/actions/masterData';
import InsuranceProduct from '../components/product';
import { handleTouchItem } from '../../../helpers/handleTouchItem';
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

const TriggerProductList = props => {
  const navigation = useNavigation();
  const { route } = props;
  const dispatch = useDispatch();
  const list = useSelector(state => state.masterData?.productListFlow);
  const totalCount = useSelector(state => state.masterData?.totalCountProductListFlow);
  const loading = useSelector(state => state.masterData?.flowTriggerLoading);
  const success = useSelector(state => state.credit?.action);
  const triggerTarget = useSelector(state => state.masterData.trigger);
  const [comparationList, setComparationList] = useState([]);
  const [isRefreshing, setRefreshing] = useState(false);
  const { topenId } = useSelector(state => state.auth);
  const theme = useContext(themeContext);

  const renderProductItem = useCallback(
    ({ item, index }) => {
      return (
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
      );
    },
    [comparationList, onAddComparation, props.route]
  );

  useEffect(() => {
    //onRefresh();
    return () => {
      dispatch(getFlowByTriggerCodeClear());
      dispatch(compareProductsClear());
    };
  }, [onRefresh, dispatch]);

  useEffect(() => {
    if (!loading && isRefreshing) {
      setRefreshing(false);
    }
  }, [loading, isRefreshing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setComparationList([]);
    dispatch(
      getFlowByTriggerCodeHandle({
        triggerCode: triggerTarget.triggerCode,
        skipCount: 0
      })
    );
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (!loading && list?.length < totalCount) {
      dispatch(
        getFlowByTriggerCodeHandle({
          triggerCode: triggerTarget.triggerCode,
          skipCount: list.length
        })
      );
    }
  }, [dispatch, loading, list, totalCount]);

  if (success) {
    navigation.navigate(SCREENS_NAME.LOAN_COMPARISON, {
      type: PRODUCT_CATEGORY_TYPE.INSURANCE,
      data: comparationList
    });
  }

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
          return [...pre.filter(t => t !== item)];
        });
      }
    },
    [dispatch, comparationList]
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const removeImage = id => {
    const temp = [...comparationList];
    const newArr = temp.filter(el => el?.id !== id);
    setComparationList(newArr);
  };

  const onCompare = () => {
    dispatch(
      compareProductsHandle({
        ProductId1: comparationList[0]?.id,
        ProductId2: comparationList[1]?.id
      })
    );
  };

  const onPress = useCallback(
    (event, item) => {
      handleTouchItem(event, 'InsuranceItem', route, { ...item }, topenId);
      navigation.navigate(SCREENS_NAME.INSURANCE_DETAIL_SCREEN, { item });
    },
    [route, topenId, navigation]
  );
  const renderFooter = useCallback(() => (loading ? <ActivityIndicator /> : null), [loading]);

  return (
    <View style={styles.container}>
      <FlatList
        data={list || []}
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

export default WithLoading(TriggerProductList, [CREDIT.COMPARE_PRODUCTS.HANDLER]);
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
