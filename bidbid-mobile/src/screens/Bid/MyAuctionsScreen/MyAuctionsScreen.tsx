import React, { ReactElement } from 'react';
import MyAuctionsContainer from './MyAuctionsContainer';

interface Prop {
  tabLabel?: string;
}

export default function MyAuctionsScreen(_props: Prop): ReactElement {
  return <MyAuctionsContainer />;
}
