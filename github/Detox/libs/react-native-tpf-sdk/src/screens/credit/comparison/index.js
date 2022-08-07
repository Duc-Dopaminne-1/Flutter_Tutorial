import { useNavigation } from '@react-navigation/native';
import { SPACING } from '../../../constants/size';
import React, { useContext, useEffect } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PRODUCT_CATEGORY_TYPE } from '../../../global/app';
import BankItem from '../components/bank_item';
import ComparisonItem from '../components/comparison_item';
import { styles } from './styles';
import { compareProductsClear } from '../../../redux/actions/credit';
import themeContext from '../../../constants/theme/themeContext';

const LoanComparison = props => {
  const { data, categoryName, type } = props.route.params;
  const navigation = useNavigation();
  const compareProducts = useSelector(state => state.credit?.compareProducts);
  const { fonts, text } = useContext(themeContext) || {};
  const renderItem = ({ item, index }) => {
    return (
      <ComparisonItem
        item={item}
        isFirst={index === 0}
        isLast={index === compareProducts?.listAttribute?.length - 1}
      />
    );
  };

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(compareProductsClear());
    };
  }, [dispatch]);

  useEffect(() => {
    navigation.setOptions({
      title:
        type == PRODUCT_CATEGORY_TYPE.CREDIT
          ? 'loan_package.compare_product'
          : 'insurance_screen.compare_insurance'
    });
  }, [type, navigation]);

  const _keyExtractor = (item, index) => index + '';

  return (
    <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={[styles.productName, { color: text?.primary, fontFamily: fonts?.BOLD }]}>
          {categoryName}
        </Text>
        <View style={styles.bankComparison}>
          <BankItem item={data[0]} key={0} type={type} />
          <View style={{ width: SPACING.Medium }} />
          <BankItem item={data[1]} key={1} type={type} />
        </View>
      </View>
      <FlatList
        key={_keyExtractor}
        style={styles.scrollContainer}
        contentContainerStyle={styles.wrapper}
        showsVerticalScrollIndicator={false}
        data={compareProducts?.listAttribute || []}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};
export default LoanComparison;
