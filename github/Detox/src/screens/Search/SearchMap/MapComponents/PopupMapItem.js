import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {ITEM_MAP_TYPE} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {normal, small} from '../../../../assets/theme/metric';
import BannerImageProject from '../../../../components/BannerImageProject';
import {useFormatPrice} from '../../../Home/useFormatPrice';
import ScreenIds from '../../../ScreenIds';

const windowHeight = Dimensions.get('window').height;
const ITEM_HEIGHT = 135;
const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    padding: SIZES.PADDING_16,
  },
  viewImage: {flex: 0.7, borderRadius: SIZES.BORDER_RADIUS_16},
  viewInfo: {
    flex: 1,
    marginLeft: normal,
    paddingVertical: small,
    justifyContent: 'space-between',
  },
  textPrice: {color: COLORS.PRIMARY_A100, fontSize: SIZES.FONT_16, ...FONTS.bold},
  textCommission: {color: COLORS.PRIMARY_B100, fontSize: SIZES.FONT_16, ...FONTS.bold},
  textArea: {fontSize: SIZES.FONT_16, ...FONTS.bold, color: COLORS.TEXT_DARK_10},
  textAddress: {...FONTS.regular, color: COLORS.TEXT_DARK_40},
  txtDirection: {...FONTS.regular, fontSize: SIZES.FONT_16, color: COLORS.TEXT_DARK_30},
  wrapperPopup: {
    borderTopLeftRadius: SIZES.BORDER_RADIUS_8,
    borderTopRightRadius: SIZES.BORDER_RADIUS_8,
    overflow: 'hidden',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    maxHeight: windowHeight * 0.5,
  },
  line: {
    height: 1,
    backgroundColor: COLORS.NEUTRAL_DIVIDER,
    marginHorizontal: SIZES.PADDING_16,
  },
});

const mapDataItem = ({data, formatPrice, type = ITEM_MAP_TYPE.project}) => {
  const itemData =
    type === ITEM_MAP_TYPE.project
      ? {
          image: data?.featurePhotos,
          name: data?.projectName,
          price: `${translate('common.fromPrice')} ${formatPrice(
            data?.minPrice,
            '2e1b0f25-2772-4d71-aca1-9bd0c8fb9a74',
          )}`,
          commission: data?.commissionRates,
          projectId: data?.projectId,
        }
      : {
          image: data?.images,
          name: data?.title,
          commission: data.commission,
          propertyPostId: data?.propertyPostId,
          address: data?.address,
          info: {
            price: data?.price,
            area: `${data?.buildingArea}m2`,
            direction: data?.direction,
          },
        };
  return itemData;
};

const InfoItem = ({type, itemData}) => {
  if (type === ITEM_MAP_TYPE.project) {
    return (
      <View style={styles.viewInfo}>
        <Text numberOfLines={2} style={{...FONTS.bold, fontSize: normal}}>
          {itemData?.name}
        </Text>
        <Text style={styles.textPrice}>{`${itemData?.price}`}</Text>
        <Text style={styles.textCommission}>{`${translate('common.commission')} ${
          itemData?.commission || '--'
        }`}</Text>
      </View>
    );
  }
  return (
    <View style={styles.viewInfo}>
      <Text numberOfLines={2} style={{...FONTS.bold, fontSize: normal}}>
        {itemData?.name}
      </Text>
      <Text style={styles.textAddress} numberOfLines={1}>
        {itemData?.address}
      </Text>
      <View style={HELPERS.rowCenter}>
        <Text style={styles.textCommission}>
          {itemData?.info?.price} - <Text style={styles.textArea}>{itemData?.info?.area}</Text>
        </Text>
        <View style={HELPERS.fill} />
        <Text style={styles.txtDirection}>{itemData?.info?.direction}</Text>
      </View>
    </View>
  );
};

const PopupItem = ({data, onPress, type, formatPrice, showLineBottom}) => {
  const itemData = mapDataItem({data, type, formatPrice});
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={{
        height: ITEM_HEIGHT,
      }}>
      <View style={styles.container}>
        <View style={styles.viewImage}>
          <BannerImageProject
            url={itemData?.image}
            height={'100%'}
            isProperty
            width={'100%'}
            isShowFollowButton={false}
          />
        </View>
        <InfoItem type={type} itemData={itemData} />
      </View>
      {showLineBottom && <View style={styles.line} />}
    </TouchableOpacity>
  );
};

const PopupMapItem = ({type = ITEM_MAP_TYPE.project, style, currentData}) => {
  const navigation = useNavigation();
  const {formatPrice} = useFormatPrice();

  const onPressItem = item => {
    if (type === ITEM_MAP_TYPE.project) {
      navigation.navigate(ScreenIds.ProjectDetail, {
        projectId: item.projectId ?? '',
      });
    } else {
      navigation.navigate(ScreenIds.ViewPropertyPost, {
        propertyPostId: item.propertyPostId ?? '',
        viewByOtherMode: true,
      });
    }
  };

  const renderContent = () => {
    if (currentData?.length) {
      return (
        <FlatList
          data={currentData}
          renderItem={({item, index}) => {
            return (
              <PopupItem
                type={type}
                data={item}
                formatPrice={formatPrice}
                onPress={() => onPressItem(item)}
                showLineBottom={index !== currentData?.length - 1}
              />
            );
          }}
        />
      );
    }
    return (
      <PopupItem
        type={type}
        data={currentData}
        formatPrice={formatPrice}
        onPress={() => onPressItem(currentData)}
        showLineBottom={false}
      />
    );
  };

  return (
    <View style={[styles.wrapperPopup, style]}>
      {renderContent()}
      <SafeAreaView />
    </View>
  );
};

export default PopupMapItem;
