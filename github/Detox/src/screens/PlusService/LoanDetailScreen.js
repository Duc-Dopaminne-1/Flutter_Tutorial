import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {normal, small, tiny} from '../../assets/theme/metric';
import PageScreen from '../../components/PageScreen';

const GRAY_BACKGROUND = '#ECECEC';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: normal,
    marginBottom: normal,
  },
  headerView: {
    backgroundColor: GRAY_BACKGROUND,
    marginHorizontal: normal,
  },
  headerText: {
    fontWeight: 'bold',
  },
  item: {
    ...HELPERS.row,
    backgroundColor: COLORS.BACKGROUND,
    paddingVertical: small,
  },
  id: {
    width: 40,
    ...FONTS.regular,
    paddingLeft: tiny,
  },
  value: {
    ...HELPERS.fill,
    ...FONTS.regular,
  },
});

const Item = ({item, index}) => {
  const id = index + 1;
  const value1 = item[0];
  const value2 = item[1];
  const value3 = item[2];

  const backgroundColor = index % 2 === 0 ? COLORS.BACKGROUND : GRAY_BACKGROUND;

  return (
    <View style={[styles.item, {backgroundColor: backgroundColor}]}>
      <Text style={styles.id}>{id}</Text>
      <Text style={styles.value}>{value1}</Text>
      <Text style={styles.value}>{value2}</Text>
      <Text style={styles.value}>{value3}</Text>
    </View>
  );
};

const Header = () => {
  const id = '#';
  const value1 = 'Dư nợ đầu kỳ';
  const value2 = 'Tiền lãi vay';
  const value3 = 'Tiền trả trong tháng';

  return (
    <View style={[styles.item, styles.headerView]}>
      <Text style={[styles.id, styles.headerText]}>{id}</Text>
      <Text style={[styles.value, styles.headerText]}>{value1}</Text>
      <Text style={[styles.value, styles.headerText]}>{value2}</Text>
      <Text style={[styles.value, styles.headerText]}>{value3}</Text>
    </View>
  );
};

const LoanDetailScreen = ({route}) => {
  const {data} = route.params;

  return (
    <PageScreen title={translate(STRINGS.PAYMENT_DETAIL)}>
      <Header />
      <FlatList
        style={styles.container}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => <Item item={item} index={index} />}
      />
    </PageScreen>
  );
};

export default LoanDetailScreen;
