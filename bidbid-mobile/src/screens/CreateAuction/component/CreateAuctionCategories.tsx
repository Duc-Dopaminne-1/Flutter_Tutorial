import React, { ReactElement, useEffect, useState, memo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, screenWidth } from '@/vars';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import { getCategories } from '@/redux/auction/actions';
import { alertError } from '@/shared/alert';
import { useDispatch } from 'react-redux';
import { FormikValues } from 'formik';
import ErrorMessage from '@/components/ErrorMessage';
import { CreateAuctionTitle } from '@/screens/CreateAuction/component/CreateAuctionTitle';
import sortCategories from '@/shared/sortCategories';
import { useLocalizeNameField } from '@/shared/processing';

function CreateAuctionCategories({ setFieldValue, errors, setFieldError }: FormikValues): ReactElement {
  const dispatch = useDispatch();
  const [listDuration, setListDuration] = useState([]);
  const [listItemId, setListItemId] = useState([]);
  const localizeNameField = useLocalizeNameField();

  useEffect(() => {
    dispatch(
      getCategories({
        onSuccess,
        onFail: onFail,
      }),
    );
  }, []);

  const onSuccess = (data: any) => {
    setListDuration(data ? sortCategories(data.items) : []);
  };

  const onFail = (error: string) => {
    alertError(error);
  };

  const onPressItem = (id: number) => {
    if (listItemId.indexOf(id) > -1) {
      const data = listItemId.filter(item => item !== id);
      setFieldValue('categories', data);
      setFieldError('categories', '');
      setListItemId(data.concat());
      return;
    }
    listItemId.push(id);
    setFieldValue('categories', listItemId);
    setFieldError('categories', '');
    setListItemId(listItemId.concat());
  };

  const renderItem = ({ item }) => {
    const { id } = item;
    const isSelected = listItemId.indexOf(id) > -1;
    return (
      <CustomButton
        onPress={() => {
          onPressItem(id);
        }}
        wrapBtn={styles.wrapBtnDuration}
        containerStyle={[styles.wrapCtnBtnDuration, isSelected ? { backgroundColor: colors.blue_700, borderColor: colors.blue_700 } : {}]}
        textStyle={[styles.textBtn, isSelected ? { color: colors.white } : {}]}
        text={localizeNameField(item)}
      />
    );
  };

  const keyExtractor = item => item.id.toString();
  return (
    <View style={styles.container}>
      <CreateAuctionTitle isRequire title={language('categories')}>
        {listDuration.length > 0 ? (
          <Text style={styles.textTitle}>{language('categoriesUpto', { total: listDuration.length })}</Text>
        ) : null}
      </CreateAuctionTitle>

      <View style={styles.wrapTopDuration}>
        <FlatList
          data={listDuration}
          scrollEnabled={false}
          numColumns={3}
          key={'categories'}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
      <ErrorMessage errorValue={errors.categories} />
    </View>
  );
}

export default memo(CreateAuctionCategories);

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  wrapTopDuration: {
    flexDirection: 'row',
    marginTop: 2,
  },
  textTitle: {
    fontSize: fonts.size.s16,
    fontWeight: '500',
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  },
  wrapBtnDuration: {
    flex: null,
  },
  wrapCtnBtnDuration: {
    minHeight: null,
    height: null,
    paddingVertical: 8,
    borderRadius: 30,
    width: screenWidth / 3 - 25,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderColor: colors.gray_400,
    marginRight: 12,
    borderWidth: 1,
    paddingHorizontal: 2,
    marginTop: 12,
  },
  textBtn: {
    fontSize: fonts.size.s14,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    letterSpacing: 0,
    fontWeight: null,
  },
});
