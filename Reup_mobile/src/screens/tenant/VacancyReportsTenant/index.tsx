import React from 'react';
import { View } from 'react-native';
import styles from '@screens/tenant/VacancyReportsTenant/styles';
import VacancyReportsRate from '@screens/tenant/VacancyReportsTenant/VacancyRateReport';

const VacancyReportsTenant = () => {
  return (
    <View style={styles.container}>
      <VacancyReportsRate />
    </View>
  );
};

export default VacancyReportsTenant;
