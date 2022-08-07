import React, { ReactElement } from 'react';
import { MyAuctionsContainerContext } from './MyAuctionsContainerContext';
import MyAuctionsPresenter from './MyAuctionsPresenter';

export default function MyAuctionsContainer(): ReactElement {
  return (
    <MyAuctionsContainerContext.Provider value={{}}>
      <MyAuctionsPresenter />
    </MyAuctionsContainerContext.Provider>
  );
}
