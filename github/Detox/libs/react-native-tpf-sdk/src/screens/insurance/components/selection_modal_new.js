import { ICClose, ICRadioCheck, ICRadioUncheck, ICRadioDisable } from '../../../assets/icons';
import AppText from '../../../components/app_text';
import Divider from '../../../components/divider';
import PrimaryButton from '../../../components/primary_button';
import { FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { BORDER_RADIUS, DEVICE_HEIGHT, DEVICE_WIDTH, SPACING } from '../../../constants/size';
import { formatNumber } from '../../../helpers/formatNumber';
import React, { useState, useContext } from 'react';
import { useCallback, useMemo, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import themeContext from '../../../constants/theme/themeContext';

export const SelectionModal = props => {
  const [selectedItem, setSelectedItem] = useState({});
  const { isVisible, data, title, onChange, onChangeVisible, translate = false } = props;
  const theme = useContext(themeContext);
  const onSelect = (item, productInfo) => {
    if (productInfo?.enable) {
      setSelectedItem(prev => ({ ...prev, [item?.attributeId]: item?.attributeOptionId }));
    }
  };

  const optionsProcessed = useMemo(() => {
    let options = new Map();
    let childs = new Map();
    data?.forEach(product => {
      product?.productEntityConfiguration.forEach(item => {
        if (!options.has(item.attributeId)) {
          options.set(item.attributeId, {
            attributeId: item.attributeId,
            attributeName: item.attributeName
          });
        }
        if (!childs.has(item.attributeOptionId)) {
          childs.set(item.attributeOptionId, {
            attributeOptionId: item.attributeOptionId,
            name: item.value,
            attributeId: item.attributeId,
            id: item.id,
            lastModificationTime: item.lastModificationTime,
            lastModifierUserId: item.lastModifierUserId,
            lastModifierUserName: item.lastModifierUserName,
            parentId: item.parentId,
            productEntityId: item.productEntityId,
            enable: product.enable
          });
        }
      });
    });
    options = Array.from(options, option => option[1]);
    childs = Array.from(childs, child => child[1]);

    const result = [...options];

    options.forEach((option, index) => {
      result[index]['childs'] = [];
      childs.forEach(child => {
        if (child.attributeId === option.attributeId) {
          result[index]['childs'].push(child);
        }
      });
    });
    return result;
  }, [data]);

  const getProduct = useCallback(
    selectedProduct => {
      let result = {};
      if (Object.keys(selectedProduct).length <= 0) {
        return {};
      }
      data?.forEach(product => {
        let isProductSelected = true;
        const attributeOptionIds = [];
        product?.productEntityConfiguration?.forEach(child => {
          attributeOptionIds.push(child.attributeOptionId);
        });
        for (const k in selectedProduct) {
          if (!attributeOptionIds.includes(selectedProduct[k])) {
            isProductSelected = false;
          }
        }
        if (isProductSelected) {
          result = product;
        }
      });
      return result;
    },
    [data]
  );

  const getProductInfo = (product, attributeId, attributeOptionId) => {
    const result = { ...selectedItem };
    product?.childs?.forEach(child => {
      if (attributeOptionId === child.attributeOptionId) {
        result[attributeId] = attributeOptionId;
      }
    });

    const productInfo = getProduct(result);
    const productSelectedInfo = getProduct(selectedItem);
    const minusPrice = productInfo?.price - productSelectedInfo?.price || 0;

    return {
      diffPrice:
        minusPrice > 0
          ? `+ ${formatNumber(minusPrice)}`
          : minusPrice < 0
          ? `- ${formatNumber(Math.abs(minusPrice))}`
          : null,
      enable: productInfo.enable
    };
  };

  useEffect(() => {
    const productActive = data?.find(product => product.enable);
    const productSelected = {};
    if (productActive?.productEntityConfiguration?.length > 0) {
      productActive.productEntityConfiguration.forEach(child => {
        productSelected[child?.attributeId] = child?.attributeOptionId;
      });
      setSelectedItem(productSelected);
    }
  }, [data]);

  const renderGroupItem = useCallback(() => {
    if (!optionsProcessed && optionsProcessed?.length <= 0) {
      return (
        <View style={styles.noItem}>
          <AppText translate style={styles.title}>
            {'common.noData'}
          </AppText>
        </View>
      );
    }
    const renderProductChilds = item => {
      const list = item?.childs?.map(child => {
        const productInfo = getProductInfo(item, item.attributeId, child.attributeOptionId);
        return (
          <TouchableOpacity
            key={item.attributeOptionId}
            style={styles.item}
            onPress={() => onSelect(child, productInfo)}
            disabled={!productInfo.enable}>
            <View style={[styles.leftContainer]}>
              {productInfo.enable ? (
                selectedItem?.[child.attributeId] === child.attributeOptionId ? (
                  <ICRadioCheck color1={theme?.app?.primaryColor1} />
                ) : (
                  <ICRadioUncheck />
                )
              ) : (
                <ICRadioDisable />
              )}
              <Text
                numberOfLines={1}
                style={[
                  styles.titleChild,
                  { color: theme?.text?.primary },
                  !productInfo.enable && styles.unEnableChildName
                ]}>
                {child?.name}
              </Text>
              {productInfo.diffPrice && productInfo.enable && (
                <Text
                  numberOfLines={1}
                  style={[
                    styles.titleChild,
                    { color: theme?.text?.primary },
                    !productInfo.enable && styles.unEnableChildName
                  ]}>
                  {`( ${productInfo.diffPrice} VND) `}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      });
      return <>{list}</>;
    };
    const renderProduct = item => {
      return (
        <View key={item.attributeId} style={styles.productArea}>
          <View>
            <Text style={[styles.title, { color: theme?.text?.primary }]}>
              {item?.attributeName}
            </Text>
          </View>
          {renderProductChilds(item)}
        </View>
      );
    };
    return optionsProcessed?.map(item => renderProduct(item));
  }, [optionsProcessed, selectedItem]);

  return (
    <View
      style={{
        width: isVisible ? '100%' : 0,
        height: isVisible ? '100%' : 0,
        position: 'absolute'
      }}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.backgound}
        onPress={() => onChangeVisible(false)}
      />
      <Animated.View style={styles.bodyBackground}>
        <View style={{ ...styles.container }}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => onChangeVisible(false)}>
              <ICClose />
            </TouchableOpacity>
            <AppText
              translate={translate}
              style={[
                styles.headerTitle,
                { color: theme?.text?.primary, fontFamily: theme?.fonts?.BOLD }
              ]}
              numberOfLines={2}>
              {title}
            </AppText>
          </View>
          <Divider />
          <View
            style={{
              ...styles.scrollContainer,
              maxHeight: DEVICE_HEIGHT * 0.65
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                ...styles.scrollContent
              }}>
              {renderGroupItem()}
            </ScrollView>
          </View>
          <View style={styles.priceArea}>
            <AppText
              numberOfLines={1}
              translate
              style={[
                styles.priceTitle,
                { fontFamily: theme?.fonts?.BOLD, color: theme?.text?.primary }
              ]}>
              common.contract_price
            </AppText>
            <Text
              translate
              style={[
                styles.price,
                { color: theme?.app?.primaryColor1, fontFamily: theme?.fonts?.BOLD }
              ]}>
              {`${formatNumber(getProduct(selectedItem)?.price)} VND`}
            </Text>
          </View>
          <View style={{ ...styles.footer }}>
            <PrimaryButton
              translate
              title={'common.confirm'}
              onPress={() => {
                onChange(getProduct(selectedItem));
                onChangeVisible(false);
              }}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: CUSTOM_COLOR.White,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS
  },
  backgound: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Black,
    opacity: 0.5,
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  bodyBackground: {
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    bottom: -1
  },
  headerRow: {
    paddingTop: SPACING.XXNormal,
    paddingBottom: SPACING.Fit,
    width: DEVICE_WIDTH
  },
  headerTitle: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    textAlign: 'center'
  },

  scrollContainer: {
    width: DEVICE_WIDTH
  },
  scrollContent: {
    paddingBottom: SPACING.Normal
  },
  noItem: {
    width: DEVICE_WIDTH * 0.85,
    alignItems: 'center',
    paddingVertical: SPACING.XSmall
  },
  title: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    flex: 1
  },
  titleChild: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginLeft: SPACING.Normal
  },
  footer: {
    paddingTop: SPACING.Small,
    paddingBottom: SPACING.BottomButton,
    marginHorizontal: SPACING.Medium
  },
  closeIcon: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.Medium
  },
  leftContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: SPACING.XNormal,
    alignItems: 'center'
  },
  priceArea: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.White,
    paddingVertical: SPACING.Medium,
    justifyContent: 'center'
  },
  price: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: TEXT_COLOR.BlueStone
  },
  priceTitle: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    flex: 1,
    paddingRight: SPACING.Medium
  },
  productArea: {
    borderBottomColor: CUSTOM_COLOR.GreyDivider,
    borderBottomWidth: 1,
    marginHorizontal: SPACING.Medium,
    paddingVertical: SPACING.Medium
  },
  unEnableChildName: {
    color: TEXT_COLOR.Gray
  }
});
