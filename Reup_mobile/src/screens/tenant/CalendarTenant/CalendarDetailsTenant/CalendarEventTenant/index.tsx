import React, { useState, useRef } from "react";
import { ScrollView } from "react-native";
import AgendaList from "../AgendaListTenant";
import styles from "../styles";
import DropdownNative, { ObjDropdown } from "@src/components/Dropdown/DropdownNative";
import CalendarStatusTenant from "../../ComponentTenant/CalendarStatusTenant";
import { IEvent } from "@reup/reup-api-sdk/libs/api/calendar/event/models";
import { Config } from "@src/configs/appConfig";
import moment from "moment";
import { monthOrDayFormatNumberToString } from "@src/utils/date";

type Props = {
  year: number;
  month: number;
  events: IEvent[];
  changeDropDown: (ojbKey: string) => void;
  listWeekOfMonth?: ObjDropdown[];
}

const CalendarEventTenant = (props: Props) => {
  const { year, month, events, changeDropDown, listWeekOfMonth } = props;
  const [daySelect, setDaySelect] = useState(
    moment(`${year}-${monthOrDayFormatNumberToString(month)}-01`, Config.Manager.formatDateDisplay)
      .startOf("week")
      .format(Config.Manager.formatDateDisplay)
  );
  const agendaRef: any = useRef();
  const selectIndex = listWeekOfMonth && listWeekOfMonth.findIndex(item => item._key === daySelect);

  const onChangeWeekOfMonth = (obj: ObjDropdown) => {
    setDaySelect(obj._key);
    changeDropDown(obj._key);
  };

  return (
    <>
      <DropdownNative
        arrData={listWeekOfMonth}
        containerStyle={styles.timeFilterContainer}
        selected={selectIndex && selectIndex > 0 ? selectIndex : 0}
        onChangeDropDown={obj => {
          onChangeWeekOfMonth(obj);
          //@ts-ignores
          agendaRef.current.chooseDay(moment(obj._key).startOf("week").format(Config.Manager.formatDateDisplay));
        }}
        isShowAccessory={true}
        linearGradientColors={['transparent', 'transparent']}
        textStyle={styles.timeFilterText}
        iconRightStyle={styles.arrowStyle}
        buttonContainer={styles.buttonContainer}
        isHideTitle={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.agendaContainer}>
        <AgendaList
          agendaRef={agendaRef}
          selectDay={daySelect}
          events={events}
        />
      </ScrollView>
      <CalendarStatusTenant />
    </>
  );
};

export default CalendarEventTenant;

