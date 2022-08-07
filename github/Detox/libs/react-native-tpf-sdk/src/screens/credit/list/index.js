import { useNavigation } from '@react-navigation/native';
import {
  compareProductsClear,
  compareProductsHandle,
  getLoanProductListClear,
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
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';
import ProductItem from '../components/product_item';
import { PRODUCT_CATEGORY_TYPE } from '../../../global/app';
import AppText from '../../../components/app_text';
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
        <ICClose03 color1={theme?.text?.secondary} />
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

const CreditSuggestedList = props => {
  const productFilter = useSelector(state => state.credit?.productFilter);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const list = useSelector(state => state.credit?.list);
  const totalCount = useSelector(state => state.credit?.totalCount);
  const loading = useSelector(state => state.credit?.loading);
  const success = useSelector(state => state.credit?.action);
  const [comparationList, setComparationList] = useState([]);
  const [isRefreshing, setRefreshing] = useState(false);
  const theme = useContext(themeContext);
  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <ProductItem
          hasComparation
          item={item}
          isHot={index < 3}
          checkedComparation={comparationList.indexOf(item) > -1}
          onAddComparation={onAddComparation}
          route={props.route}
        />
      );
    },
    [comparationList, onAddComparation, props.route]
  );

  const _keyExtractor = item => item?.id;
  useEffect(() => {
    navigation.setOptions({
      backAction: () => {
        navigation.goBack();
      }
    });
  }, []);

  useEffect(() => {
    onRefresh();
    return () => {
      dispatch(getLoanProductListClear());
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
      getLoanProductListHandle({
        categoryId: productFilter.categoryId,
        skipCount: 0
      })
    );
  }, [dispatch, productFilter]);

  const loadMore = useCallback(() => {
    if (!loading && list?.length < totalCount) {
      dispatch(
        getLoanProductListHandle({
          categoryId: productFilter.categoryId,
          skipCount: list.length
        })
      );
    }
  }, [dispatch, loading, list, totalCount, productFilter]);

  if (success) {
    navigation.navigate(SCREENS_NAME.LOAN_COMPARISON, {
      type: PRODUCT_CATEGORY_TYPE.CREDIT,
      categoryName: productFilter?.categoryName,
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

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.wrapper}
        data={list || []}
        renderItem={renderItem}
        onEndReached={loadMore}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        showsVerticalScrollIndicator={false}
        keyExtractor={_keyExtractor}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyListContainer}>
              <AppText translate>additional_service_profiles.no_products</AppText>
            </View>
          ) : null
        }
      />

      <View
        style={[
          styles.actionContainer,
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
          disabled={comparationList?.length < 2}
          onPress={onCompare}
        />
      </View>
    </View>
  );
};

export default WithLoading(CreditSuggestedList, [CREDIT.COMPARE_PRODUCTS.HANDLER]);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  wrapper: {
    paddingTop: SPACING.Large,
    paddingBottom: SPACING.HtmlBottom
  },
  emptyListContainer: {
    paddingTop: scale(50),
    alignItems: 'center'
  },
  actionContainer: {
    borderColor: '#F0F0F0',
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary
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
    borderRadius: 10,
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
