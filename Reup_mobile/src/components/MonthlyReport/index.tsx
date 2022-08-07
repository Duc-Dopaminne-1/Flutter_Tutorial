import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { CustomText } from '../CustomText';
import DropDown from '../CustomDropDown';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import styles from './styles';
import translate from '@src/localize';
import { Theme } from '../Theme';
import DropdownNative, { ObjDropdown } from '../Dropdown/DropdownNative';

interface MonthlyReportProps {
  data?: any;
}

const MonthlyReport = (props: MonthlyReportProps) => {
  const listColor = Theme.monthly_report.listMoneyColor;
  const weekTitle = ['1st Week', '2nd Week', '3rd Week', '4th Week'];
  const listMonth: ObjDropdown[] =
    [
      { _key: "January", _value: "January" },
      { _key: "February", _value: "February" },
      { _key: "March", _value: "March" },
      { _key: "April", _value: "April" },
      { _key: "May", _value: "May" },
      { _key: "June", _value: "June" },
      { _key: "July", _value: "July" },
      { _key: "August", _value: "August" },
      { _key: "September", _value: "September" },
      { _key: "October", _value: "October" },
      { _key: "November", _value: "November" },
      { _key: "December", _value: "December" }
    ];
  const currentMonth = moment().month();
  const [weekData, setWeekData] = useState<number[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  useEffect(() => {
    setWeekData([100000, 50000, 50000, 149392]);
  }, []);

  const renderWeekItem = (item: number, index: number) => {
    return (
      <View key={index} style={styles.weekItem}>
        <CustomText text={weekTitle[index]} style={styles.weekTitle} />
        <NumberFormat
          value={item}
          displayType={'text'}
          thousandSeparator={true}
          prefix={'$'}
          renderText={formattedValue => <CustomText text={formattedValue} style={[styles.weekContentText, { color: listColor[index] }]} />}
        />
      </View>
    );
  };

  const renderWeeklyView = () => {
    return (
      <View style={styles.weeklyContainer}>
        <CustomText text={translate('report.weekly_report')} style={styles.weeklyTitle} />
        {weekData.map((item, index) => renderWeekItem(item, index))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <CustomText text={translate('report.total_title')} style={styles.title} />
        <DropdownNative
          arrData={listMonth}
          containerStyle={styles.dropdownContainer}
          selected={selectedMonth}
          isShowAccessory={true}
          lineBottom={true}
          onChangeDropDown={obj => {
            setSelectedMonth(obj && obj._index ? obj._index : 0);
          }}
          linearGradientColors={['transparent', 'transparent']}
          textStyle={styles.dropdownText}
          iconRightStyle={styles.arrowStyle}
          buttonContainer={styles.buttonContainer}
          textTitle={'Choose month'}
          isHideTitle={true}
        />
      </View>
      <NumberFormat
        value={338923}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'$'}
        renderText={formattedValue => <CustomText numberOfLines={1} text={formattedValue} style={styles.totalNumber} />}
      />
      <View style={styles.line} />
      {renderWeeklyView()}
    </View>
  );
};
export default MonthlyReport;
