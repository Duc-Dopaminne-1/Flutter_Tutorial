import * as React from 'react';
import { Auction } from '@/models';

interface PlaceABidContextProps {
  errorMessageHandler: (message: string) => void;
  isAuctionRaffle?: boolean;
  auction?: Auction;
}

export const PlaceABidContext = React.createContext({} as PlaceABidContextProps);
