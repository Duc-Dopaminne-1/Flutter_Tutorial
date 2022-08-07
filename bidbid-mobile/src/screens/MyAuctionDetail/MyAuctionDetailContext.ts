import * as React from 'react';

interface MyAuctionDetailContextProps {
  onCallZoom: () => void;
  onOpenRule: (isFromTextTitle?: boolean) => void;
}

export const MyAuctionDetailContext = React.createContext({} as MyAuctionDetailContextProps);
