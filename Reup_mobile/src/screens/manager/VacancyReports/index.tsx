import React from 'react';
import { View } from 'react-native';
import styles from '@screens/manager/VacancyReports/styles';
import VacancyReportsRate from '@screens/manager/VacancyReports/VacancyRateReport';

const VacancyReports = () => {
  return (
    <View style={styles.container}>
      <VacancyReportsRate />
    </View>
  );
};

export default VacancyReports;
