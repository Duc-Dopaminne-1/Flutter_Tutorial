import React from 'react';
import renderer from 'react-test-renderer';

import UtilitiesScreen from './UtilitiesScreen';

jest.mock('../Auth/useLogin', () => {
  return {
    useLogin: () => ({
      showLogin: jest.fn(),
    }),
  };
});

it('renders correctly', () => {
  const tree = renderer.create(<UtilitiesScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
