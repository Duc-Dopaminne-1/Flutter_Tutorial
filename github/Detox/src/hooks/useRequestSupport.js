import React, {createContext, useState} from 'react';

const initialState = {
  ticketInfo: {},
  consultantInfo: {},
};

const RequestSupportContext = createContext(initialState);
const RequestSupportProvider = ({children}) => {
  const [state, setState] = useState(initialState);

  const setConsultantInfo = info => {
    setState({
      ...state,
      consultantInfo: info,
    });
  };

  const resetState = () => {
    setState(initialState);
  };

  const setTicketInfo = info => {
    setState({
      ...state,
      ticketInfo: info,
    });
  };

  return (
    <RequestSupportContext.Provider
      value={{
        state,
        setState,
        setTicketInfo,
        setConsultantInfo,
        resetState,
      }}>
      {children}
    </RequestSupportContext.Provider>
  );
};

export {RequestSupportContext, RequestSupportProvider};
