import { Subject } from 'rxjs';

export const TouchDiscovery: TouchDiscoveryProp = {
  Back: 'BACK',
  Close: 'Close',
  Like: 'Like',
};

interface TouchDiscoveryProp {
  Back: string;
  Close: string;
  Like: string;
}

export const bidMax = new Subject<{ userId: string }>();
export const firstProfile = new Subject();
export const refreshMyBid = new Subject();
export const shouldSwipe = new Subject<{ status: boolean }>();
export const UpdateTotalSelectContact = new Subject();
export const getMyAuction = new Subject();
export const onClickIconFilter = new Subject();
export const shareContact = new Subject<{ title: string }>();
export const requestCharity = new Subject();
export const showGetVerify = new Subject();
export const touchDiscovery = new Subject<{
  type: string;
}>();
