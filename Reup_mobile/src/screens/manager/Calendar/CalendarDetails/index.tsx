import React, { useState, useEffect } from "react";
import translate from "@src/localize";
import Container from "@src/components/Container";
import CalendarFilter from '@screens/manager/Calendar/Component/CalendarFilter';
import CalendarEvent from '@screens/manager/Calendar/CalendarDetails/CalendarEvent';
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import NavigationActionsService from "@src/navigation/navigation";
import { IEvent } from "@reup/reup-api-sdk/libs/api/calendar/event/models";
import { RootState } from "@src/types/types";
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models";
import moment from "moment";
import { Config } from "@src/configs/appConfig";
import { getListEvent } from "@src/modules/calendar/actions";
import { LimitGetAll } from "@src/constants/vars";
import { Alert } from "react-native";
import { filter } from "lodash";
import { EventStatus } from "@reup/reup-api-sdk/libs/api/enum";
import { ObjDropdown } from "@src/components/Dropdown/DropdownNative";
import { monthOrDayFormatNumberToString } from "@src/utils/date";

interface Props {
  month: number;
  year: number;
  events: IEvent[];
  listWeekOfMonth?: ObjDropdown[];
  changeStatusEventCallback?: () => void;
}

const CalendarDetails = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const { month, year, events, changeStatusEventCallback, listWeekOfMonth } = route.params as Props;
  const [listEvents, setListEvents] = useState<IEvent[]>(events);

  const changeDropDown = (objKey: string) => {
    fetchDataWeekOfMonth();
  };

  const fetchDataWeekOfMonth = (isCallBack = false) => {
    !isCallBack && NavigationActionsService.showLoading();
    const objDate = moment(`${year}-${monthOrDayFormatNumberToString(month)}-01`).format(Config.Manager.formatDateDisplay);
    const q: any = {
      company_id: me && me.default_company ? me.default_company.id : '',
      from_date: moment(moment(objDate).format(Config.Manager.formatDateDisplay)).toISOString(),
      to_date: moment(moment(objDate).endOf("month").format(Config.Manager.formatDateDisplay)).toISOString()
    };

    dispatch(
      getListEvent({
        page: 1,
        limit: LimitGetAll,
        isSave: false,
        q: q,
        onSuccess: data => {
          NavigationActionsService.hideLoading();
          data && data.results && setListEvents(filter(data.results, (item: IEvent) => item.status !== EventStatus.Reject));
          isCallBack && changeStatusEventCallback && changeStatusEventCallback();
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setListEvents([]);
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  };

  const changeStatusEvent = () => {
    fetchDataWeekOfMonth(true);
  };

  return (
    <Container
      isShowHeader={true}
      spaceBottom={true}
      isDisplayNotification={false}
      isDisplayMenuButton={false}
      title={translate("calendar.calendar_details_title_header")}
    >
      <CalendarFilter isFilter={false} />
      <CalendarEvent
        year={year}
        month={month}
        events={listEvents}
        changeDropDown={changeDropDown}
        listWeekOfMonth={listWeekOfMonth}
        changeStatusEventCallback={changeStatusEvent}
      />
    </Container>
  );
};

export default React.memo(CalendarDetails);

