import * as React from 'react';

interface HomeDetailContextProps {
  profile?: any;
  isAuction?: boolean;
  onSetAuction?: (data: boolean) => void;
  auctionId: string;
  profileId?: string;
  isDeepLink: boolean;
}

export const HomeDetailContext = React.createContext({} as HomeDetailContextProps);
