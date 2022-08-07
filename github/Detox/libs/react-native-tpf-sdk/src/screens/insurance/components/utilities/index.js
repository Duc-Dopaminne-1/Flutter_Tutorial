import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import {
  ICFinanceActive,
  ICFinanceInActive,
  ICInsurranceHealthyActive,
  ICInsurranceHealthyInActive
} from '../../../../assets/icons';
import { connect } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '../../../../components/app_text';
import SCREENS_NAME from '../../../../constants/screens';

const Utilities = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeName = route.name;

  const goToInsurrance = () => {
    if (routeName === SCREENS_NAME.INSURANCE_PROFILE) {
      return;
    }

    navigation.navigate(SCREENS_NAME.INSURANCE_PROFILE);
  };

  const goToFinance = () => {
    if (routeName === SCREENS_NAME.CREDIT_FILTER_SCREEN) {
      return;
    }

    navigation.navigate(SCREENS_NAME.CREDIT_FILTER_SCREEN);
  };

  const goToAdditionalServiceProfiles = () => {
    if (routeName === SCREENS_NAME.ADDITIONAL_SERVICE_PROFILES) {
      return;
    }

    // navigation.navigate('AdditionServiceLeadDetailScreen');
  };

  return (
    <View style={styles.utilitiesWrapper}>
      <View style={styles.container}>
        <TouchableOpacity onPress={goToFinance} style={[styles.item, styles.itemContainerLeft]}>
          {routeName === 'ProductScreen' ? <ICFinanceActive /> : <ICFinanceInActive />}
          <View style={styles.wrapText}>
            <AppText
              translate
              bold={routeName === 'ProductScreen'}
              style={routeName === 'ProductScreen' ? styles.textItemActive : styles.textItem}>
              {'product_screen.finance'}
            </AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToInsurrance}
          style={[styles.item, styles.itemContainerMiddle]}>
          {routeName === SCREENS_NAME.INSURANCE_PROFILE ? (
            <ICInsurranceHealthyActive />
          ) : (
            <ICInsurranceHealthyInActive />
          )}
          <View style={styles.wrapText}>
            <AppText
              translate
              style={
                routeName === SCREENS_NAME.INSURANCE_PROFILE
                  ? styles.textItemActive
                  : styles.textItem
              }>
              {'product_screen.insurrance'}
            </AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToAdditionalServiceProfiles}
          style={[styles.item, styles.itemContainerRight]}>
          {routeName === SCREENS_NAME.ADDITIONAL_SERVICE_PROFILES ? (
            <ICFinanceActive />
          ) : (
            <ICFinanceInActive />
          )}
          <View style={styles.wrapText}>
            <AppText
              translate
              style={
                routeName === SCREENS_NAME.ADDITIONAL_SERVICE_PROFILES
                  ? styles.textItemActive
                  : styles.textItem
              }>
              {'product_screen.added_service_title'}
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Utilities);
