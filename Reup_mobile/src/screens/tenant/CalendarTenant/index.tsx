import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, View } from "react-native";
import Container from "@src/components/Container";
import styles from "./styles";
import translate from "@src/localize";
import CalendarStatusTenant from './ComponentTenant/CalendarStatusTenant';
import CalendarFilterTenant, { Filter } from './ComponentTenant/CalendarFilterTenant';
import CalendarByMonthTenant from './CalendarByMonthTenant';
import { CustomButton } from '@src/components/CustomButton';
import { ADD_PLUS } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';
import { CALENDAR_DETAILS_TENANT, NEW_CALENDAR_EVENT_TENANT } from '@src/constants/screenKeys';
import { monthOrDayFormatNumberToString, numberWeeksOfMonth, getStartAndEndDate, ordinalDay } from '@src/utils/date';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IEvent } from '@reup/reup-api-sdk/libs/api/calendar/event/models';
import { LimitGetAll } from '@src/constants/vars';
import { filter } from 'lodash';
import { EventStatus } from '@reup/reup-api-sdk/libs/api/enum';
import { getListEvent } from '@src/modules/calendar/actions';

const CalendarScreenTenant = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const currentYear = moment().year();
  const currentMonth = moment().month() + 1;
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [listWeekOfMonth, setListWeekOfMonth] = useState<ObjDropdown[]>([]);

  useEffect(() => {
    getWeeksOfMonth(selectedYear, selectedMonth);
  }, []);

  useEffect(() => {
    onGetListEventOfMonth();
  }, [selectedYear, selectedMonth]);

  const onGetListEventOfMonth = () => {
    NavigationActionsService.showLoading();
    setEvents([]);
    const objDate = getStartAndEndDate(selectedMonth, selectedYear);
    dispatch(
      getListEvent({
        page: 1,
        limit: LimitGetAll,
        propertyId: me && me.default_property ? me.default_property : '',
        q: {
          from_date: moment(objDate.startDate).startOf('day').toISOString(),
          to_date: moment(objDate.endDate).endOf('day').toISOString()
        },
        isSave: false,
        onSuccess: data => {
          NavigationActionsService.hideLoading();
          data && data.results && setEvents(filter(data.results, (item: IEvent) => item.status !== EventStatus.Reject));
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setEvents([]);
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  };

  const onDateChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    getWeeksOfMonth(year, month);
  };

  const eventCallback = () => {
    onGetListEventOfMonth();
  };

  const getWeeksOfMonth = (year: number, month: number) => {
    const formatMonth = monthOrDayFormatNumberToString(month);
    const numberOfWeek = numberWeeksOfMonth(year.toString(), formatMonth);
    const objDate = getStartAndEndDate(month, year);
    const listWeek: ObjDropdown[] = [];
    for (let i = 0; i < numberOfWeek.length; i++) {
      let startDay = '';
      let endDay = '';
      if (i === 0) {
        startDay = "01";
        endDay = moment(objDate.startDate).
          endOf("week").
          format('DD');
      } else if (i === numberOfWeek.length - 1) {
        startDay = moment(objDate.endDate).startOf("week").format('DD');
        endDay = moment(objDate.endDate).format('DD');
      } else {
        startDay = moment(numberOfWeek[i].startDay).format('DD');
        endDay = moment(numberOfWeek[i].endDay).format('DD');
      }
      listWeek.push(convertDateToStringDropDown(year, month, startDay, endDay));
    }
    setListWeekOfMonth(listWeek);
  };

  const convertDateToStringDropDown = (year: number, month: number, startDay: string, endDay: string) => {
    const nthStart = ordinalDay(startDay);
    const nthEnd = ordinalDay(endDay);
    return {
      _key: `${year}-${monthOrDayFormatNumberToString(month)}-${startDay}`,
      _value: `${nthStart}-${nthEnd} ${month}, ${year}`
    };
  };

  const onPressNewCalendar = () => {
    NavigationActionsService.push(NEW_CALENDAR_EVENT_TENANT, { addEventCallback: eventCallback });
  };

  const onPressViewDetail = () => {
    NavigationActionsService.push(CALENDAR_DETAILS_TENANT, {
      month: selectedMonth,
      year: selectedYear,
      events,
      listWeekOfMonth
    });
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
  );

  const renderViewDetailButton = () => (
    <CustomButton
      onPress={onPressViewDetail.bind(undefined)}
      style={styles.viewDetailButton}
      textStyle={styles.viewDetailText}
      text={translate('calendar.calendar_view_detail')}
    />
  );


  return (
    <Container
      isShowHeader={true}
      spaceBottom={true}
      title={translate("calendar.calendar_title_header")}>
      <CalendarFilterTenant />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.middleScrollViewContent}
        style={styles.middleScrollView}>
        <CalendarByMonthTenant events={events} onDateChangeCallBack={onDateChange} />
        {renderViewDetailButton()}
        <CalendarStatusTenant />
      </ScrollView>
      {renderAddNewButton()}
    </Container>
  );
};

export default CalendarScreenTenant;
