import React from 'react';
import renderer from 'react-test-renderer';

import MoreScreen from './MoreScreen';

jest.mock('../Auth/useLogin', () => {
  return {
    useLogin: () => ({
      showLogin: jest.fn(),
    }),
  };
});

it('renders correctly', () => {
  const tree = renderer.create(<MoreScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
