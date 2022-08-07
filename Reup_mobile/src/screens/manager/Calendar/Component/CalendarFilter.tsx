import React from "react";
import { View } from "react-native";
import styles from "../styles";
import translate from "@src/localize";
import NavigationActionsService from "@src/navigation/navigation";
import { FILTER } from "@src/constants/screenKeys";
import { upperCase } from 'lodash';
import ICON_CALENDAR from '@src/res/icons/icon_calendar.png';
import CustomSectionHeader from "@src/components/CustomSection";

export interface Filter {
  building: string,
  country: string,
  sortByMonthWeek: string
}

interface Prop {
  isFilter?: boolean;
  onApplyFilter?: (data: Filter) => void
}

const CalendarFilter = (props: Prop) => {
  const { isFilter = true, onApplyFilter } = props;

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      onFilter: onApplyFilter
    });
  };

  return (
    <View style={styles.filterContainer}>
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={upperCase(translate("calendar.calendar_title_header"))}
        icon={ICON_CALENDAR}
        isShowFilter={isFilter}
        onPressFilter={onPressFilter}
      />
    </View>
  );
};

export default CalendarFilter;
