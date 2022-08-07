import {createContext} from 'react';

export const PostType = {
  sale: 'sale',
  rent: 'rent',
};

export const initialState = {
  c2CDemandId: '',
  title: '',
  servicePostType: '',
  propertyTypeId: [],
  place: {
    city: null,
    districts: null,
  },
  price: {
    priceRangeTo: 0,
    priceRangeFrom: 0,
  },
  square: {
    squareRangeTo: 0,
    squareRangeFrom: 0,
  },
  direction: null,
  propertyLocation: null,
  numberOfBedrooms: 0,
  numberOfBathrooms: 0,
  projectId: null,
  requesterIsBuyer: '',
  requesterFullName: '',
  requesterPhone: '',
  requesterEmail: '',
  tokenCaptcha: '',
};

const NewRequestContext = createContext(initialState);

export {NewRequestContext};
