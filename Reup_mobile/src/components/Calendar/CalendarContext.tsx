import * as React from 'react';

export const CalendarContext = React.createContext({});

export const CalendarProvider = CalendarContext.Provider;
export const CalendarConsumer = CalendarContext.Consumer;
