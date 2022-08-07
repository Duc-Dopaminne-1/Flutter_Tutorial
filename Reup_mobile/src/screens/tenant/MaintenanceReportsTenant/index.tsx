import React from 'react';
import { ScrollView } from 'react-native';
import MaintenanceByCategoryTenant from '@screens/tenant/MaintenanceReportsTenant/MaintenanceByCategoryTenant';
import MaintenanceByTimeTenant from '@screens/tenant/MaintenanceReportsTenant/MaintenanceByTimeTenant';
import styles from '@screens/tenant/MaintenanceReportsTenant/styles';

const MaintenanceReportsTenant = () => {
  return (
    <ScrollView style={styles.container}>
      <MaintenanceByCategoryTenant />
      <MaintenanceByTimeTenant />
    </ScrollView>
  );
};

export default MaintenanceReportsTenant;
