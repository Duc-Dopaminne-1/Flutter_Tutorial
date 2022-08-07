import styles from './styles';
import Container from '@src/components/Container';
import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import translate from '@src/localize';
import CustomTabbar from '@src/components/CustomTabbar';
import { LineChart } from '@src/components/Charts/LineChart';
import MonthlyReport from '@src/components/MonthlyReport';
import MaintenanceReports from '@screens/manager/MaintenanceReports';
import VacancyReports from '@screens/manager/VacancyReports';

const Report = (props: any) => {

  const renderFinancial = () => {
    return (
      <ScrollView style={{ marginTop: 7 }}>
        <View style={styles.lineChartContainer}>
          <LineChart />
        </View>
        <View style={styles.monthlyReportContainer}>
          <MonthlyReport />
        </View>
      </ScrollView>
    );
  };

  const titles = ["Financial Reports", "Vacancy Reports", "Maintenance Reports", "Valuation Reports"];
  const views = [renderFinancial(), VacancyReports(), MaintenanceReports(), MaintenanceReports()];

  return (
    <Container isShowHeader={true} title={translate('report.navigation_title')} isDisplayBackButton={false}>
      <CustomTabbar page={props.route?.params?.page} styleContainer={{ marginTop: 8 }} titles={titles} views={views} />
    </Container>
  );
};

export default Report;
