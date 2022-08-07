import translate from '@src/localize';

export interface AdminDecentralization {
  id: string;
  title: string;
  isRightComponent: boolean;
}
export const adminDecentralizationData: AdminDecentralization[] = [
  { id: '1', title: translate('invite_staff.all_building'), isRightComponent: false },
  { id: '2', title: translate('invite_staff.country'), isRightComponent: false },
  { id: '3', title: translate('invite_staff.building'), isRightComponent: false },

];
