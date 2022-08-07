import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  InvestorDto,
  SearchInvestorOrderBy,
  useSearchAllFoInvestorsLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {EMPTY_TYPE} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal} from '../../../assets/theme/metric';
import LazyList, {PAGING_TYPE} from '../../../components/LazyList';
import PageScreen from '../../../components/PageScreen';
import {extractAddressData} from '../../../utils/DataProcessUtil';
import {checkValidImageUrl} from '../../../utils/ImageUtil';
import ScreenIds from '../../ScreenIds';
import SearchHeader from '../../Search/components/SearchHeader';

type InvestorItems = {
  logo: String,
  investorName: String,
  address: String,
  phone: String,
  id: String,
};

export const mapToUiModel = (item: InvestorDto) => {
  return {
    code: item?.investorCode,
    logo: item?.logo,
    id: item?.investorId,
    investorName: item.investorName,
    address: extractAddressData(item?.address),
    phone: item.phoneNumber,
  };
};

export const ItemInvestor = ({item, onPressItem}: {item: InvestorItems}) => {
  const logoSource = checkValidImageUrl(item?.logo) ? {uri: item?.logo} : null;
  return (
    <TouchableOpacity onPress={onPressItem} style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <FastImage style={styles.itemImage} source={logoSource} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item?.investorName?.trim()}
        </Text>
        <Text style={styles.itemAddress} numberOfLines={1}>
          {item?.address}
        </Text>
        <Text style={styles.itemPhone} numberOfLines={1}>
          {item?.phone || '--'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const renderListItem = ({item}, onPressItem) => (
  <ItemInvestor item={item} onPressItem={() => onPressItem(item)} />
);

const InvestorInformationList = ({navigation}) => {
  const [keyword, setKeyword] = useState('');

  const queryParams = {
    input: {
      keyword: keyword,
      page: 1,
      pageSize: 16,
      orderBy: SearchInvestorOrderBy.Investorlatest,
    },
  };

  const onPressItem = (item): InvestorItems => {
    navigation.navigate(ScreenIds.InvestorDetail, {investorCode: item.code, investorId: item.id});
  };

  return (
    <PageScreen title={translate('investor.list.title')}>
      <SearchHeader
        renderLeft={false}
        showRightIcon={false}
        onChangeKeyword={setKeyword}
        placeholder={translate('investor.list.placeHolder')}
        style={styles.searchHeader}
        container={styles.searchHeaderContainer}
      />
      <LazyList
        useQuery={useSearchAllFoInvestorsLazyQuery}
        queryOptions={{variables: queryParams}}
        extractArray={response => response?.searchFOInvestors?.investorInfoDtos ?? []}
        mapToUiModel={mapToUiModel}
        renderItem={listProps => renderListItem(listProps, onPressItem)}
        pagingType={PAGING_TYPE.OFFSET}
        emptyType={EMPTY_TYPE.DEFAULT}
      />
    </PageScreen>
  );
};

const styles = StyleSheet.create({
  searchHeader: {
    marginHorizontal: normal,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_BORDER,
    borderRadius: SIZES.BORDER_RADIUS_10,
    marginBottom: 10,
  },
  searchHeaderContainer: {
    paddingVertical: 5,
  },
  itemContainer: {
    paddingBottom: SIZES.PADDING_16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_F0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 22,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_C4,
    height: 44,
    width: 44,
  },
  itemImage: {
    flex: 1,
    borderRadius: 22,
  },
  itemInfo: {flex: 1, marginLeft: normal},
  itemName: {...FONTS.bold, fontSize: SIZES.FONT_16, lineHeight: SIZES.FONT_16_LINE_HEIGHT},
  itemAddress: {...FONTS.regular, fontSize: SIZES.FONT_14, lineHeight: SIZES.FONT_14_LINE_HEIGHT},
  itemPhone: {...FONTS.regular, fontSize: SIZES.FONT_14, lineHeight: SIZES.FONT_14_LINE_HEIGHT},
});

export default InvestorInformationList;
