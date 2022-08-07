import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import Header from '../../../../components/Header';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 500,
    minHeight: 400,
    ...METRICS.horizontalPadding,
    paddingTop: 40,
    paddingBottom: 16,
  },
  itemContainer: {
    ...METRICS.tinyVerticalPadding,
    ...HELPERS.rowSpaceBetweenCenter,
  },
  border: {
    borderBottomColor: COLORS.GREY_EA,
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...commonStyles.txtFontSize14,
    ...FONTS.bold,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  emptyDataText: {
    fontSize: 20,
    alignSelf: 'center',
    color: COLORS.GRAY_BD,
  },
  emptyTextContainer: {
    marginTop: 16,
  },
  txtGroup: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_33,
  },
  txtItem: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.GREY_82,
    ...METRICS.marginStart,
  },
  itemIcon: {
    width: 30,
    textAlign: 'right',
  },
});

const TopenLandOfficeItem = ({item, cities, onPress}) => {
  const city = cities ? cities.find(e => e.cityId === item.cityId) : {};
  return (
    <View style={[METRICS.microPaddingVertical, item?.fundAccountId !== null && styles.border]}>
      {item?.fundAccountId !== null ? (
        <TouchableOpacity
          onPress={() => {
            onPress(item);
          }}
          style={styles.itemContainer}>
          <Text numberOfLines={1} style={styles.txtItem}>
            {item?.branchName}
          </Text>
          <Icon
            style={styles.itemIcon}
            name={item.checked ? 'check-circle-outline' : 'radiobox-blank'}
            color={item.checked ? COLORS.PRIMARY_A100 : '#777777'}
            size={20}
          />
        </TouchableOpacity>
      ) : (
        <View style={METRICS.tinyVerticalPadding}>
          <Text style={styles.txtGroup}>{city?.cityName}</Text>
        </View>
      )}
    </View>
  );
};

const PaymentMethodModalContainer = ({state, title, onChosenTopenLandOffice = () => {}}) => {
  const onChosenOffice = item => {
    const newTopenLandOffices = state.topenLandOffices.map(e => {
      let checked;
      if (e.fundAccountId === item.fundAccountId) {
        checked = true;
      } else {
        checked = false;
      }
      return {
        ...e,
        checked,
      };
    });
    onChosenTopenLandOffice(newTopenLandOffices);
  };
  return (
    <View style={styles.container}>
      <Header leftTextStyle={styles.headerTitle} leftText={title} isBackable={false} />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {state?.topenLandOffices?.length > 0 ? (
          state?.topenLandOffices?.map((item, index) => (
            <TopenLandOfficeItem
              key={index}
              item={item}
              cities={state?.cities}
              onPress={onChosenOffice}
            />
          ))
        ) : (
          <View style={styles.emptyTextContainer}>
            <Text style={styles.emptyDataText}>{translate(STRINGS.DO_NOT_HAVE_DATA)}</Text>
          </View>
        )}
        <View style={commonStyles.separatorRow24} />
      </ScrollView>
    </View>
  );
};

export default PaymentMethodModalContainer;
