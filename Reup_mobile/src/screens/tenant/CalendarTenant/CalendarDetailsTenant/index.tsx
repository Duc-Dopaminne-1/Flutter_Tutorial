import React, { useState } from "react";
import translate from "@src/localize";
import Container from "@src/components/Container";
import CalendarFilterTenant from "../ComponentTenant/CalendarFilterTenant";
import CalendarEventTenant from "./CalendarEventTenant";
import { IEvent } from "@reup/reup-api-sdk/libs/api/calendar/event/models";
import { ObjDropdown } from "@src/components/Dropdown/DropdownNative";
import { useRoute } from "@react-navigation/native";
import NavigationActionsService from "@src/navigation/navigation";
import moment from "moment";
import { monthOrDayFormatNumberToString } from "@src/utils/date";
import { Config } from "@src/configs/appConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/types/types";
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models";
import { getListEvent } from "@src/modules/calendar/actions";
import { LimitGetAll } from "@src/constants/vars";
import { filter } from "lodash";
import { Alert } from "react-native";
import { EventStatus } from "@reup/reup-api-sdk/libs/api/enum";

interface Props {
  month: number;
  year: number;
  events: IEvent[];
  listWeekOfMonth?: ObjDropdown[];
}

const CalendarDetailsTenant = (props: Props) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const { month, year, events, listWeekOfMonth } = route.params as Props;
  const [listEvents, setListEvents] = useState<IEvent[]>(events);

  const changeDropDown = () => {
    fetchDataWeekOfMonth();
  };

  const fetchDataWeekOfMonth = () => {
    NavigationActionsService.showLoading();
    const objDate = moment(`${year}-${monthOrDayFormatNumberToString(month)}-01`).format(Config.Manager.formatDateDisplay);
    const q: any = {
      propertyId: me && me.default_property ? me.default_property : '',
      from_date: moment(moment(objDate).format(Config.Manager.formatDateDisplay)).toISOString(),
      to_date: moment(moment(objDate).endOf("month").format(Config.Manager.formatDateDisplay)).toISOString()
    };

    dispatch(
      getListEvent({
        page: 1,
        limit: LimitGetAll,
        propertyId: me && me.default_property ? me.default_property : '',
        q,
        isSave: false,
        onSuccess: data => {
          NavigationActionsService.hideLoading();
          data && data.results && setListEvents(filter(data.results, (item: IEvent) => item.status !== EventStatus.Reject));
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

  return (
    <Container
      isShowHeader={true}
      title={translate("calendar.calendar_details_title_header")}
      spaceBottom
    >
      <CalendarFilterTenant />
      <CalendarEventTenant
        year={year}
        month={month}
        events={listEvents}
        changeDropDown={changeDropDown}
        listWeekOfMonth={listWeekOfMonth}
      />
    </Container>
  );
};

export default CalendarDetailsTenant;

