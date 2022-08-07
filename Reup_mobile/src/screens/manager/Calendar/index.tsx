import React, { useState, useEffect } from 'react';
import { ScrollView, View } from "react-native";
import Container from "@src/components/Container";
import styles from "./styles";
import translate from "@src/localize";
import CalendarFilter, { Filter } from '@screens/manager/Calendar/Component/CalendarFilter';
import CalendarByMonth from '@screens/manager/Calendar/CalendarByMonth';
import CalendarStatus from '@screens/manager/Calendar/Component/CalendarStatus';
import moment from 'moment';
import { IQueryEventRequest } from '@reup/reup-api-sdk/libs/api/calendar/event';
import { useSeleuseSelectorctor } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { clone } from 'lodash';
import { IEvent } from '@reup/reup-api-sdk/libs/api/calendar/event/models';
import { ordinalDay, numberWeeksOfMonth, getStartAndEndDate, monthOrDayFormatNumberToString } from '@src/utils/date';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { CustomButton } from '@src/components/CustomButton';
import { ADD_PLUS } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';
import { NEW_CALENDAR_EVENT, CALENDAR_DETAILS } from '@src/constants/screenKeys';

const CalendarScreen = () => {
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const currentYear = moment().year();
  const currentMonth = moment().month() + 1;
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [listWeekOfMonth, setListWeekOfMonth] = useState<ObjDropdown[]>([]);
  const [params, setParams] = useState<IQueryEventRequest>(
    {
      from_date: '',
      to_date: '',
      company_id: me && me.default_company ? me.default_company.id : '',
      country_id: '',
      property_id: ''
    }
  );

  useEffect(() => {
    getWeeksOfMonth(selectedYear, selectedMonth);
  }, [])

  const onDateChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    getWeeksOfMonth(year, month);
  }

  useEffect(() => {
    if (me && me.default_company && me.default_company.id) {
      setParams({
        ...params,
        company_id: me && me.default_company ? me.default_company.id : '',
      })
    }
  }, [me.default_company.id])

  const onApplyFilter = (filter: Filter) => {
    setParams({
      ...params,
      country_id: filter.country ?? '',
      property_id: filter.building ?? '',
    })
  };

  const eventCallback = () => {
    const temp_param = clone(params);
    setParams(temp_param);
  }

  const callBackData = (data: IEvent[]) => {
    setEvents(data);
  }

  const getWeeksOfMonth = (year: number, month: number) => {
    const formatMonth = monthOrDayFormatNumberToString(month);
    const numberOfWeek = numberWeeksOfMonth(year.toString(), formatMonth)
    const objDate = getStartAndEndDate(month, year);
    const listWeek: ObjDropdown[] = [];
    for (let i = 0; i < numberOfWeek.length; i++) {
      let startDay = '';
      let endDay = '';
      if (i === 0) {
        startDay = "01"
        endDay = moment(objDate.startDate).
          endOf("week").
          format('DD');
      } else if (i === numberOfWeek.length - 1) {
        startDay = moment(objDate.endDate).startOf("week").format('DD')
        endDay = moment(objDate.endDate).format('DD');
      } else {
        startDay = moment(numberOfWeek[i].startDay).format('DD');
        endDay = moment(numberOfWeek[i].endDay).format('DD');
      }
      listWeek.push(convertDateToStringDropDown(year, month, startDay, endDay))
    }
    setListWeekOfMonth(listWeek);
  }

  const convertDateToStringDropDown = (year: number, month: number, startDay: string, endDay: string) => {
    const nthStart = ordinalDay(startDay);
    const nthEnd = ordinalDay(endDay);
    return {
      _key: `${year}-${monthOrDayFormatNumberToString(month)}-${startDay}`,
      _value: `${nthStart}-${nthEnd} ${month}, ${year}`
    }
  }

  const onPressNewCalendar = () => {
    NavigationActionsService.push(NEW_CALENDAR_EVENT, { addEventCallback: eventCallback });
  };

  const onPressViewDetail = () => {
    NavigationActionsService.push(CALENDAR_DETAILS,
      {
        month: selectedMonth,
        year: selectedYear,
        events,
        changeStatusEventCallback: eventCallback,
        listWeekOfMonth
      }
    );
  };

  const renderAddNewButton = () => (
    <View style={styles.bottomButtonContainer}>
      <CustomButton
        style={styles.bottomButton}
        text={translate("calendar.text_add_event")}
        onPress={onPressNewCalendar.bind(undefined)}
        iconLeft={ADD_PLUS}
      />
    </View>
  )

  const renderViewDetailButton = () => (
    <CustomButton
      onPress={onPressViewDetail}
      style={styles.viewDetailButton}
      textStyle={styles.viewDetailText}
      text={translate('calendar.calendar_view_detail')}
    />
  )

  return (
    <Container
      isShowHeader={true}
      spaceBottom={true}
      title={translate("calendar.calendar_title_header")}>
      <CalendarFilter onApplyFilter={onApplyFilter} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.middleScrollViewContent}
        style={styles.middleScrollView}>
        <CalendarByMonth callBackData={callBackData} onDateChangeCallBack={onDateChange} params={params} />
        {renderViewDetailButton()}
        <CalendarStatus />
      </ScrollView>
      {renderAddNewButton()}
    </Container>
  );
};

export default CalendarScreen;
