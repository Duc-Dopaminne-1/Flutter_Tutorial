import React, { useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { CustomText } from '@src/components/CustomText';
import styles from './styles';

import CustomGroupRadioButton, { RadioButtonObject } from "@src/components/CustomGroupRadioButton";

import { CHECKBOX_UNSELECT } from '@src/constants/icons';
import CHECKBOX from '@res/img/checkbox.png';

import { CustomTouchable } from '@src/components/CustomTouchable';
import { upperCaseFirstChar } from '@src/utils';
import translate from '@src/localize';

interface Props {
  id?: string;
  dataKey?: string;
  title?: string;
  value?: string;
}

interface MonthOfYearItem {
  name?: string;
  active: boolean;
}

const RecurringDetailItem = (props: Props) => {

  const {
    dataKey,
    title,
    value,
  } = props;

  const hardMonthOfYears = [
    {
      name: "January",
      active: false,
    },
    {
      name: "February",
      active: false,
    },
    {
      name: "March",
      active: false,
    },
    {
      name: "April",
      active: false,
    },
    {
      name: "May",
      active: false,
    },
    {
      name: "June",
      active: false,
    },
    {
      name: "July",
      active: false,
    },
    {
      name: "August",
      active: false,
    },
    {
      name: "September",
      active: false,
    },
    {
      name: "October",
      active: false,
    },
    {
      name: "November",
      active: false,
    },
    {
      name: "December",
      active: false,
    },
  ];

  const [monthOfYears, setMonthOfYears] = useState(hardMonthOfYears);
  const [taskStatusIndex, setTaskStatusIndex] = useState(0);

  const radioBtnsData: RadioButtonObject[] = [
    { key: 1, label: "Active" },
    { key: 2, label: "Inactive" },
  ]

  const onCheckBoxClick = (index: number, item: MonthOfYearItem) => {
    const monthOfYearsClone = [...monthOfYears];
    monthOfYearsClone[index].active = !monthOfYears[index].active;
    setMonthOfYears(monthOfYearsClone);
  }

  const onStatusChange = (data: RadioButtonObject) => {
    setTaskStatusIndex(data.key);
  }

  const renderCheckBoxView = () => {
    var output = [];
    for (var i = 0; i < monthOfYears.length; i += 2) {
      var tempItem = (
        <View style={styles.monthOfYearView}>
          {renderCheckBox(i, monthOfYears[i])}
          {i + 1 < monthOfYears.length ? renderCheckBox(i + 1, monthOfYears[i + 1]) : (<></>)}
        </View>
      );
      output[i] = (tempItem);
    };
    return output;
  }

  const renderCheckBox = (index: number, item: MonthOfYearItem) => {
    return (
      <View style={styles.checkBoxItemView}>
        <CustomTouchable style={styles.checkBoxView} onPress={() => onCheckBoxClick(index, item)}>
          <Image source={item.active ? CHECKBOX : CHECKBOX_UNSELECT}
            resizeMode={'contain'}
            style={styles.checkBox} />
          <CustomText style={styles.checkBoxText} text={item.name ?? ''} />
        </CustomTouchable>
      </View>
    );
  }

  const renderLeftTitle = () => {
    if (dataKey !== 'task_status' && dataKey !== 'months_of_year') {
      return (
        <CustomText
          text={title ?? ''}
          style={styles.leftTextStyle}
        />
      );
    }
  }

  const renderContent = () => {
    switch (dataKey) {
      case 'status':
        const styleStatus = value ? styles.statusActive : styles.statusInActive;
        const styleTextStatus = value ? styles.statusTextActive : styles.statusTextInActive
        const textStatus = value ? translate('recurring_task.active') : translate('recurring_task.inactive')
        return (
          <View style={styles.textContainer}>
            <View style={[styles.status, styleStatus]}>
              <CustomText
                style={[styles.rightTextStyle, styleTextStatus]}
                text={upperCaseFirstChar(textStatus)}
              />
            </View>
          </View>
        );
      case 'priority':
        return (
          <View style={styles.textContainer}>
            <View style={[styles.rightTextStyle, styles.priority]}>
              <CustomText
                text={value ?? ''}
                style={[styles.priorityText]} />
            </View>
          </View>
        );
      // case 'months_of_year':
      //   return (
      //     <ScrollView >
      //       {renderCheckBoxView()}
      //     </ScrollView>
      //   );
      default:
        return (
          <View style={styles.textContainer}>
            <CustomText
              text={value ?? ''}
              style={styles.rightTextStyle} />
          </View>
        );
    }
  }

  return (
    <View style={[styles.itemContainer]}>
      {renderLeftTitle()}
      {renderContent()}
    </View>
  );
};

export default React.memo(RecurringDetailItem);
