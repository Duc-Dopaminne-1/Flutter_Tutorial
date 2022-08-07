import React, {createContext, useState} from 'react';

const initialState = {
  propertyPosts: [],
};

const FloorTabContext = createContext(initialState);

const FloorTabProvider = ({children}) => {
  const [state, setState] = useState(initialState);
  const value = {state, setState};
  return <FloorTabContext.Provider value={value}>{children}</FloorTabContext.Provider>;
};

const routeKeys = {
  all: 'all',
  empty: 'empty',
  booked: 'booked',
  deposit: 'deposit',
};

export {FloorTabContext, FloorTabProvider, routeKeys};
