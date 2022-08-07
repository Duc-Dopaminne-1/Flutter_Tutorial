import { EventStatus } from "@reup/reup-api-sdk/libs/api/enum";

export interface EventDetail {
  name: string,
  type: string,
  from: string,
  to: string,
  date: string,
  place: string,
  status: EventStatus
}

export const calendarEventDetails = [
  {
    name: 'Meeting',
    type: 'Swimming Pool',
    from: 7,
    to: 8,
    date: '2020-07-27',
    place: 'Block A-1382, Block A-1382 Block A-1382',
    status: EventStatus.Accept
  },
  {
    name: 'Company Trip',
    type: 'BBQ',
    from: 11,
    to: 11,
    date: '2020-07-28',
    place: 'Block A-1382',
    status: EventStatus.Reject
  },
  {
    name: 'Release App',
    type: 'BBQ',
    from: 14,
    to: 14,
    date: '2020-07-28',
    place: 'Block A-1382, Block A-1382 Block A-1382',
    status: EventStatus.Waiting
  },
  {
    name: 'Party',
    type: 'Swimming Pool',
    from: 15,
    to: 17,
    date: '2020-07-29',
    place: 'Block A-1382',
    status: EventStatus.Accept
  },
  {
    name: 'Party',
    type: 'Swimming Pool',
    from: 19,
    to: 22,
    date: '2020-07-30',
    place: 'Block A-1382',
    status: EventStatus.Reject
  }
];
