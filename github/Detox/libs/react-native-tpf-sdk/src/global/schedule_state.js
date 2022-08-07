import { CUSTOM_COLOR } from '../constants/colors';

export const ScheduleState = [
  {
    id: 0,
    title: 'schedule_state.cancel',
    backgroundColor: CUSTOM_COLOR.ShuttleGray,
    status: 'Canceled'
  },
  {
    id: 1,
    title: 'schedule_state.coming',
    backgroundColor: CUSTOM_COLOR.LightOrange,
    status: 'Upcoming'
  },
  {
    id: 2,
    title: 'schedule_state.finish',
    backgroundColor: CUSTOM_COLOR.PersianGreen,
    status: 'Completed'
  },
  {
    id: 3,
    title: 'schedule_state.overtime',
    backgroundColor: CUSTOM_COLOR.Flamingo,
    status: 'Overdue'
  },
  {
    id: 4,
    title: 'schedule_state.waitingForPartnerAccept',
    backgroundColor: CUSTOM_COLOR.LightOrange,
    status: 'WaitingForPartnerAccept'
  },
  {
    id: 5,
    title: 'schedule_state.reject',
    backgroundColor: CUSTOM_COLOR.ShuttleGray,
    status: 'Reject'
  }
];

export const ScheduleStatus = {
  UPCOMING: 'Upcoming',
  COMPLETED: 'Completed',
  CANCELED: 'Canceled',
  OVERDUE: 'Overdue',
  WAITINGFORPARTNERACCEPT: 'WaitingForPartnerAccept',
  REJECT: 'Reject'
};
