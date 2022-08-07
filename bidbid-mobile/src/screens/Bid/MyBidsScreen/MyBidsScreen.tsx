import React, { ReactElement } from 'react';
import MyBidsContainer from '@/screens/Bid/MyBidsScreen/components/MyBidsContainer';

interface Prop {
  tabLabel?: string;
}

export default function MyBidsScreen(_props: Prop): ReactElement {
  return <MyBidsContainer />;
}
