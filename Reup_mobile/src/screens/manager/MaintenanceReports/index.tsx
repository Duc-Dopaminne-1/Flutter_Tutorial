import React from 'react';
import { ScrollView } from 'react-native';
import MaintenanceByCategory from '@screens/manager/MaintenanceReports/MaintenanceByCategory';
import MaintenanceByTime from '@screens/manager/MaintenanceReports/MaintenanceByTime';
import styles from '@screens/manager/MaintenanceReports/styles';

const MaintenanceReports = () => {
  return (
    <ScrollView style={styles.container}>
      <MaintenanceByCategory />
      <MaintenanceByTime />
    </ScrollView>
  );
};

export default MaintenanceReports;
