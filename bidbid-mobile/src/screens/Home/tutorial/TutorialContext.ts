import * as React from 'react';

interface TutorialContextProps {
  onNextStep?: () => void;
}

export const TutorialContext = React.createContext({} as TutorialContextProps);
