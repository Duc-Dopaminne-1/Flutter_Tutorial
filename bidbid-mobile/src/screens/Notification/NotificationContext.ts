import * as React from 'react';

interface NotificationContextProps {
  isEmpty: boolean;
  onSetStatusData: (data: boolean) => void;
}

export const NotificationContext = React.createContext({} as NotificationContextProps);
