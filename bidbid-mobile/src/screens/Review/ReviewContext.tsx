import * as React from 'react';

interface ReviewContextProps {
  reviewObj?: any;
}

export const ReviewContext = React.createContext({} as ReviewContextProps);
