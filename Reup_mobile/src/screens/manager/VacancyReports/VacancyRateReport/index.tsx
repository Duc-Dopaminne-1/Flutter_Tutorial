import React, { } from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import CustomSectionHeader from '@components/CustomSection';
import translate from '@src/localize';
import { USER, GROUP } from '@constants/icons';
import styles from '@screens/manager/VacancyReports/styles';
import LineChartBezier from '@screens/manager/VacancyReports/Chart/LineChartBezier';

const VacancyReportsRate = () => {

  return (
    <View >
      <CustomSectionHeader
        title={translate('report.vacancy_rate_report')}
        icon={USER}
        style={styles.wrapHeader}
        rightComponent={
          <TouchableOpacity>
            <Image source={GROUP} style={{height: 32, width: 32}} />
          </TouchableOpacity>
        }
      />

      <View style={styles.wrapChart}>
        <LineChartBezier />
      </View>
    </View>
  );
};

export default React.memo(VacancyReportsRate);
