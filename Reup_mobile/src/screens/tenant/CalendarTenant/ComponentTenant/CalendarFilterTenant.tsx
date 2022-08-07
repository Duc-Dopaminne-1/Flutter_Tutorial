import React from "react";
import { View } from "react-native";
import styles from "../styles";
import translate from "@src/localize";
import { upperCase } from 'lodash';
import ICON_CALENDAR from '@src/res/icons/icon_calendar.png';
import CustomSectionHeader from "@src/components/CustomSection";

interface Prop {

}

const CalendarFilterTenant = (props: Prop) => {
  return (
    <View style={styles.filterContainer}>
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={upperCase(translate("calendar.calendar_title_header"))}
        icon={ICON_CALENDAR}
        isShowFilter={false}
      />
    </View>
  );
};

export default CalendarFilterTenant;
