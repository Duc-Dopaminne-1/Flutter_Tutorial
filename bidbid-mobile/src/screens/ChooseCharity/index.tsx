import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View, Text } from 'react-native';
import { colors, fonts } from '@/vars';
import { SafeArea } from '@/components/SafeArea';
import SearchBar from '@/screens/Profile/ProfileEditSchoolSearch/components/SearchBar';
import { useDispatch } from 'react-redux';
import { getCharities } from '@/redux/auction/actions';
import CustomButton from '@/components/CustomButton';
import { language } from '@/i18n';
import { useNavigation } from '@react-navigation/native';
import { GlobalProps } from '@/shared/Interface';
import ChooseCharityFlatListItem from '@/screens/ChooseCharity/component/ChooseCharityFlatlistItem';

let value: any = '';
let pageTmp = 1;
let keywordTmp = '';
let totalRecord = 0;

export const resetValueCharity = () => {
  value = '';
  pageTmp = 1;
  keywordTmp = '';
  totalRecord = 0;
};

export function ChooseCharityScreen(props: GlobalProps): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [previousIdSelected, setPreviousIdSelected] = useState(-1);
  const [listCharities, setListCharities] = useState([]);
  const onAddCharities = props.route.params ? props.route.params?.onAddCharities : undefined;
  const itemSelected = props.route.params ? props.route.params?.itemSelected : null;
  const [isLoading, setIsLoading] = useState(false);

  const getCharity = (isFromSearch = false, isFromInitValue = false) => {
    setIsLoading(true);
    if (isFromSearch) {
      pageTmp = 1;
    }

    dispatch(
      getCharities({
        keyword: keywordTmp || undefined,
        perPage: 20,
        page: pageTmp,
        onSuccess: result => {
          setIsLoading(false);
          onSuccess(result, isFromSearch, isFromInitValue);
          pageTmp += 1;
        },
        onFail: () => {
          setIsLoading(false);
        },
      }),
    );
  };

  useEffect(() => {
    pageTmp = 1;
    keywordTmp = '';
    if (itemSelected && itemSelected.id !== -1) {
      value = itemSelected;
      setPreviousIdSelected(itemSelected.id);
      // keywordTmp = itemSelected.keywordTmp?.toString?.();
      getCharity(false, true);
      return;
    }
    getCharity();
  }, [itemSelected]);

  const onSuccess = (data: any, isFromSearch = false, isFromInitValue = false) => {
    const result = data.items.map(function (el) {
      const item = Object.assign({}, el);
      item.selected = false;
      return item;
    });
    totalRecord = data.meta.total;
    if (isFromSearch || isFromInitValue) {
      setListCharities(result);
      return;
    }
    setListCharities([...listCharities, ...result]);
  };

  const onChangeDataSearch = (_result: any[], keyword: string) => {
    keywordTmp = keyword;
    getCharity(true);
  };

  const charitiesData = useMemo(() => {
    return itemSelected?.id !== -1 ? [itemSelected, ...listCharities.filter(item => item.id !== itemSelected.id)] : listCharities;
  }, [itemSelected, listCharities]);

  const handleLoadMore = async () => {
    if (!isLoading && listCharities.length < totalRecord) {
      getCharity();
    }
  };

  const onSetSelect = (idSelected: number) => {
    const valueSelected = charitiesData.find(item => item.id === idSelected);
    if (valueSelected.id === previousIdSelected) {
      value = '';
      setPreviousIdSelected(-1);
    } else {
      value = valueSelected;
      setPreviousIdSelected(idSelected);
    }
  };

  const onApply = () => {
    if (!value) {
      return;
    }
    onAddCharities && onAddCharities(value, value.name);
    navigation.goBack();
  };

  const renderItem = ({ item }) => {
    return <ChooseCharityFlatListItem onSetSelect={onSetSelect} idSelected={previousIdSelected} item={item} />;
  };

  const keyExtractor = item => item.id.toString();

  const renderFooter = () => {
    if (!isLoading) {
      if (!charitiesData.length) {
        return <Text style={styles.emptyLabel}>{language('couldNotCharity')}</Text>;
      }
      return null;
    }
    return <ActivityIndicator color={colors.gray_500} style={styles.loading} />;
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <SearchBar
        isFromCharity
        searchField={'name'}
        inputData={[]}
        onChangeSuggestResult={onChangeDataSearch}
        searchPlaceholderText={language('search.searchingForYourCharity')}
      />

      <FlatList
        data={charitiesData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.1}
        onEndReached={handleLoadMore}
      />

      <CustomButton
        onPress={onApply}
        textStyle={styles.textBtn}
        containerStyle={[styles.btnContinue, value ? { backgroundColor: colors.red_700 } : {}]}
        text={language('apply')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  loading: {
    paddingVertical: 50,
    color: colors.red,
  },
  btnContinue: {
    width: null,
    backgroundColor: colors.bg_gray,
    paddingVertical: 13,
    marginTop: 12,
    marginBottom: 30,
    marginHorizontal: 16,
  },
  textBtn: {
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.white,
    fontWeight: null,
    fontSize: fonts.size.s18,
  },
  emptyLabel: {
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.text_gray,
    fontSize: fonts.size.s14,
    textAlign: 'center',
  },
});
