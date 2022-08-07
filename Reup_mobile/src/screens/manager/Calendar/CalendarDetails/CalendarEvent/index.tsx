import React, { useState, useRef, useEffect } from "react";
import { ScrollView } from "react-native";
import AgendaList from "../AgendaList";
import styles from "../styles";
import DropdownNative, { ObjDropdown } from "@src/components/Dropdown/DropdownNative";
import CalendarStatus from '@screens/manager/Calendar/Component/CalendarStatus';
import { monthOrDayFormatNumberToString } from "@src/utils/date";
import { IEvent } from "@reup/reup-api-sdk/libs/api/calendar/event/models";
import { Config } from "@src/configs/appConfig";
import moment from "moment";
import { clone, filter } from "lodash";
import { EventStatus } from "@reup/reup-api-sdk/libs/api/enum";

type Props = {
  year: number;
  month: number;
  events: IEvent[];
  changeDropDown: (ojbKey: string) => void;
  listWeekOfMonth?: ObjDropdown[];
  changeStatusEventCallback?: () => void;
}

const CalendarEvent = (props: Props) => {
  const { year, month, events, changeDropDown, listWeekOfMonth, changeStatusEventCallback } = props;
  const [listEvent, setListEvent] = useState<IEvent[]>(events);
  const [daySelect, setDaySelect] = useState(
    moment(`${year}-${monthOrDayFormatNumberToString(month)}-01`, Config.Manager.formatDateDisplay)
      .startOf("week")
      .format(Config.Manager.formatDateDisplay)
  );
  const agendaRef: any = useRef(null);
  const selectIndex = listWeekOfMonth && listWeekOfMonth.findIndex(item => item._key === daySelect);

  useEffect(() => {
    const cloneEvents = clone(events);
    const filterEvents = filter(cloneEvents, (event: IEvent) => event.status !== EventStatus.Reject.valueOf());
    setListEvent(filterEvents);
  }, [events]);

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
          events={listEvent}
          changeStatusEventCallback={changeStatusEventCallback}
        />
      </ScrollView>
      <CalendarStatus />
    </>
  );
};

export default React.memo(CalendarEvent);
