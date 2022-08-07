import * as React from 'react';

interface CreatePhotoContextProps {
  onAddImage?: (image: any) => void;
}

export const CreatePhotoContext = React.createContext({} as CreatePhotoContextProps);
